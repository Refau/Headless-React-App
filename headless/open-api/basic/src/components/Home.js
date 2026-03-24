import CFPromotion from './CFPromotion'
import ArticleList from './ArticleList'
import PromotionTeasers from './PromotionTeasers'
import HeroBanner from './HeroBanner'
import './Home.scss'

export default function Home() {
  return (
    <main className="home">
      <HeroBanner />
      <CFPromotion />
      <PromotionTeasers />
      <ArticleList />
    </main>
  )
}
