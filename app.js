(() => {
  const data = window.SCOREBOARD_DATA;
  const byName = new Map(data.players.map(player => [player.name, player]));
  const players = [...data.players].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  const leaderboard = document.getElementById('leaderboard');
  let selected = players[0].name;
  let activeView = 'groups';

  document.getElementById('leader-name').textContent = players[0].name;
  document.getElementById('leader-score').textContent = `${players[0].total} pontos`;
  document.getElementById('participant-count').textContent = players.length;

  function renderLeaderboard() {
    leaderboard.innerHTML = players.map((player, index) => `<button type="button" class="player-row" data-player="${player.name}" aria-pressed="${player.name === selected}"><span class="rank">${index + 1}</span><span>${player.name}</span><span class="player-score">${player.total}</span></button>`).join('');
  }

  function renderDetail(name) {
    selected = name;
    const player = byName.get(name);
    const rank = players.findIndex(item => item.name === name) + 1;
    document.getElementById('place-badge').textContent = `${rank}.º lugar`;
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-total').textContent = player.total;
    document.getElementById('group-total').textContent = player.groupPoints;
    document.getElementById('knockout-total').textContent = player.knockoutPoints;
    document.getElementById('group-count').textContent = `${player.groupMatches.length} jogos com pontos`;
    const knockoutCount = Object.values(player.knockoutRight).flat().length;
    document.getElementById('knockout-count').textContent = `${knockoutCount} previsões certas · ${player.knockoutPoints} pontos`;
    document.getElementById('group-matches').innerHTML = player.groupMatches.map(match => `<div class="match-row"><strong>${match.match}</strong><span class="actual">Real ${match.actual}</span><span class="prediction">Palpite ${match.prediction}</span><span class="points">+${match.points}</span></div>`).join('');
    document.getElementById('knockout-guesses').innerHTML = ['1/16','1/8','1/4','1/2'].filter(stage => player.knockoutRight[stage].length).map(stage => `<div class="stage"><h4>${stage} · ${player.knockoutRight[stage].length * 5} pontos</h4><div class="guess-tags">${player.knockoutRight[stage].map(team => `<span class="guess-tag">${team}</span>`).join('')}</div></div>`).join('');
    renderLeaderboard();
  }

  function setView(view) {
    activeView = view;
    document.getElementById('groups-section').hidden = view !== 'groups';
    document.getElementById('knockout-section').hidden = view !== 'knockout';
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.view === view)));
  }

  leaderboard.addEventListener('click', event => {
    const button = event.target.closest('[data-player]');
    if (button) renderDetail(button.dataset.player);
  });
  document.querySelector('.audit-tabs').addEventListener('click', event => {
    const button = event.target.closest('[data-view]');
    if (button) setView(button.dataset.view);
  });
  renderDetail(selected);
  setView(activeView);
})();
