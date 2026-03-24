import { useEffect, useState } from 'react'
import { fetchPromotion, PROMOTION_PATH } from '../utils/aem'
import { AEM_PUBLISH } from '../utils/aem'
import './CFPromotion.scss'

export default function CFPromotion({ path = PROMOTION_PATH }) {
  const [promo, setPromo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPromotion(path)
      .then(setPromo)
      .catch((err) => console.error('CFPromotion:', err))
      .finally(() => setLoading(false))
  }, [path])

  if (loading) {
    return (
      <div className="cf-promo cf-promo--skeleton">
        <div className="cf-promo__content">
          <div className="cf-promo__skeleton-line cf-promo__skeleton-line--title" />
          <div className="cf-promo__skeleton-line cf-promo__skeleton-line--subtitle" />
          <div className="cf-promo__skeleton-line cf-promo__skeleton-line--desc" />
          <div className="cf-promo__skeleton-line cf-promo__skeleton-line--cta" />
        </div>
      </div>
    )
  }

  if (!promo) return null

  const imgUrl = promo.bannerimage?._authorUrl
    || (promo.bannerimage?._path ? `${AEM_PUBLISH}${promo.bannerimage._path}` : null)

  const bannerStyle = imgUrl
    ? { backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 80%), url(${imgUrl})` }
    : {}

  return (
    <section
      className="cf-promo"
      style={bannerStyle}
      data-aue-resource={`urn:aemconnection:${path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label="Promotion"
    >
      <div className="cf-promo__content">
        <h2
          className="cf-promo__title"
          data-aue-prop="title"
          data-aue-type="text"
          data-aue-label="Title"
        >
          {promo.title}
        </h2>

        {promo.subtitle && (
          <h3
            className="cf-promo__subtitle"
            data-aue-prop="subtitle"
            data-aue-type="text"
            data-aue-label="Subtitle"
          >
            {promo.subtitle}
          </h3>
        )}

        {promo.description?.plaintext && (
          <p
            className="cf-promo__description"
            data-aue-prop="description"
            data-aue-type="richtext"
            data-aue-label="Description"
          >
            {promo.description.plaintext}
          </p>
        )}

        {promo.ctalabel && (
          <a
            href={typeof promo.ctaurl === 'string' ? promo.ctaurl : promo.ctaurl?._path || '#'}
            className="cf-promo__cta"
            data-aue-prop="ctaurl"
            data-aue-type="reference"
            data-aue-label="CTA Link"
          >
            {promo.ctalabel}
          </a>
        )}
      </div>
    </section>
  )
}
