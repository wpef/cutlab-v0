import { useEffect } from 'react'

const SITE_URL = 'https://cutlab.io'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`
const SITE_NAME = 'CUTLAB'
const DEFAULT_LOCALE = 'fr_FR'

const MANAGED_ATTR = 'data-cutlab-seo'

function setMeta({ name, property, content }) {
  if (!content) return
  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    if (name) el.setAttribute('name', name)
    if (property) el.setAttribute('property', property)
    el.setAttribute(MANAGED_ATTR, '')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink({ rel, href }) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute(MANAGED_ATTR, '')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(data) {
  // Remove any previously injected JSON-LD by SEO component
  const existing = document.head.querySelector(`script[type="application/ld+json"][${MANAGED_ATTR}]`)
  if (existing) existing.remove()
  if (!data) return
  const el = document.createElement('script')
  el.setAttribute('type', 'application/ld+json')
  el.setAttribute(MANAGED_ATTR, '')
  el.textContent = JSON.stringify(data)
  document.head.appendChild(el)
}

/**
 * SEO — per-page meta tags, Open Graph, Twitter cards, canonical, optional JSON-LD.
 *
 * Updates document.title, meta description/keywords, canonical link, OG/Twitter tags
 * and JSON-LD structured data when the component mounts. Reverts on unmount only for
 * the per-page JSON-LD (the others are simply overwritten by the next page's SEO).
 */
export default function SEO({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  type = 'website',
  jsonLd = null,
  noIndex = false,
}) {
  const url = `${SITE_URL}${path}`
  const fullTitle = title?.includes('CUTLAB') ? title : `${title} — ${SITE_NAME}`

  useEffect(() => {
    document.title = fullTitle
    setMeta({ name: 'description', content: description })
    setMeta({ name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' })
    setLink({ rel: 'canonical', href: url })

    setMeta({ property: 'og:type', content: type })
    setMeta({ property: 'og:site_name', content: SITE_NAME })
    setMeta({ property: 'og:locale', content: DEFAULT_LOCALE })
    setMeta({ property: 'og:title', content: fullTitle })
    setMeta({ property: 'og:description', content: description })
    setMeta({ property: 'og:url', content: url })
    setMeta({ property: 'og:image', content: ogImage })
    setMeta({ property: 'og:image:width', content: '1200' })
    setMeta({ property: 'og:image:height', content: '630' })

    setMeta({ name: 'twitter:card', content: 'summary_large_image' })
    setMeta({ name: 'twitter:title', content: fullTitle })
    setMeta({ name: 'twitter:description', content: description })
    setMeta({ name: 'twitter:image', content: ogImage })

    setJsonLd(jsonLd)
  }, [fullTitle, description, url, type, ogImage, noIndex, jsonLd])

  return null
}
