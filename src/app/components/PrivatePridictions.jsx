import React, { Component } from 'react';
import './PrivatePredictions.css';

export default class PrivatePredictions extends Component {
  state = {
    isAuth: false,
    userData: null,
    myBets: [],
    statarea: [],
    scorePred: [],
    loading: true,
    error: false,
    lastUpdate: new Date().toLocaleTimeString(),
  };

  componentDidMount() {
    this.updateTime();
    this.checkAuth();
    this.timer = setInterval(this.updateTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateTime = () => {
    this.setState({ lastUpdate: new Date().toLocaleTimeString() });
  };

  checkAuth = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.setState({ isAuth: true, userData }, this.loadData);
      } catch {
        this.showLogin();
      }
    } else {
      this.showLogin();
    }
  };

  showLogin = () => {
    this.setState({ isAuth: false, loading: false });
  };

  mockLogin = () => {
    localStorage.setItem('user', JSON.stringify({ firstName: 'Demo', username: 'demo@user.com' }));
    window.location.reload();
  };

  loadData = async () => {
    const API_BASE = window.location.origin;
    try {
      const [myBets, statarea, scorePred] = await Promise.all([
        this.fetchAPI(`${API_BASE}/api/predictions/mybets`),
        this.fetchAPI(`${API_BASE}/api/predictions/statarea`),
        this.fetchAPI(`${API_BASE}/api/predictions/scoreprediction`),
      ]);
      this.setState({ myBets, statarea, scorePred, loading: false });
    } catch (e) {
      console.error(e);
      this.setState({ error: true, loading: false });
    }
  };

  fetchAPI = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.predictions || [];
  };

  calcSecrets = () => {
    const { myBets, statarea, scorePred } = this.state;
    const map = new Map();
    const norm = (t1, t2) => [t1?.toLowerCase().trim(), t2?.toLowerCase().trim()].sort().join('|');

    [...statarea.map(p => ({ ...p, src: 'Statarea' })), ...scorePred.map(p => ({ ...p, src: 'ScorePrediction' })), ...myBets.map(p => ({ ...p, src: 'MyBets' }))]
      .forEach(p => {
        const key = norm(p.home_team, p.away_team);
        const m = map.get(key) || { teams: p.teams, sources: [], count: 0, data: {} };
        if (!m.sources.includes(p.src)) {
          m.sources.push(p.src);
          m.count++;
        }
        m.data[p.src.toLowerCase()] = p;
        map.set(key, m);
      });

    return Array.from(map.values()).filter(m => m.count >= 2).sort((a, b) => b.count - a.count).slice(0, 10);
  };

  scroll = (id, dir) => {
    const el = document.getElementById(`car-${id}`);
    if (el) el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  renderCarousel = (id, icon, title, items, from, to, renderFn) => {
    const btns = items.length > 3
      ? <>
          <button className="carousel-btn left" onClick={() => this.scroll(id, -1)}>◀</button>
          <button className="carousel-btn right" onClick={() => this.scroll(id, 1)}>▶</button>
        </>
      : null;

    return (
      <div className="carousel" key={id}>
        <div className="section-header">
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
          <h2>{title}</h2>
          <div className="divider" style={{ '--from': from, '--to': to }}></div>
        </div>
        <div className="carousel-wrapper" id={`car-${id}`}>
          {items.map(renderFn)}
        </div>
        {btns}
      </div>
    );
  };

  // --- Card Renderers ---
  renderSecret = (m, i) => {
    const stars = m.count === 3 ? '⭐⭐⭐' : '⭐⭐';
    return (
      <div className="card bg-gold" key={i}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span>🔮 SECRET</span>
          <span>{stars}</span>
        </div>
        <p style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>{m.teams}</p>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.5rem' }}>Sources:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {m.sources.map((s, idx) => <span key={idx} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>{s}</span>)}
          </div>
        </div>
        <button className="btn-primary" style={{ width: '100%', background: 'white', color: '#f59e0b' }}>🎁 Claim</button>
      </div>
    );
  };

  renderStatarea = (p, i) => (
    <div className="card bg-purple" key={i}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>Statarea</p>
      <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0.5rem 0' }}>{p.teams || 'N/A'}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0' }}>{p.prediction_label || 'N/A'}</p>
      <div className="stats-grid">
        <div className="stat-box"><p className="stat-label">Home</p><p className="stat-value">{p.home_pct || 0}%</p></div>
        <div className="stat-box"><p className="stat-label">Draw</p><p className="stat-value">{p.draw_pct || 0}%</p></div>
        <div className="stat-box"><p className="stat-label">Away</p><p className="stat-value">{p.away_pct || 0}%</p></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Confidence</span>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: 9999, fontWeight: 700 }}>{p.confidence || 0}%</span>
      </div>
    </div>
  );

  renderScore = (p, i) => (
    <div className="card bg-green" key={i}>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>{p.league || 'League'}</p>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: '0.25rem' }}>{p.teams || 'N/A'}</p>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#fde68a' }}>{p.score || 'N/A'}</p>
        <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>{p.total_goals || 0} Goals</p>
      </div>
      <div className="stats-grid">
        <div className="stat-box"><p className="stat-label">Home %</p><p className="stat-value">{p.home_goal_prob || 0}%</p></div>
        <div className="stat-box"><p className="stat-label">Away %</p><p className="stat-value">{p.away_goal_prob || 0}%</p></div>
        <div className="stat-box"><p className="stat-label">Conf</p><p className="stat-value">{p.confidence || 0}%</p></div>
      </div>
    </div>
  );

  renderMyBets = (p, i) => (
    <div className="card bg-pink" key={i}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>MyBets.Today</p>
      <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0.5rem 0 1rem' }}>{p.teams || 'N/A'}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.prediction_label || 'N/A'}</p>
      <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '1rem' }}>Odds: {p.odds?.toFixed(2) || 'N/A'}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Confidence</span>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: 9999, fontWeight: 700 }}>{p.confidence || 0}%</span>
      </div>
    </div>
  );

  render() {
    const { isAuth, userData, loading, error, myBets, statarea, scorePred, lastUpdate } = this.state;

    if (loading) return <div className="loading"><div className="spinner"></div><p>Loading predictions...</p></div>;
    if (error) return <div className="error-container"><h1 className="error-title">Oops! Something went wrong</h1><button className="btn-primary" onClick={this.loadData}>Try Again</button></div>;
    if (!isAuth) return (
      <div className="login-required">
        <h1 className="error-title">Login Required</h1>
        <button className="btn-primary" onClick={this.mockLogin}>Sign In</button>
      </div>
    );

    const secrets = this.calcSecrets();

    return (
      <div className="container">
        <div className="header">
          <h1>Private Predictions - Welcome {userData?.firstName || 'User'}</h1>
          <p>Last updated: {lastUpdate}</p>
        </div>

        {secrets.length > 0 && this.renderCarousel('secret', '🔮', 'MagajiCo Secret Matches', secrets, '#fbbf24', '#ef4444', this.renderSecret)}
        {statarea.length > 0 && this.renderCarousel('statarea', '📊', 'Statarea Analytics', statarea.slice(0,10), '#8b5cf6', '#7c3aed', this.renderStatarea)}
        {scorePred.length > 0 && this.renderCarousel('score', '🎲', 'ScorePrediction.net', scorePred.slice(0,10), '#10b981', '#059669', this.renderScore)}
        {myBets.length > 0 && this.renderCarousel('mybets', '🎯', 'MyBets.Today', myBets.slice(0,10), '#8b5cf6', '#ec4899', this.renderMyBets)}
      </div>
    );
  }
}