import { SOCIAL_PLATFORMS, buildSocialLinkUrl } from '../../constants/options'

/**
 * Display-only component for structured social links.
 * Props:
 *   socialLinks — object { platformKey: string } from profile.social_links
 *
 * Renders nothing if socialLinks is empty/null.
 * Each non-empty platform becomes a clickable icon anchor.
 */
export default function SocialLinksDisplay({ socialLinks }) {
  if (!socialLinks || typeof socialLinks !== 'object') return null

  const links = SOCIAL_PLATFORMS
    .map((p) => ({ ...p, url: buildSocialLinkUrl(p.key, socialLinks[p.key]) }))
    .filter((p) => p.url)

  if (links.length === 0) return null

  return (
    <div className="social-links-display">
      {links.map((p) => (
        <a
          key={p.key}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-links-display-icon"
          title={p.label}
          aria-label={p.label}
        >
          {p.icon}
        </a>
      ))}
    </div>
  )
}
