const AEM_AUTHOR = process.env.REACT_APP_AEM_AUTHOR_HOST_URI || 'https://author-p144258-e1488419.adobeaemcloud.com'
const AEM_PUBLISH = process.env.REACT_APP_HOST_URI || 'https://publish-p144258-e1488419.adobeaemcloud.com'
const ARTICLES_FOLDER = process.env.REACT_APP_ARTICLES_FOLDER || '/content/dam/engiexwalk/en/fragments/articles'
const PROMOTION_PATH = process.env.REACT_APP_PROMOTION_PATH || '/content/dam/engiexwalk/en/fragments/promotions/gaz-naturel'
const PROMOTIONS_FOLDER = process.env.REACT_APP_PROMOTIONS_FOLDER || '/content/dam/engiexwalk/en/fragments/promotions'
const HERO_PATH = process.env.REACT_APP_HERO_PATH || '/content/dam/engiexwalk/en/fragments/heros/parrainez-vos-proches-et-recevez-jusqua-25---par-parrainage'
const WRAPPER_URL = 'https://3635370-refdemoapigateway-stage.adobeioruntime.net/api/v1/web/ref-demo-api-gateway/fetch-cf'

export { AEM_AUTHOR, AEM_PUBLISH, ARTICLES_FOLDER, PROMOTION_PATH, PROMOTIONS_FOLDER, HERO_PATH }

const cache = new Map()

async function fetchAEM(url) {
  if (cache.has(url)) return cache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`AEM error: ${res.status}`)
  const json = await res.json()
  cache.set(url, json)
  return json
}

async function callWrapper(graphQLPath, cfPath, variation = 'master') {
  const cacheKey = `${graphQLPath}|${cfPath}|${variation}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)
  const res = await fetch(WRAPPER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ graphQLPath, cfPath, variation }),
  })
  if (!res.ok) throw new Error(`Wrapper error: ${res.status}`)
  const json = await res.json()
  cache.set(cacheKey, json)
  return json
}

function query(name, params = {}) {
  const qs = Object.entries(params).map(([k, v]) => `;${k}=${v}`).join('')
  return `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds/${name}${qs}`
}

export function clearCache() { cache.clear() }

export async function fetchArticles(folderPath = ARTICLES_FOLDER) {
  const graphQLPath = `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds/FetchArticleByPath;folderPath=${folderPath}`
  const json = await callWrapper(graphQLPath, folderPath)
  return json?.data?.articleList?.items || json?.data?.articleByPathList?.items || []
}

export async function fetchArticleByPath(path, variation = 'master') {
  const graphQLPath = `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds/ArticleByPath`
  const json = await callWrapper(graphQLPath, path, variation)
  return json?.data?.articleByPath?.item || null
}

export async function fetchHeroBanner(path = HERO_PATH, variation = 'master') {
  const url = query('HeroByPath', { path, variation })
  try {
    const json = await fetchAEM(url)
    return json?.data?.heroBannerByPath?.item || null
  } catch {
    // fallback to wrapper if direct call fails (e.g. CORS on Vercel)
    const graphQLPath = `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds/HeroByPath`
    const json = await callWrapper(graphQLPath, path, variation)
    return json?.data?.heroBannerByPath?.item || null
  }
}

export async function fetchPromotion(path = PROMOTION_PATH, variation = 'master') {
  const graphQLPath = `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds/CTAByPath`
  const json = await callWrapper(graphQLPath, path, variation)
  return json?.data?.ctaByPath?.item || null
}

export async function fetchPromotions(folderPath = PROMOTIONS_FOLDER) {
  const graphQLPath = `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds/FetchCTAOfferByPath;folderPath=${folderPath}`
  const json = await callWrapper(graphQLPath, folderPath)
  return json?.data?.ctaOfferList?.items || json?.data?.ctaList?.items || json?.data?.promotionList?.items || []
}

export function formatDateFr(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function cleanTag(t) {
  return String(t).replace(/^[^:]+:/i, '').trim()
}

export function getSlug(path) {
  return path?.split('/').filter(Boolean).pop() || ''
}
