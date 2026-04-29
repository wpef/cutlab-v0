import { useState } from 'react'
import { FORMATS, NICHES, SOFTWARE, MISSION_TYPES } from '../../constants/options'

export default function ProjectFilters({ filters, onFilterChange }) {
  const [expanded, setExpanded] = useState(null) // which dropdown is open

  function setFilter(key, value) {
    const next = { ...filters }
    if (value === undefined || next[key] === value) delete next[key]
    else next[key] = value
    onFilterChange(next)
    setExpanded(null)
  }

  function clearAll() {
    onFilterChange({})
    setExpanded(null)
  }

  const hasFilters = Object.keys(filters).length > 0

  return (
    <div className="project-filters">
      {/* Format */}
      <div style={{ position: 'relative' }}>
        <button
          className={`project-filter-chip ${filters.content_format ? 'active' : ''}`}
          onClick={() => setExpanded(expanded === 'format' ? null : 'format')}
        >
          {filters.content_format
            ? FORMATS.find((f) => f.key === filters.content_format)?.label || 'Format'
            : 'Format'}
        </button>
        {expanded === 'format' && (
          <FilterDropdown
            items={FORMATS.map((f) => ({ key: f.key, label: f.label }))}
            selected={filters.content_format}
            onSelect={(key) => setFilter('content_format', key)}
            onClose={() => setExpanded(null)}
          />
        )}
      </div>

      {/* Niche */}
      <div style={{ position: 'relative' }}>
        <button
          className={`project-filter-chip ${filters.niche ? 'active' : ''}`}
          onClick={() => setExpanded(expanded === 'niche' ? null : 'niche')}
        >
          {filters.niche || 'Niche'}
        </button>
        {expanded === 'niche' && (
          <FilterDropdown
            items={NICHES.map((n) => ({ key: n, label: n }))}
            selected={filters.niche}
            onSelect={(key) => setFilter('niche', key)}
            onClose={() => setExpanded(null)}
          />
        )}
      </div>

      {/* Mission type */}
      <div style={{ position: 'relative' }}>
        <button
          className={`project-filter-chip ${filters.mission_type ? 'active' : ''}`}
          onClick={() => setExpanded(expanded === 'mission' ? null : 'mission')}
        >
          {filters.mission_type
            ? MISSION_TYPES.find((m) => m.key === filters.mission_type)?.label || 'Mission'
            : 'Mission'}
        </button>
        {expanded === 'mission' && (
          <FilterDropdown
            items={MISSION_TYPES.map((m) => ({ key: m.key, label: m.label }))}
            selected={filters.mission_type}
            onSelect={(key) => setFilter('mission_type', key)}
            onClose={() => setExpanded(null)}
          />
        )}
      </div>

      {/* Thumbnail */}
      <button
        className={`project-filter-chip ${filters.thumbnail_included ? 'active' : ''}`}
        onClick={() => setFilter('thumbnail_included', filters.thumbnail_included ? undefined : true)}
      >
        Miniature incluse
      </button>

      {/* Clear */}
      {hasFilters && (
        <button className="project-filters-clear" onClick={clearAll}>
          Effacer
        </button>
      )}
    </div>
  )
}

function FilterDropdown({ items, selected, onSelect, onClose }) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={onClose} />
      <div style={{
        position: 'absolute', top: '100%', left: 0, marginTop: 4,
        background: 'var(--surface)', border: '1px solid #222', borderRadius: 'var(--radius)',
        minWidth: 200, maxHeight: 240, overflowY: 'auto', zIndex: 91,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 14px', background: selected === item.key ? 'rgba(212,240,0,0.1)' : 'transparent',
              border: 'none', color: selected === item.key ? 'var(--accent)' : '#ccc',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}
