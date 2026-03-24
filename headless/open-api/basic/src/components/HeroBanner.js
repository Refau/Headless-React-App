import { useEffect, useState } from 'react'
import { fetchHeroBanner, HERO_PATH, AEM_PUBLISH } from '../utils/aem'
import './HeroBanner.scss'

export default function HeroBanner({ path = HERO_PATH }) {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeroBanner(path)
      .then(setHero)
      .catch((err) => {
        console.error('HeroBanner:', err)
        setHero(null)
      })
      .finally(() => setLoading(false))
  }, [path])

  if (loading) return <div className="hero-banner hero-banner--skeleton" />
  if (!hero) return null

  const imgUrl = hero.image?._authorUrl
    || hero.image?._publishUrl
    || (hero.image?._path ? `${AEM_PUBLISH}${hero.image._path}` : null)

  return (
    <section
      className="hero-banner"
      style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
      data-aue-resource={`urn:aemconnection:${hero._path}/jcr:content/data/master`}
      data-aue-type="reference"
      data-aue-label={hero.title || 'Hero Banner'}
    >
      <div className="hero-banner__overlay" aria-hidden="true" />

      <div className="hero-banner__content">
        {hero.title && (
          <h1
            className="hero-banner__title"
            data-aue-prop="title"
            data-aue-type="text"
            data-aue-label="Title"
          >
            {hero.title}
          </h1>
        )}

        {hero.description?.plaintext && (
          <p
            className="hero-banner__description"
            data-aue-prop="description"
            data-aue-type="richtext"
            data-aue-label="Description"
          >
            {hero.description.plaintext}
          </p>
        )}

        {hero.cta && (
          <a
            href={hero.cta || '/'}
            className="hero-banner__cta button"
            data-aue-prop="cta"
            data-aue-type="text"
            data-aue-label="CTA"
          >
            {hero.cta}
          </a>
        )}
      </div>
    </section>
  )
}
