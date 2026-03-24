import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchArticles, formatDateFr, cleanTag, getSlug, ARTICLES_FOLDER } from '../utils/aem'
import './ArticleList.scss'

export default function ArticleList({ folder = ARTICLES_FOLDER }) {
  const [articles, setArticles] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchArticles(folder)
      .then(setArticles)
      .catch((err) => {
        console.error('ArticleList:', err)
        setArticles([])
      })
  }, [folder])

  function handleSelect(article) {
    const slug = getSlug(article._path)
    navigate(`/article/${slug}`, { state: { article } })
  }

  // Skeleton while loading
  if (!articles) {
    return (
      <section className="article-list">
        <div className="article-list__inner">
          <h2 className="article-list__heading">Actualités</h2>
          <div className="article-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="article-card article-card--skeleton">
                <div className="article-card__skeleton-image" />
                <div className="article-card__body">
                  <div className="article-card__skeleton-line article-card__skeleton-line--tag" />
                  <div className="article-card__skeleton-line article-card__skeleton-line--title" />
                  <div className="article-card__skeleton-line article-card__skeleton-line--text" />
                  <div className="article-card__skeleton-line article-card__skeleton-line--text" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!articles.length) {
    return (
      <section className="article-list">
        <div className="article-list__inner">
          <h2 className="article-list__heading">Actualités</h2>
          <p className="article-list__empty">Aucun article disponible.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="article-list">
      <div className="article-list__inner">
        <h2 className="article-list__heading">Actualités</h2>
        <div className="article-grid">
          {articles.map((article, i) => (
            <ArticleCard key={article._path || i} article={article} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleCard({ article, onSelect }) {
  const imgUrl = article.image?._authorUrl || article.image?._publishUrl
  const tags = [
    ...(Array.isArray(article.tags) ? article.tags : []),
    ...(Array.isArray(article.subTag) ? article.subTag : article.subTag ? [article.subTag] : []),
  ]
  const date = formatDateFr(article.date)

  return (
    <article
      className="article-card"
      onClick={() => onSelect(article)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(article)}
      data-aue-resource={`urn:aemconnection:${article._path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={article.title}
    >
      <div
        className="article-card__image-wrapper"
        data-aue-prop="image"
        data-aue-type="media"
        data-aue-label="Image"
      >
        {imgUrl
          ? <img src={imgUrl} alt={article.title} className="article-card__image" loading="lazy" />
          : <div className="article-card__image-placeholder" />
        }
      </div>

      <div className="article-card__body">
        {tags.length > 0 && (
          <div
            className="article-card__tags"
            data-aue-prop="tags"
            data-aue-type="tag"
            data-aue-label="Tags"
          >
            {tags.map((t, i) => (
              <span key={i} className="article-card__tag">{cleanTag(t)}</span>
            ))}
          </div>
        )}

        {date && <div className="article-card__date-row"><span className="article-card__date">{date}</span></div>}

        <h3
          className="article-card__title"
          data-aue-prop="title"
          data-aue-type="text"
          data-aue-label="Titre"
        >
          {article.title}
        </h3>

        {article.description?.plaintext && (
          <p
            className="article-card__excerpt"
            data-aue-prop="description"
            data-aue-type="richtext"
            data-aue-label="Description"
          >
            {article.description.plaintext}
          </p>
        )}

        <span className="article-card__cta">Lire l'article →</span>
      </div>
    </article>
  )
}
