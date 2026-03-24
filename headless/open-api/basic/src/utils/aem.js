const AEM_AUTHOR = process.env.REACT_APP_AEM_AUTHOR_HOST_URI || 'https://author-p144258-e1488419.adobeaemcloud.com'
const AEM_PUBLISH = (process.env.REACT_APP_HOST_URI || 'https://publish-p144258-e1488419.adobeaemcloud.com')
const ARTICLES_FOLDER = process.env.REACT_APP_ARTICLES_FOLDER || '/content/dam/engiexwalk/en/fragments/articles'
const PROMOTION_PATH = process.env.REACT_APP_PROMOTION_PATH || '/content/dam/engiexwalk/en/fragments/promotions/gaz-naturel'
const PROMOTIONS_FOLDER = process.env.REACT_APP_PROMOTIONS_FOLDER || '/content/dam/engiexwalk/en/fragments/promotions'
const HERO_PATH = process.env.REACT_APP_HERO_PATH || '/content/dam/engiexwalk/en/fragments/heros/parrainez-vos-proches-et-recevez-jusqua-25---par-parrainage'

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

export function clearCache() {
  cache.clear()
}

function persistedQuery(name, params = {}) {
  const qs = Object.entries(params)
    .map(([k, v]) => `;${k}=${v}`)
    .join('')
  return `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds/${name}${qs}`
}

export async function fetchArticles(folderPath = ARTICLES_FOLDER) {
  const url = persistedQuery('FetchArticleByPath', { folderPath })
  const json = await fetchAEM(url)
  return json?.data?.articleList?.items || json?.data?.articleByPathList?.items || []
}

export async function fetchArticleByPath(path, variation = 'master') {
  const url = persistedQuery('ArticleByPath', { path, variation })
  const json = await fetchAEM(url)
  return json?.data?.articleByPath?.item || null
}

export async function fetchHeroBanner(path = HERO_PATH, variation = 'master') {
  const url = persistedQuery('HeroByPath', { path, variation })
  const json = await fetchAEM(url)
  return json?.data?.heroBannerByPath?.item || null
}

export async function fetchPromotion(path = PROMOTION_PATH, variation = 'master') {
  const url = persistedQuery('CTAByPath', { path, variation })
  const json = await fetchAEM(url)
  return json?.data?.ctaByPath?.item || null
}

export async function fetchPromotions(folderPath = PROMOTIONS_FOLDER) {
  const url = persistedQuery('FetchCTAOfferByPath', { folderPath })
  const json = await fetchAEM(url)
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
