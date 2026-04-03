# Data Model: Projet Createur — Publication & Mise en Relation Monteurs

**Feature Branch**: `002-short-name-creator`  
**Date**: 2026-04-03

## Entity Relationship Overview

```
profiles (existing)
    │
    ├── 1:N → projects (creator_id)
    │            │
    │            └── 1:N → contact_requests (project_id) [= candidatures]
    │                        │
    │                        ├── 1:N → messages (request_id) [existing]
    │                        └── 1:N → offers (request_id) [existing]
    │
    ├── 1:N → contact_requests (creator_id / editor_id) [existing]
    │
    └── 1:N → notifications (user_id)
                 │
                 ├── N:1 → projects (project_id)
                 └── N:1 → contact_requests (request_id)
```

---

## New Tables

### 1. `projects`

Project postings created by creators.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `creator_id` | uuid | NO | — | FK → `auth.users(id)` ON DELETE CASCADE |
| `title` | text | NO | — | Project title (max 120 chars) |
| `description` | text | NO | — | Full description (max 2000 chars) |
| `content_format` | text | YES | — | Content format (same options as profiles.formats) |
| `niches` | text[] | YES | `'{}'` | Thematic categories (same options as profiles.niches) |
| `deliverables` | jsonb | NO | `'[]'` | Array of `{type, quantity, duration}` objects |
| `budget_type` | text | NO | `'fixed'` | `'fixed'` or `'range'` |
| `budget_fixed` | numeric | YES | — | Fixed budget amount (EUR). Used when budget_type='fixed' |
| `budget_min` | numeric | YES | — | Min budget (EUR). Used when budget_type='range' |
| `budget_max` | numeric | YES | — | Max budget (EUR). Used when budget_type='range' |
| `start_date` | date | YES | — | Desired start date |
| `deadline` | date | NO | — | Delivery deadline |
| `quality` | text | YES | — | Expected quality/resolution (e.g., '1080p', '4K') |
| `thumbnail_included` | boolean | NO | `false` | Whether thumbnail creation is included |
| `video_count` | integer | YES | — | Number of videos expected |
| `video_duration` | text | YES | — | Estimated duration per video (e.g., '10-15min') |
| `revision_count` | integer | YES | `2` | Number of revisions included |
| `preferred_software` | text[] | YES | `'{}'` | Preferred editing software |
| `required_languages` | text[] | YES | `'{}'` | Required languages |
| `experience_level` | text | YES | — | Desired editor experience level |
| `mission_type` | text | YES | — | `'ponctuelle'`, `'recurring'`, `'long-terme'` |
| `rushes_info` | text | YES | — | Info about footage provided |
| `status` | text | NO | `'draft'` | `'draft'`, `'published'`, `'filled'`, `'completed'`, `'cancelled'` |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp |

**Indexes:**
- `idx_projects_creator_id` ON `projects(creator_id)`
- `idx_projects_status` ON `projects(status)` WHERE `status = 'published'`
- `idx_projects_deadline` ON `projects(deadline)` WHERE `status = 'published'`

**Constraints:**
- CHECK `status IN ('draft', 'published', 'filled', 'completed', 'cancelled')`
- CHECK `budget_type IN ('fixed', 'range')`
- CHECK `(budget_type = 'fixed' AND budget_fixed IS NOT NULL) OR (budget_type = 'range' AND budget_min IS NOT NULL AND budget_max IS NOT NULL)`
- CHECK `budget_min <= budget_max` (when range)
- CHECK `deadline > CURRENT_DATE` enforced at application level (not DB constraint — allows historical projects)

**RLS Policies:**
- SELECT: Authenticated users can read projects with `status = 'published'`. Creators can read their own projects (any status).
- INSERT: Authenticated users with `role = 'creator'` can insert where `creator_id = auth.uid()`.
- UPDATE: Only the creator (`creator_id = auth.uid()`) can update their own projects.
- DELETE: Only the creator can delete their own draft projects (`status = 'draft'`).

---

### 2. `notifications`

In-app notifications for project and candidature events.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NO | — | FK → `auth.users(id)` ON DELETE CASCADE. Notification recipient. |
| `type` | text | NO | — | Event type (see enum below) |
| `project_id` | uuid | YES | — | FK → `projects(id)` ON DELETE CASCADE |
| `request_id` | uuid | YES | — | FK → `contact_requests(id)` ON DELETE CASCADE |
| `actor_id` | uuid | YES | — | FK → `auth.users(id)`. Who triggered the event. |
| `actor_name` | text | YES | — | Display name of actor (denormalized for fast rendering) |
| `project_title` | text | YES | — | Project title (denormalized) |
| `read` | boolean | NO | `false` | Read/unread status |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |

**Notification types:**
- `application_received` — Creator: an editor applied to your project
- `application_accepted` — Editor: your application was accepted
- `application_refused` — Editor: your application was refused
- `application_withdrawn` — Creator: an editor withdrew their application
- `project_filled` — Editor: a project you applied to has been filled (another editor selected)
- `project_cancelled` — Editor: a project you applied to was cancelled
- `project_modified` — Editor: a project you applied to was modified

**Indexes:**
- `idx_notifications_user_id` ON `notifications(user_id)`
- `idx_notifications_user_unread` ON `notifications(user_id)` WHERE `read = false`

**RLS Policies:**
- SELECT: Users can only read their own notifications (`user_id = auth.uid()`).
- INSERT: Service role only (notifications created server-side via Supabase functions or client-side with proper auth checks).
- UPDATE: Users can only update `read` field on their own notifications.
- DELETE: Users can delete their own notifications.

---

## Modified Tables

### 3. `contact_requests` (existing — add column)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `project_id` | uuid | YES | `NULL` | FK → `projects(id)` ON DELETE SET NULL. When set, this request is a project candidature. When NULL, it's a catalog contact. |

**New index:**
- `idx_contact_requests_project_id` ON `contact_requests(project_id)` WHERE `project_id IS NOT NULL`

**New unique constraint:**
- `uq_contact_requests_project_editor` UNIQUE ON `(project_id, editor_id)` WHERE `project_id IS NOT NULL` — prevents duplicate candidatures (FR-009).

**Modified RLS:**
- INSERT: Extend to allow editors to insert where `editor_id = auth.uid()` AND `project_id IS NOT NULL` (editor-initiated candidature). Existing policy allows creators to insert where `creator_id = auth.uid()` (catalog contact).

---

## Deliverables JSONB Schema

```json
[
  {
    "type": "video",
    "quantity": 2,
    "duration": "10-15min"
  },
  {
    "type": "thumbnail",
    "quantity": 2,
    "duration": null
  }
]
```

**Deliverable types** (aligned with existing skills):
- `video` — Video editing
- `thumbnail` — Thumbnail creation
- `reels` — Short-form content (Reels/Shorts/TikTok)
- `motion_graphics` — Motion graphics / animations
- `color_grading` — Color correction/grading
- `subtitles` — Subtitling / captions
- `sound_design` — Audio editing / sound design

---

## State Transitions

### Project Status

```
                 ┌──────────┐
                 │  draft    │
                 └────┬─────┘
                      │ publish()
                      ▼
                 ┌──────────┐
            ┌────│ published │────┐
            │    └────┬─────┘    │
            │         │          │
     cancel()    accept()    cancel()
            │    candidature     │
            │         │          │
            │         ▼          │
            │    ┌──────────┐    │
            │    │  filled   │───┘
            │    └────┬─────┘
            │         │ markComplete()
            │         ▼
            │    ┌──────────┐
            │    │ completed │
            │    └──────────┘
            │
            ▼
       ┌──────────┐
       │ cancelled │
       └──────────┘
```

### Candidature Status (via contact_requests.status)

```
    ┌─────────┐
    │ pending  │──── editor withdraws ──── ► (deleted or status='refused' with withdrawn flag)
    └────┬────┘
         │
    ┌────┴────┐
    │         │
 accept()  refuse()
    │         │
    ▼         ▼
┌────────┐ ┌─────────┐
│accepted│ │ refused  │
└────────┘ └─────────┘
```

Note: When a candidature is accepted, the system:
1. Sets `contact_requests.status = 'accepted'`
2. Sets `projects.status = 'filled'`
3. Creates notifications for the accepted editor and all other pending applicants
4. Other pending candidatures for the same project are set to `status = 'refused'`

---

## Validation Rules

### Project Creation
- `title`: required, 3-120 characters
- `description`: required, 10-2000 characters
- `deliverables`: required, at least 1 item
- `budget_fixed` or `budget_min/budget_max`: required based on `budget_type`
- `budget_fixed/min/max`: must be > 0
- `budget_min < budget_max`: when range
- `deadline`: required, must be future date
- `start_date`: if provided, must be before `deadline`

### Candidature
- Editor's `profiles.status` must be `'published'`
- Project `status` must be `'published'`
- No existing candidature for same `(project_id, editor_id)` pair
- Project `deadline` must not be passed
- Editor cannot apply to their own project (creator_id ≠ editor's user id — always true due to role separation)

### Notification
- `user_id`: required
- `type`: required, must be valid enum value
- At least one of `project_id` or `request_id`: required
