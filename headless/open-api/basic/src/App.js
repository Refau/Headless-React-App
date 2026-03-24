import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'

import ArticleDetail from './components/ArticleDetail'
import Home from './components/Home'
import './App.scss'

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__top">
        <div className="app-header__inner">
          <Link to="/" className="app-header__logo">
            <img src="/engie-logo.png" alt="ENGIE" className="app-header__logo-img" />
          </Link>
          <nav className="app-header__nav">
            <NavLink to="/particuliers">Particuliers</NavLink>
            <NavLink to="/professionnels">Professionnels</NavLink>
            <NavLink to="/a-propos">À propos</NavLink>
          </nav>
          <div className="app-header__actions">
            <a href="#espace-client" className="app-header__cta">Espace client</a>
          </div>
        </div>
      </div>
      <div className="app-header__subnav">
        <div className="app-header__inner">
          <NavLink to="/" end>Actualités</NavLink>
          <NavLink to="/offres">Nos offres</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/transition">Transition énergétique</NavLink>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <img src="/engie-logo.png" alt="ENGIE" className="app-footer__logo" />
          <p>Agir ensemble pour accélérer la transition vers un monde neutre en carbone.</p>
        </div>

        <div className="app-footer__col">
          <h4>Particuliers</h4>
          <ul>
            <li><a href="#offres-gaz">Offres gaz</a></li>
            <li><a href="#offres-electricite">Offres électricité</a></li>
            <li><a href="#renovation">Rénovation énergétique</a></li>
            <li><a href="#solaire">Énergie solaire</a></li>
          </ul>
        </div>

        <div className="app-footer__col">
          <h4>Professionnels</h4>
          <ul>
            <li><a href="#entreprises">Solutions entreprises</a></li>
            <li><a href="#collectivites">Collectivités</a></li>
            <li><a href="#industrie">Industrie</a></li>
            <li><a href="#mobilite">Mobilité verte</a></li>
          </ul>
        </div>

        <div className="app-footer__col">
          <h4>À propos</h4>
          <ul>
            <li><a href="#groupe">Le groupe ENGIE</a></li>
            <li><a href="#transition">Transition énergétique</a></li>
            <li><a href="#presse">Espace presse</a></li>
            <li><a href="#carrieres">Carrières</a></li>
          </ul>
        </div>
      </div>

      <div className="app-footer__bottom">
        <div className="app-footer__inner">
          <span>© {new Date().getFullYear()} ENGIE. Tous droits réservés.</span>
          <div className="app-footer__legal">
            <a href="#mentions">Mentions légales</a>
            <a href="#confidentialite">Politique de confidentialité</a>
            <a href="#cookies">Gestion des cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="app-main">
          <Routes>
          
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
