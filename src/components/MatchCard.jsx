/* Match Card for Flashscore-style Home Page */
.match-card {
  background: var(--bg-light-secondary);
  border-radius: 0.5rem;
  padding: 12px 16px;
  margin-bottom: 10px;
  box-shadow: var(--card-shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.match-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.1);
}

.match-card .team {
  font-weight: 600;
  color: var(--text-light);
}

.match-card .score {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--accent-color);
}

@media (prefers-color-scheme: dark) {
  .match-card {
    background: var(--bg-light);
  }
  .match-card .team { color: var(--text-light); }
  .match-card .score { color: var(--accent-color); }
}