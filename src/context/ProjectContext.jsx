import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useOnboarding } from './OnboardingContext'

const ProjectContext = createContext(null)

export function ProjectProvider({ children }) {
  const { user, formData, goToChat } = useOnboarding()

  // Project state
  const [myProjects, setMyProjects] = useState([])
  const [publishedProjects, setPublishedProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [projectLoading, setProjectLoading] = useState(false)

  // Application state
  const [applications, setApplications] = useState([])
  const [myApplications, setMyApplications] = useState([])

  // Notification state
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Polling ref
  const pollRef = useRef(null)

  // ─── Project CRUD (T005) ───────────────────────────────────────

  const createProject = useCallback(async (data) => {
    if (!user) return null
    const { data: project, error } = await supabase
      .from('projects')
      .insert({ ...data, creator_id: user.id })
      .select()
      .single()
    if (error) { console.error('[Projects] create:', error.message); return null }
    setMyProjects((prev) => [project, ...prev])
    return project
  }, [user])

  const updateProject = useCallback(async (id, data) => {
    if (!user) return null
    const { data: project, error } = await supabase
      .from('projects')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('creator_id', user.id)
      .select()
      .single()
    if (error) { console.error('[Projects] update:', error.message); return null }
    setMyProjects((prev) => prev.map((p) => p.id === id ? project : p))
    setCurrentProject((prev) => prev?.id === id ? project : prev)
    return project
  }, [user])

  const fetchMyProjects = useCallback(async () => {
    if (!user) return
    setProjectLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
    setProjectLoading(false)
    if (error) { console.error('[Projects] fetchMine:', error.message); return }
    setMyProjects(data ?? [])
  }, [user])

  const fetchPublishedProjects = useCallback(async (filters = {}) => {
    setProjectLoading(true)
    let query = supabase
      .from('projects')
      .select('*, profiles!creator_id(first_name, last_name, username, avatar_url)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filters.content_format) query = query.eq('content_format', filters.content_format)
    if (filters.niche) query = query.contains('niches', [filters.niche])
    if (filters.budget_min) query = query.or(`budget_fixed.gte.${filters.budget_min},budget_max.gte.${filters.budget_min}`)
    if (filters.budget_max) query = query.or(`budget_fixed.lte.${filters.budget_max},budget_min.lte.${filters.budget_max}`)
    if (filters.deadline) query = query.gte('deadline', filters.deadline)
    if (filters.preferred_software) query = query.contains('preferred_software', [filters.preferred_software])
    if (filters.mission_type) query = query.eq('mission_type', filters.mission_type)
    if (filters.thumbnail_included) query = query.eq('thumbnail_included', true)

    const { data, error } = await query
    setProjectLoading(false)
    if (error) { console.error('[Projects] fetchPublished:', error.message); return }
    setPublishedProjects(data ?? [])
  }, [])

  const fetchProjectById = useCallback(async (id) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, profiles!creator_id(first_name, last_name, username, avatar_url)')
      .eq('id', id)
      .single()
    if (error) { console.error('[Projects] fetchById:', error.message); return null }
    setCurrentProject(data)
    return data
  }, [])

  // ─── Lifecycle transitions (T038) ─────────────────────────────

  const publishProject = useCallback(async (id) => {
    return updateProject(id, { status: 'published' })
  }, [updateProject])

  const cancelProject = useCallback(async (id) => {
    const project = await updateProject(id, { status: 'cancelled' })
    if (!project) return null
    // Notify all pending/accepted applicants
    const { data: reqs } = await supabase
      .from('contact_requests')
      .select('id, editor_id')
      .eq('project_id', id)
      .in('status', ['pending', 'accepted'])
    if (reqs?.length) {
      const notifs = reqs.map((r) => ({
        user_id: r.editor_id,
        type: 'project_cancelled',
        project_id: id,
        request_id: r.id,
        actor_id: user.id,
        actor_name: `${formData.firstName} ${formData.lastName}`.trim() || 'Créateur',
        project_title: project.title,
      }))
      await supabase.from('notifications').insert(notifs)
    }
    return project
  }, [updateProject, user, formData])

  const completeProject = useCallback(async (id) => {
    return updateProject(id, { status: 'completed' })
  }, [updateProject])

  const updatePublishedProject = useCallback(async (id, changes) => {
    const project = await updateProject(id, changes)
    if (!project) return null
    // Notify existing applicants of modifications
    const { data: reqs } = await supabase
      .from('contact_requests')
      .select('id, editor_id')
      .eq('project_id', id)
      .in('status', ['pending', 'accepted'])
    if (reqs?.length) {
      const notifs = reqs.map((r) => ({
        user_id: r.editor_id,
        type: 'project_modified',
        project_id: id,
        request_id: r.id,
        actor_id: user.id,
        actor_name: `${formData.firstName} ${formData.lastName}`.trim() || 'Créateur',
        project_title: project.title,
      }))
      await supabase.from('notifications').insert(notifs)
    }
    return project
  }, [updateProject, user, formData])

  // ─── Candidature functions (T007) ─────────────────────────────

  const submitApplication = useCallback(async (project) => {
    if (!user) return null
    const editorName = `${formData.firstName} ${formData.lastName}`.trim() || 'Monteur'
    const { data: req, error } = await supabase
      .from('contact_requests')
      .insert({
        creator_id: project.creator_id,
        editor_id: user.id,
        project_id: project.id,
        status: 'pending',
        initial_message: `Candidature pour "${project.title}"`,
        creator_name: project.profiles?.first_name
          ? `${project.profiles.first_name} ${project.profiles.last_name || ''}`.trim()
          : 'Créateur',
        editor_name: editorName,
      })
      .select()
      .single()
    if (error) { console.error('[Projects] submitApplication:', error.message); return null }
    // Create notification for creator
    await supabase.from('notifications').insert({
      user_id: project.creator_id,
      type: 'application_received',
      project_id: project.id,
      request_id: req.id,
      actor_id: user.id,
      actor_name: editorName,
      project_title: project.title,
    })
    return req
  }, [user, formData])

  const withdrawApplication = useCallback(async (requestId, project) => {
    if (!user) return false
    const { error } = await supabase
      .from('contact_requests')
      .delete()
      .eq('id', requestId)
      .eq('editor_id', user.id)
      .eq('status', 'pending')
    if (error) { console.error('[Projects] withdraw:', error.message); return false }
    // Notify creator
    if (project) {
      await supabase.from('notifications').insert({
        user_id: project.creator_id,
        type: 'application_withdrawn',
        project_id: project.id,
        request_id: requestId,
        actor_id: user.id,
        actor_name: `${formData.firstName} ${formData.lastName}`.trim() || 'Monteur',
        project_title: project.title,
      })
    }
    return true
  }, [user, formData])

  const checkExistingApplication = useCallback(async (projectId) => {
    if (!user) return null
    const { data } = await supabase
      .from('contact_requests')
      .select('id, status')
      .eq('project_id', projectId)
      .eq('editor_id', user.id)
      .maybeSingle()
    return data
  }, [user])

  const fetchProjectApplications = useCallback(async (projectId) => {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*, profiles!editor_id(first_name, last_name, username, avatar_url, skills, formats, niches, experience, software, assigned_level, hourly_rate, bio)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    if (error) { console.error('[Projects] fetchApplications:', error.message); return [] }
    setApplications(data ?? [])
    return data ?? []
  }, [])

  const acceptApplication = useCallback(async (requestId, projectId) => {
    if (!user) return false
    // 1. Accept the selected candidature
    const { error: acceptErr } = await supabase
      .from('contact_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId)
      .eq('creator_id', user.id)
    if (acceptErr) { console.error('[Projects] accept:', acceptErr.message); return false }

    // 2. Get all other pending candidatures for this project
    const { data: otherReqs } = await supabase
      .from('contact_requests')
      .select('id, editor_id')
      .eq('project_id', projectId)
      .neq('id', requestId)
      .eq('status', 'pending')

    // 3. Refuse all other pending candidatures
    if (otherReqs?.length) {
      await supabase
        .from('contact_requests')
        .update({ status: 'refused' })
        .eq('project_id', projectId)
        .neq('id', requestId)
        .eq('status', 'pending')
    }

    // 4. Update project status to filled
    const { data: project } = await supabase
      .from('projects')
      .update({ status: 'filled', updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .eq('creator_id', user.id)
      .select()
      .single()

    // 5. Get the accepted editor info
    const { data: acceptedReq } = await supabase
      .from('contact_requests')
      .select('editor_id, editor_name')
      .eq('id', requestId)
      .single()

    const creatorName = `${formData.firstName} ${formData.lastName}`.trim() || 'Créateur'
    const projectTitle = project?.title || ''

    // 6. Notify accepted editor
    if (acceptedReq) {
      await supabase.from('notifications').insert({
        user_id: acceptedReq.editor_id,
        type: 'application_accepted',
        project_id: projectId,
        request_id: requestId,
        actor_id: user.id,
        actor_name: creatorName,
        project_title: projectTitle,
      })
    }

    // 7. Notify all refused editors
    if (otherReqs?.length) {
      const notifs = otherReqs.map((r) => ({
        user_id: r.editor_id,
        type: 'project_filled',
        project_id: projectId,
        request_id: r.id,
        actor_id: user.id,
        actor_name: creatorName,
        project_title: projectTitle,
      }))
      await supabase.from('notifications').insert(notifs)
    }

    // 8. Navigate to conversation
    goToChat(requestId)
    return true
  }, [user, formData, goToChat])

  const refuseApplication = useCallback(async (requestId) => {
    if (!user) return false
    // Get editor info before refusing
    const { data: req } = await supabase
      .from('contact_requests')
      .select('editor_id, project_id, projects(title)')
      .eq('id', requestId)
      .single()

    const { error } = await supabase
      .from('contact_requests')
      .update({ status: 'refused' })
      .eq('id', requestId)
      .eq('creator_id', user.id)
      .eq('status', 'pending')
    if (error) { console.error('[Projects] refuse:', error.message); return false }

    // Notify editor
    if (req) {
      await supabase.from('notifications').insert({
        user_id: req.editor_id,
        type: 'application_refused',
        project_id: req.project_id,
        request_id: requestId,
        actor_id: user.id,
        actor_name: `${formData.firstName} ${formData.lastName}`.trim() || 'Créateur',
        project_title: req.projects?.title || '',
      })
    }

    // Update local state
    setApplications((prev) => prev.map((a) => a.id === requestId ? { ...a, status: 'refused' } : a))
    return true
  }, [user, formData])

  const fetchMyApplications = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*, projects(*)')
      .eq('editor_id', user.id)
      .not('project_id', 'is', null)
      .order('created_at', { ascending: false })
    if (error) { console.error('[Projects] fetchMyApplications:', error.message); return }
    setMyApplications(data ?? [])
  }, [user])

  // ─── Notification functions (T006) ────────────────────────────

  const createNotification = useCallback(async (params) => {
    const { error } = await supabase.from('notifications').insert(params)
    if (error) console.error('[Notifications] create:', error.message)
  }, [])

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) { console.error('[Notifications] fetch:', error.message); return }
    setNotifications(data ?? [])
  }, [user])

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false)
    if (!error) setUnreadCount(count || 0)
  }, [user])

  const markAsRead = useCallback(async (id) => {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', user.id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [user])

  const markAllAsRead = useCallback(async () => {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [user])

  // Polling: fetch unread count every 30s
  useEffect(() => {
    if (!user) return
    fetchUnreadCount()
    pollRef.current = setInterval(fetchUnreadCount, 30000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [user, fetchUnreadCount])

  // Auto-reset on logout (user becomes null)
  useEffect(() => {
    if (!user) resetProjectState()
  }, [user])

  // ─── Auth cleanup (T045) ──────────────────────────────────────

  const resetProjectState = useCallback(() => {
    setMyProjects([])
    setPublishedProjects([])
    setCurrentProject(null)
    setApplications([])
    setMyApplications([])
    setNotifications([])
    setUnreadCount(0)
    if (pollRef.current) clearInterval(pollRef.current)
  }, [])

  return (
    <ProjectContext.Provider
      value={{
        // Project state
        myProjects, publishedProjects, currentProject, projectLoading,
        // Project CRUD
        createProject, updateProject, fetchMyProjects, fetchPublishedProjects,
        fetchProjectById, publishProject, cancelProject, completeProject,
        updatePublishedProject,
        // Applications
        applications, myApplications,
        submitApplication, withdrawApplication, checkExistingApplication,
        fetchProjectApplications, acceptApplication, refuseApplication,
        fetchMyApplications,
        // Notifications
        notifications, unreadCount, createNotification,
        fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead,
        // Cleanup
        resetProjectState,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects must be used inside ProjectProvider')
  return ctx
}
