import { useEffect, useState } from 'react'
import { fetchPromotions, PROMOTIONS_FOLDER, AEM_PUBLISH } from '../utils/aem'
import './PromotionTeasers.scss'

export default function PromotionTeasers({ folder = PROMOTIONS_FOLDER }) {
  const [promotions, setPromotions] = useState(null)

  useEffect(() => {
    fetchPromotions(folder)
      .then(setPromotions)
      .catch((err) => {
        console.error('PromotionTeasers:', err)
        setPromotions([])
      })
  }, [folder])

  if (!promotions) {
    return (
      <section className="promo-teasers">
        <div className="promo-teasers__inner">
          <h2 className="promo-teasers__heading">Nos offres</h2>
          <div className="promo-teasers__grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="promo-card promo-card--skeleton">
                <div className="promo-card__skeleton-image" />
                <div className="promo-card__skeleton-body">
                  <div className="promo-card__skeleton-line promo-card__skeleton-line--title" />
                  <div className="promo-card__skeleton-line promo-card__skeleton-line--desc" />
                  <div className="promo-card__skeleton-line promo-card__skeleton-line--cta" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!promotions.length) return null

  return (
    <section
      className="promo-teasers"
      data-aue-resource={`urn:aemconnection:${folder}`}
      data-aue-type="container"
      data-aue-label="Promotions"
    >
      <div className="promo-teasers__inner">
        <h2 className="promo-teasers__heading">Nos offres</h2>
        <div className="promo-teasers__grid">
          {promotions.map((promo, i) => (
            <PromoCard key={promo._path || i} promo={promo} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PromoCard({ promo }) {
  const imgUrl = promo.bannerimage?._authorUrl
    || (promo.bannerimage?._path ? `${AEM_PUBLISH}${promo.bannerimage._path}` : null)

  const ctaHref = typeof promo.ctaurl === 'string'
    ? promo.ctaurl
    : promo.ctaurl?._authorUrl || promo.ctaurl?._path || '#'

  return (
    <div
      className="promo-card"
      data-aue-resource={`urn:aemconnection:${promo._path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={promo.title}
      data-aue-filter="cf-promotion"
    >
      <div
        className="promo-card__image"
        style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
        data-aue-prop="bannerimage"
        data-aue-type="media"
        data-aue-label="Image"
      />

      <div className="promo-card__body">
        <h3
          className="promo-card__title"
          data-aue-prop="title"
          data-aue-type="text"
          data-aue-label="Titre"
        >
          {promo.title}
        </h3>

        {promo.subtitle && (
          <p
            className="promo-card__subtitle"
            data-aue-prop="subtitle"
            data-aue-type="text"
            data-aue-label="Sous-titre"
          >
            {promo.subtitle}
          </p>
        )}

        {promo.description?.plaintext && (
          <p
            className="promo-card__desc"
            data-aue-prop="description"
            data-aue-type="richtext"
            data-aue-label="Description"
          >
            {promo.description.plaintext}
          </p>
        )}

        {promo.ctalabel && (
          <a
            href={ctaHref}
            className="promo-card__cta"
            data-aue-prop="ctaurl"
            data-aue-type="reference"
            data-aue-label="Lien CTA"
          >
            <span
              data-aue-prop="ctalabel"
              data-aue-type="text"
              data-aue-label="Label CTA"
            >
              {promo.ctalabel}
            </span>
          </a>
        )}
      </div>
    </div>
  )
}
