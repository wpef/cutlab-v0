# Supabase API Contracts: Projet Createur

**Feature Branch**: `002-short-name-creator`  
**Date**: 2026-04-03

## Overview

All data access uses the Supabase JS client (`@supabase/supabase-js`) with RLS enforcement. No custom backend server. All queries run client-side with the authenticated user's JWT.

---

## 1. Projects — CRUD Operations

### 1.1 Create Project (Draft)

```javascript
const { data, error } = await supabase
  .from('projects')
  .insert({
    creator_id: user.id,
    title,
    description,
    content_format,
    niches,
    deliverables,        // jsonb array
    budget_type,
    budget_fixed,        // or null
    budget_min,          // or null
    budget_max,          // or null
    start_date,          // or null
    deadline,
    quality,
    thumbnail_included,
    video_count,
    video_duration,
    revision_count,
    preferred_software,
    required_languages,
    experience_level,
    mission_type,
    rushes_info,
    status: 'draft'
  })
  .select()
  .single();
```

**Returns**: `{ id, creator_id, title, ..., status: 'draft', created_at, updated_at }`  
**Errors**: 403 if not authenticated or role !== creator. 400 if validation fails.

### 1.2 Update Project

```javascript
const { data, error } = await supabase
  .from('projects')
  .update({ title, description, ..., updated_at: new Date().toISOString() })
  .eq('id', projectId)
  .eq('creator_id', user.id)
  .select()
  .single();
```

**Constraint**: Only creator can update. Only draft projects can be fully edited. Published projects allow non-structural field changes (description, deadline, rushes_info).

### 1.3 Publish Project

```javascript
const { data, error } = await supabase
  .from('projects')
  .update({ status: 'published', updated_at: new Date().toISOString() })
  .eq('id', projectId)
  .eq('creator_id', user.id)
  .eq('status', 'draft')
  .select()
  .single();
```

**Pre-check (client-side)**: Verify `deadline > today` before calling (FR-019).

### 1.4 List Published Projects (Editor Browse)

```javascript
const { data, error } = await supabase
  .from('projects')
  .select('*, profiles!creator_id(first_name, last_name, username, avatar_url)')
  .eq('status', 'published')
  .order('created_at', { ascending: false });
```

**Filters** (applied dynamically):
```javascript
// Format filter
.eq('content_format', selectedFormat)
// Niche filter
.contains('niches', [selectedNiche])
// Budget range filter
.or(`budget_fixed.gte.${min},budget_max.gte.${min}`)
.or(`budget_fixed.lte.${max},budget_min.lte.${max}`)
// Deadline filter
.gte('deadline', minDate)
// Software filter
.contains('preferred_software', [selectedSoftware])
// Mission type filter
.eq('mission_type', selectedType)
// Thumbnail filter
.eq('thumbnail_included', true)
```

### 1.5 List Creator's Projects (My Projects)

```javascript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('creator_id', user.id)
  .order('created_at', { ascending: false });
```

### 1.6 Get Project Detail

```javascript
const { data, error } = await supabase
  .from('projects')
  .select('*, profiles!creator_id(first_name, last_name, username, avatar_url)')
  .eq('id', projectId)
  .single();
```

### 1.7 Change Project Status

```javascript
// Cancel project
const { error } = await supabase
  .from('projects')
  .update({ status: 'cancelled', updated_at: new Date().toISOString() })
  .eq('id', projectId)
  .eq('creator_id', user.id)
  .in('status', ['published', 'filled']);

// Mark complete
const { error } = await supabase
  .from('projects')
  .update({ status: 'completed', updated_at: new Date().toISOString() })
  .eq('id', projectId)
  .eq('creator_id', user.id)
  .eq('status', 'filled');
```

---

## 2. Candidatures — via contact_requests

### 2.1 Submit Candidature (Editor → Project)

```javascript
const { data, error } = await supabase
  .from('contact_requests')
  .insert({
    creator_id: project.creator_id,
    editor_id: user.id,
    project_id: project.id,
    status: 'pending',
    initial_message: `Candidature pour "${project.title}"`,
    creator_name: project.creator_name,    // denormalized
    editor_name: `${profile.first_name} ${profile.last_name}`
  })
  .select()
  .single();
```

**Pre-checks (client-side)**:
- `profile.status === 'published'` (editor profile must be published)
- `project.status === 'published'`
- `project.deadline >= today`
- No existing candidature for `(project_id, editor_id)` — enforced by unique constraint

### 2.2 Check Existing Candidature

```javascript
const { data } = await supabase
  .from('contact_requests')
  .select('id, status')
  .eq('project_id', projectId)
  .eq('editor_id', user.id)
  .maybeSingle();

// data === null → no candidature (show "Candidater" button)
// data.status === 'pending' → show status + withdraw option
// data.status === 'accepted' → show "Conversation" link
// data.status === 'refused' → show "Refusee" status
```

### 2.3 Withdraw Candidature

```javascript
const { error } = await supabase
  .from('contact_requests')
  .delete()
  .eq('id', requestId)
  .eq('editor_id', user.id)
  .eq('status', 'pending');
```

Or soft-delete by updating status:
```javascript
const { error } = await supabase
  .from('contact_requests')
  .update({ status: 'refused' })  // reuse 'refused' or add 'withdrawn'
  .eq('id', requestId)
  .eq('editor_id', user.id)
  .eq('status', 'pending');
```

### 2.4 List Candidatures for a Project (Creator View)

```javascript
const { data, error } = await supabase
  .from('contact_requests')
  .select('*, profiles!editor_id(first_name, last_name, username, avatar_url, skills, formats, niches, experience, software, assigned_level, hourly_rate, bio)')
  .eq('project_id', projectId)
  .order('created_at', { ascending: false });
```

### 2.5 Accept Candidature

```javascript
// 1. Accept the selected candidature
const { error: acceptError } = await supabase
  .from('contact_requests')
  .update({ status: 'accepted' })
  .eq('id', requestId)
  .eq('creator_id', user.id);

// 2. Refuse all other pending candidatures for the same project
const { error: refuseError } = await supabase
  .from('contact_requests')
  .update({ status: 'refused' })
  .eq('project_id', projectId)
  .neq('id', requestId)
  .eq('status', 'pending');

// 3. Update project status to 'filled'
const { error: fillError } = await supabase
  .from('projects')
  .update({ status: 'filled', updated_at: new Date().toISOString() })
  .eq('id', projectId)
  .eq('creator_id', user.id);

// 4. Create notifications (see section 3)
```

### 2.6 Refuse Candidature

```javascript
const { error } = await supabase
  .from('contact_requests')
  .update({ status: 'refused' })
  .eq('id', requestId)
  .eq('creator_id', user.id)
  .eq('status', 'pending');
```

### 2.7 List Editor's Candidatures (My Applications)

```javascript
const { data, error } = await supabase
  .from('contact_requests')
  .select('*, projects(*)')
  .eq('editor_id', user.id)
  .not('project_id', 'is', null)
  .order('created_at', { ascending: false });
```

---

## 3. Notifications

### 3.1 Create Notification

```javascript
const { error } = await supabase
  .from('notifications')
  .insert({
    user_id: recipientId,
    type: 'application_received',     // or other type
    project_id: projectId,
    request_id: requestId,            // nullable
    actor_id: user.id,
    actor_name: `${profile.first_name} ${profile.last_name}`,
    project_title: project.title
  });
```

### 3.2 Fetch Unread Count

```javascript
const { count, error } = await supabase
  .from('notifications')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id)
  .eq('read', false);
```

### 3.3 Fetch Notifications List

```javascript
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(50);
```

### 3.4 Mark as Read

```javascript
// Single
const { error } = await supabase
  .from('notifications')
  .update({ read: true })
  .eq('id', notificationId)
  .eq('user_id', user.id);

// All
const { error } = await supabase
  .from('notifications')
  .update({ read: true })
  .eq('user_id', user.id)
  .eq('read', false);
```

### 3.5 Polling Pattern

```javascript
// In ProjectContext or AppLayout
useEffect(() => {
  if (!user) return;
  
  const fetchCount = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);
    setUnreadCount(count || 0);
  };

  fetchCount();
  const interval = setInterval(fetchCount, 30000); // 30s polling
  return () => clearInterval(interval);
}, [user]);
```

---

## 4. SQL Migration

```sql
-- 1. Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  content_format text,
  niches text[] DEFAULT '{}',
  deliverables jsonb NOT NULL DEFAULT '[]',
  budget_type text NOT NULL DEFAULT 'fixed' CHECK (budget_type IN ('fixed', 'range')),
  budget_fixed numeric CHECK (budget_fixed > 0),
  budget_min numeric CHECK (budget_min > 0),
  budget_max numeric CHECK (budget_max > 0),
  start_date date,
  deadline date NOT NULL,
  quality text,
  thumbnail_included boolean NOT NULL DEFAULT false,
  video_count integer,
  video_duration text,
  revision_count integer DEFAULT 2,
  preferred_software text[] DEFAULT '{}',
  required_languages text[] DEFAULT '{}',
  experience_level text,
  mission_type text,
  rushes_info text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'filled', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT budget_check CHECK (
    (budget_type = 'fixed' AND budget_fixed IS NOT NULL) OR
    (budget_type = 'range' AND budget_min IS NOT NULL AND budget_max IS NOT NULL AND budget_min <= budget_max)
  )
);

CREATE INDEX idx_projects_creator_id ON projects(creator_id);
CREATE INDEX idx_projects_status ON projects(status) WHERE status = 'published';
CREATE INDEX idx_projects_deadline ON projects(deadline) WHERE status = 'published';

-- 2. Add project_id to contact_requests
ALTER TABLE contact_requests ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE SET NULL;
CREATE INDEX idx_contact_requests_project_id ON contact_requests(project_id) WHERE project_id IS NOT NULL;
CREATE UNIQUE INDEX uq_contact_requests_project_editor ON contact_requests(project_id, editor_id) WHERE project_id IS NOT NULL;

-- 3. Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  request_id uuid REFERENCES contact_requests(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id),
  actor_name text,
  project_title text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read = false;

-- 4. RLS Policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published projects are visible to all authenticated users"
  ON projects FOR SELECT
  USING (status = 'published' AND auth.uid() IS NOT NULL);

CREATE POLICY "Creators can view their own projects"
  ON projects FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update their own projects"
  ON projects FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can delete their own draft projects"
  ON projects FOR DELETE
  USING (creator_id = auth.uid() AND status = 'draft');

-- 5. RLS Policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- 6. Extended RLS for contact_requests (editor-initiated candidatures)
CREATE POLICY "Editors can insert candidatures for published projects"
  ON contact_requests FOR INSERT
  WITH CHECK (
    editor_id = auth.uid()
    AND project_id IS NOT NULL
  );
```

---

## 5. RLS Policy Summary

| Table | Operation | Policy |
|-------|-----------|--------|
| `projects` | SELECT | Published → all auth users. Own → creator |
| `projects` | INSERT | `creator_id = auth.uid()` |
| `projects` | UPDATE | `creator_id = auth.uid()` |
| `projects` | DELETE | `creator_id = auth.uid() AND status = 'draft'` |
| `notifications` | SELECT | `user_id = auth.uid()` |
| `notifications` | INSERT | Any authenticated user |
| `notifications` | UPDATE | `user_id = auth.uid()` |
| `notifications` | DELETE | `user_id = auth.uid()` |
| `contact_requests` | INSERT (new) | `editor_id = auth.uid() AND project_id IS NOT NULL` |
