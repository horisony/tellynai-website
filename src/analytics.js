import { inject, track } from '@vercel/analytics'

const ATTRIBUTION_KEY = 'tellwin-attribution'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

function clean(value, limit = 160) {
  return String(value || '').trim().slice(0, limit)
}

function safeReferrer(value) {
  if (!value) return ''
  try {
    const url = new URL(value)
    return clean(`${url.hostname}${url.pathname}`)
  } catch {
    return ''
  }
}

export function initializeAnalytics() {
  if (typeof window === 'undefined') return
  inject({ mode: import.meta.env.PROD ? 'production' : 'development' })
  getLeadAttribution()
}

export function getLeadAttribution(language = '') {
  if (typeof window === 'undefined') return {}
  let firstTouch = {}
  try {
    firstTouch = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || '{}')
  } catch {
    firstTouch = {}
  }

  if (!firstTouch.landingPage) {
    const params = new URLSearchParams(window.location.search)
    firstTouch = {
      landingPage: clean(window.location.pathname),
      referrer: safeReferrer(document.referrer),
      ...Object.fromEntries(UTM_KEYS.map((key) => [key, clean(params.get(key), 100)]).filter(([, value]) => value)),
    }
    try {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(firstTouch))
    } catch {
      // Attribution is best-effort; form submission must still work.
    }
  }

  return {
    ...firstTouch,
    currentPage: clean(window.location.pathname),
    language: clean(language, 10),
  }
}

export function trackEvent(name, properties = {}) {
  try {
    const safeProperties = Object.fromEntries(
      Object.entries(properties)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, clean(value, 100)]),
    )
    track(name, safeProperties)
  } catch {
    // Analytics must never interrupt the customer journey.
  }
}
