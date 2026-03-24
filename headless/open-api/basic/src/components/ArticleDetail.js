import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { fetchArticleByPath, formatDateFr, cleanTag, ARTICLES_FOLDER } from '../utils/aem'
import './ArticleDetail.scss'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [article, setArticle] = useState(state?.article || null)
  const [loading, setLoading] = useState(!state?.article)

  useEffect(() => {
    if (state?.article) return
    const path = `${ARTICLES_FOLDER}/${slug}`
    fetchArticleByPath(path)
      .then(setArticle)
      .catch((err) => {
        console.error('ArticleDetail:', err)
        setArticle(null)
      })
      .finally(() => setLoading(false))
  }, [slug, state])

  if (loading) return <DetailSkeleton />

  if (!article) {
    return (
      <main className="article-detail__not-found">
        <p>Article introuvable.</p>
        <button onClick={() => navigate('/')}>← Retour aux actualités</button>
      </main>
    )
  }

  const imgUrl = article.image?._authorUrl || article.image?._publishUrl
  const tags = [
    ...(Array.isArray(article.tags) ? article.tags : []),
    ...(Array.isArray(article.subTag) ? article.subTag : article.subTag ? [article.subTag] : []),
  ]
  const date = formatDateFr(article.date)
  const itemId = `urn:aemconnection:${ARTICLES_FOLDER}/${slug}/jcr:content/data/master`

  return (
    <article
      className="article-detail"
      data-aue-resource={itemId}
      data-aue-type="reference"
      data-aue-label={article.title}
    >
      {/* ── CF Detail Hero ── */}
      <div
        className="adh-hero"
        style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
        data-aue-prop="image"
        data-aue-type="media"
        data-aue-label="Image"
      >
        <div className="adh-hero__overlay" aria-hidden="true" />

        <div className="adh-hero__content">
          <button
            className="adh-hero__back"
            onClick={() => navigate('/')}
            data-aue-prop="backLabel"
            data-aue-type="text"
            data-aue-label="Bouton retour"
          >
            ← Toutes les actualités
          </button>

          {(tags.length > 0 || date) && (
            <div className="adh-hero__meta">
              {tags.length > 0 && (
                <span className="adh-hero__tags">
                  {tags.map((t, i) => (
                    <span key={i} className="adh-hero__tag">{cleanTag(t).toUpperCase()}</span>
                  ))}
                </span>
              )}
              {tags.length > 0 && date && <span className="adh-hero__dot" aria-hidden="true">·</span>}
              {date && (
                <span
                  className="adh-hero__date"
                  data-aue-prop="date"
                  data-aue-type="text"
                  data-aue-label="Date"
                >
                  {date}
                </span>
              )}
            </div>
          )}

          <h1
            className="adh-hero__title"
            data-aue-prop="title"
            data-aue-type="text"
            data-aue-label="Titre"
          >
            {article.title}
          </h1>

          {article.description?.plaintext && (
            <p
              className="adh-hero__description"
              data-aue-prop="description"
              data-aue-type="text"
              data-aue-label="Description"
            >
              {article.description.plaintext}
            </p>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="article-detail__body">
        <div className="article-detail__content">
          {article.main?.html ? (
            <div
              data-aue-prop="main"
              data-aue-type="richtext"
              data-aue-label="Corps de l'article"
              dangerouslySetInnerHTML={{ __html: article.main.html }}
            />
          ) : article.main?.plaintext ? (
            <div
              data-aue-prop="main"
              data-aue-type="richtext"
              data-aue-label="Corps de l'article"
              dangerouslySetInnerHTML={{
                __html: article.main.plaintext
                  .split(/\n\n+/)
                  .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
                  .join('')
              }}
            />
          ) : (
            <p className="article-detail__empty">Aucun contenu disponible pour cet article.</p>
          )}
        </div>
      </div>
    </article>
  )
}

function DetailSkeleton() {
  return (
    <div className="adh-hero adh-hero--skeleton">
      <div className="adh-hero__content">
        <div className="adh-skeleton-line adh-skeleton-line--tag" />
        <div className="adh-skeleton-line adh-skeleton-line--title" />
        <div className="adh-skeleton-line adh-skeleton-line--desc" />
      </div>
    </div>
  )
}
