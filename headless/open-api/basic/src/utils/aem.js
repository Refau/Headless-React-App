const AEM_AUTHOR = process.env.REACT_APP_AEM_AUTHOR_HOST_URI || 'https://author-p144258-e1488419.adobeaemcloud.com'
const AEM_PUBLISH = process.env.REACT_APP_HOST_URI || 'https://publish-p144258-e1488419.adobeaemcloud.com'
const ARTICLES_FOLDER = process.env.REACT_APP_ARTICLES_FOLDER || '/content/dam/engiexwalk/en/fragments/articles'
const PROMOTION_PATH = process.env.REACT_APP_PROMOTION_PATH || '/content/dam/engiexwalk/en/fragments/promotions/gaz-naturel'
const PROMOTIONS_FOLDER = process.env.REACT_APP_PROMOTIONS_FOLDER || '/content/dam/engiexwalk/en/fragments/promotions'
const HERO_PATH = process.env.REACT_APP_HERO_PATH || '/content/dam/engiexwalk/en/fragments/heros/parrainez-vos-proches-et-recevez-jusqua-25---par-parrainage'

export { AEM_AUTHOR, AEM_PUBLISH, ARTICLES_FOLDER, PROMOTION_PATH, PROMOTIONS_FOLDER, HERO_PATH }

async function fetchAEM(url) {
  const res = await fetch(`${url}&_t=${Date.now()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`AEM error: ${res.status}`)
  return res.json()
}

export function clearCache() {}

const GQL = `${AEM_PUBLISH}/graphql/execute.json/ref-demo-eds`

export async function fetchArticles(folderPath = ARTICLES_FOLDER) {
  const json = await fetchAEM(`${GQL}/FetchArticleByPath;folderPath=${folderPath}`)
  return json?.data?.articleList?.items || json?.data?.articleByPathList?.items || []
}

export async function fetchArticleByPath(path, variation = 'master') {
  const json = await fetchAEM(`${GQL}/ArticleByPath;path=${path};variation=${variation}`)
  return json?.data?.articleByPath?.item || null
}

export async function fetchHeroBanner(path = HERO_PATH, variation = 'master') {
  const json = await fetchAEM(`${GQL}/HeroByPath;path=${path};variation=${variation}`)
  return json?.data?.heroBannerByPath?.item || null
}

export async function fetchPromotion(path = PROMOTION_PATH, variation = 'master') {
  const json = await fetchAEM(`${GQL}/CTAByPath;path=${path};variation=${variation}`)
  return json?.data?.ctaByPath?.item || null
}

export async function fetchPromotions(folderPath = PROMOTIONS_FOLDER) {
  const json = await fetchAEM(`${GQL}/FetchCTAOfferByPath;folderPath=${folderPath}`)
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
