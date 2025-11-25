// src/components/PrivatePredictions.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PrivatePredictions.css';

const API_BASE = window.location.origin;

// Card Components
const SecretCard = ({ secret }) => {
  const stars = secret.count === 3 ? '⭐⭐⭐' : '⭐⭐';
  return (
    <div className="card bg-gold">
      <div className="secret-header">
        <span>🔮 SECRET</span>
        <span>{stars}</span>
      </div>
      <p className="teams">{secret.teams}</p>
      <div className="sources">
        <p>Sources:</p>
        <div className="sources-list">
          {secret.sources.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
      <button className="btn-primary claim-btn">🎁 Claim</button>
    </div>
  );
};

const StatareaCard = ({ p }) => (
  <div className="card bg-purple">
    <p className="source-label">Statarea</p>
    <p className="teams">{p.teams || 'N/A'}</p>
    <p className="prediction-label">{p.prediction_label || 'N/A'}</p>
    <div className="stats-grid">
      <div className="stat-box"><p>Home</p><p>{p.home_pct || 0}%</p></div>
      <div className="stat-box"><p>Draw</p><p>{p.draw_pct || 0}%</p></div>
      <div className="stat-box"><p>Away</p><p>{p.away_pct || 0}%</p></div>
    </div>
    <div className="confidence"><span>Confidence</span><span>{p.confidence || 0}%</span></div>
  </div>
);

const BetCard = ({ p }) => (
  <div className="card bg-red">
    <div className="bet-header">
      <div>
        <p>🎯 TOP BET</p>
        <p>{p.teams || 'N/A'}</p>
      </div>
      <span>{p.confidence || 0}%</span>
    </div>
    <div className="bet-prediction">{p.prediction_label || 'N/A'}</div>
    <div className="stats-grid">
      <div className="stat-box"><p>1</p><p>{p.home_pct || 0}%</p></div>
      <div className="stat-box"><p>X</p><p>{p.draw_pct || 0}%</p></div>
      <div className="stat-box"><p>2</p><p>{p.away_pct || 0}%</p></div>
    </div>
    <button className="btn-primary place-bet-btn">💰 Place Bet</button>
  </div>
);

const ScoreCard = ({ p }) => (
  <div className="card bg-green">
    <p>{p.league || 'League'}</p>
    <p>{p.teams || 'N/A'}</p>
    <div className="score-display">
      <p>{p.score || 'N/A'}</p>
      <p>{p.total_goals || 0} Goals</p>
    </div>
    <div className="stats-grid">
      <div className="stat-box"><p>Home %</p><p>{p.home_goal_prob || 0}%</p></div>
      <div className="stat-box"><p>Away %</p><p>{p.away_goal_prob || 0}%</p></div>
      <div className="stat-box"><p>Conf</p><p>{p.confidence || 0}%</p></div>
    </div>
  </div>
);

const MyBetsCard = ({ p }) => (
  <div className="card bg-pink">
    <p>MyBets.Today</p>
    <p>{p.teams || 'N/A'}</p>
    <p>{p.prediction_label || 'N/A'}</p>
    <p>Odds: {p.odds?.toFixed(2) || 'N/A'}</p>
    <div className="confidence">
      <span>Confidence</span>
      <span>{p.confidence || 0}%</span>
    </div>
  </div>
);

// Carousel Component
const Carousel = ({ id, icon, title, items, renderItem }) => {
  const ref = useRef();
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      <div className="section-header">
        <span>{icon}</span>
        <h2>{title}</h2>
        <div className="divider"></div>
      </div>
      <div className="carousel-wrapper" ref={ref}>
        {items.map((item, i) => (
          <React.Fragment key={i}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
      {items.length > 3 && (
        <>
          <button className="carousel-btn left" onClick={() => scroll(-1)}>◀</button>
          <button className="carousel-btn right" onClick={() => scroll(1)}>▶</button>
        </>
      )}
    </div>
  );
};

// Main Component
const PrivatePredictions = () => {
  const [userData, setUserData] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [myBets, setMyBets] = useState([]);
  const [statarea, setStatarea] = useState([]);
  const [scorePred, setScorePred] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setLastUpdate(new Date().toLocaleTimeString()), 1000);
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setIsAuth(true);
        loadData();
      } catch (e) {
        setIsAuth(false);
      }
    } else {
      setIsAuth(false);
    }
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [bets, stata, score] = await Promise.all([
        fetchAPI('/api/predictions/mybets'),
        fetchAPI('/api/predictions/statarea'),
        fetchAPI('/api/predictions/scoreprediction'),
      ]);
      setMyBets(bets);
      setStatarea(stata);
      setScorePred(score);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAPI = async (url) => {
    const res = await fetch(`${API_BASE}${url}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.predictions || [];
  };

  const mockLogin = () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ firstName: 'Demo', username: 'demo@user.com' })
    );
    window.location.reload();
  };

  const calcSecrets = () => {
    const map = new Map();
    const norm = (t1, t2) => [t1?.toLowerCase().trim(), t2?.toLowerCase().trim()].sort().join('|');

    [...statarea.map(p => ({...p, src: 'Statarea'})),
     ...scorePred.map(p => ({...p, src: 'ScorePrediction'})),
     ...myBets.map(p => ({...p, src: 'MyBets'}))]
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

    return Array.from(map.values()).filter(m => m.count >= 2).sort((a,b) => b.count - a.count).slice(0,10);
  };

  if (!isAuth) {
    return (
      <div className="login-required">
        <h1>Login Required</h1>
        <button className="btn-primary" onClick={mockLogin}>Sign In</button>
      </div>
    );
  }

  if (loading) return <div className="loading"><p>Loading...</p></div>;
  if (error) return <div className="error-container"><p>Error loading predictions</p></div>;

  const secrets = calcSecrets();

  return (
    <div className="container">
      <div className="header">
        <h1>Private Predictions - Welcome {userData?.firstName || 'User'}</h1>
        <p>Last updated: {lastUpdate}</p>
      </div>

      {secrets.length > 0 && <Carousel id="secret" icon="🔮" title="MagajiCo Secret Matches" items={secrets} renderItem={(s) => <SecretCard secret={s} />} />}
      {statarea.length > 0 && <Carousel id="statarea" icon="📊" title="Statarea Analytics" items={statarea} renderItem={(s) => <StatareaCard p={s} />} />}
      {scorePred.length > 0 && <Carousel id="score" icon="🎲" title="ScorePrediction.net" items={scorePred} renderItem={(s) => <ScoreCard p={s} />} />}
      {myBets.length > 0 && <Carousel id="mybets" icon="🎯" title="MyBets.Today" items={myBets} renderItem={(s) => <MyBetsCard p={s} />} />}
    </div>
  );
};

export default PrivatePredictions;