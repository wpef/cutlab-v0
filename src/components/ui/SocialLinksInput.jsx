import { SOCIAL_PLATFORMS } from '../../constants/options'

/**
 * Controlled input component for structured social links.
 * Props:
 *   value   — object { platformKey: string }
 *   onChange — called with updated object whenever a field changes
 *
 * Empty strings are kept as-is in local state so the input stays dumb.
 * Callers (Step6, ProfileEditor) are responsible for filtering empties before save.
 */
export default function SocialLinksInput({ value = {}, onChange }) {
  function handleChange(key, raw) {
    onChange({ ...value, [key]: raw })
  }

  return (
    <div className="social-links-input">
      {SOCIAL_PLATFORMS.map((p) => (
        <div key={p.key} className="social-links-input-row">
          <span className="social-links-input-icon" aria-hidden="true">{p.icon}</span>
          <span className="social-links-input-label">{p.label}</span>
          <input
            type="text"
            placeholder={p.placeholder}
            value={value[p.key] ?? ''}
            onChange={(e) => handleChange(p.key, e.target.value)}
            className="social-links-input-field"
          />
        </div>
      ))}
    </div>
  )
}
