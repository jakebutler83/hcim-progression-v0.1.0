(() => {
  const playerSlots = ['player1','player2','player3','player4','player5'];
  let refreshTimer = null;
  let progressionEngine = null;
  let progressionMilestones = [];

  import('./src/engine/progressionEngine.js')
    .then((engine) => {
      progressionEngine = engine;
      progressionMilestones = engine.getAllMilestones();
      scheduleDashboardRefresh();
    })
    .catch((error) => console.warn('Progression engine could not load', error));

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value || '';
    return div.innerHTML;
  }

  function openRoute(target) {
    const legacy = document.querySelector(`.tab[data-route="${target}"]`);
    if (legacy) legacy.click();
    document.querySelectorAll('.side-link').forEach(btn => btn.classList.toggle('active', btn.dataset.target === target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function activeGroupSize() {
    return Math.max(1, Math.min(5, Number(window.HCIM_ACTIVE_GROUP?.groupSize || 3)));
  }

  function activeSlots() {
    return playerSlots.slice(0, activeGroupSize());
  }

  function percent(done, total) {
    return total ? Math.round((done / total) * 100) : 0;
  }

  function setMetric(prefix, done, total) {
    const pct = percent(done, total);
    const pctEl = document.getElementById(`${prefix}Pct`);
    const barEl = document.getElementById(`${prefix}Bar`);
    const metaEl = document.getElementById(`${prefix}Meta`);
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
    if (metaEl) metaEl.textContent = `${done.toLocaleString()} of ${total.toLocaleString()} complete`;
    return pct;
  }

  function taskIsDone(task) {
    try { return typeof taskDone === 'function' ? taskDone(task) : !!state?.done?.[task.id]; }
    catch (_) { return false; }
  }

  function taskById(id) {
    try { return (typeof allTasks === 'function' ? allTasks() : []).find((task) => task.id === id) || null; }
    catch (_) { return null; }
  }

  function milestoneIsComplete(milestone) {
    if (!milestone) return false;
    const primaryTasks = (milestone.taskIds || []).map(taskById).filter(Boolean);
    const primaryComplete = primaryTasks.length > 0 && primaryTasks.every(taskIsDone);
    const aliasComplete = (milestone.taskAliases || []).map(taskById).filter(Boolean).some(taskIsDone);
    return primaryComplete || aliasComplete;
  }

  function engineCompletedIds() {
    return progressionMilestones.filter(milestoneIsComplete).map((milestone) => milestone.id);
  }

  function milestoneRemainingItems(milestone, completedIds) {
    if (!milestone || !progressionEngine) return [];
    const items = [];
    progressionEngine.getMissingRequirements(milestone.id, completedIds).forEach((id) => {
      const requirement = progressionEngine.getMilestone(id);
      if (requirement) items.push({ title: requirement.name, desc: requirement.reason || 'Required progression milestone.' });
    });
    (milestone.taskIds || []).forEach((id) => {
      const task = taskById(id);
      if (task && !taskIsDone(task)) items.push({ title: task.title, desc: task.desc || milestone.reason || '' });
    });
    return items.filter((item, index, list) => list.findIndex((other) => other.title === item.title) === index);
  }

  function taskCountsForPlayer(slot) {
    try {
      const tasks = typeof allTasks === 'function' ? allTasks() : [];
      let total = 0, done = 0;
      tasks.forEach(task => {
        if (task.role && !['All','Group'].includes(task.role)) return;
        total++;
        const personal = state?.playerDone?.[task.id];
        const complete = personal ? !!personal[slot] : !!state?.done?.[task.id];
        if (complete) done++;
      });
      const quests = typeof questData !== 'undefined' ? questData : [];
      quests.forEach(q => {
        total++;
        if (state?.playerDone?.[q.id]?.[slot]) done++;
      });
      return { total, done, pct: percent(done, total) };
    } catch (_) { return { total: 0, done: 0, pct: 0 }; }
  }

  function renderPlayerOverview() {
    const grid = document.getElementById('playerOverviewGrid');
    if (!grid || typeof state === 'undefined') return;
    grid.innerHTML = '';
    activeSlots().forEach((slot, index) => {
      const name = document.getElementById(slot)?.value || state?.players?.[slot] || `Player ${index + 1}`;
      const c = taskCountsForPlayer(slot);
      const nextPersonal = findNextForPlayer(slot);
      const card = document.createElement('article');
      card.className = 'player-overview-card card';
      card.innerHTML = `<div class="player-avatar">${index + 1}</div><div class="player-overview-copy"><div class="player-card-title"><h3>${escapeHtml(name)}</h3><strong>${c.pct}%</strong></div><p>${c.done}/${c.total} personal requirements</p><div class="progress-wrap"><div class="progress-bar" style="width:${c.pct}%"></div></div><small>${nextPersonal ? `Next: ${escapeHtml(nextPersonal)}` : 'All tracked requirements complete'}</small></div>`;
      grid.appendChild(card);
    });
  }

  function findNextForPlayer(slot) {
    try {
      const tasks = typeof allTasks === 'function' ? allTasks() : [];
      const personal = tasks.find(t => ['All','Group'].includes(t.role || 'All') && !state?.playerDone?.[t.id]?.[slot] && !state?.done?.[t.id]);
      if (personal) return personal.title;
      const quest = (typeof questData !== 'undefined' ? questData : []).find(q => !state?.playerDone?.[q.id]?.[slot]);
      return quest?.name || '';
    } catch (_) { return ''; }
  }

  function routeAnalytics() {
    const phases = typeof route !== 'undefined' ? route : [];
    const tasks = phases.flatMap(p => p.tasks || []);
    const done = tasks.filter(taskIsDone).length;
    return { done, total: tasks.length, pct: percent(done, tasks.length), phases };
  }

  function questAnalytics() {
    const quests = typeof questData !== 'undefined' ? questData : [];
    const slots = activeSlots();
    let done = 0;
    const total = quests.length * slots.length;
    quests.forEach(q => slots.forEach(slot => { if (state?.playerDone?.[q.id]?.[slot]) done++; }));
    return { done, total, pct: percent(done, total), quests };
  }

  function diaryAnalytics() {
    const diaries = typeof diaryData !== 'undefined' ? diaryData : [];
    const slots = activeSlots();
    let done = 0, total = 0;
    diaries.forEach(d => {
      (d.steps || []).forEach((_, idx) => slots.forEach(slot => {
        total++;
        try { if (typeof getDiaryStepDone === 'function' && getDiaryStepDone(d, idx, slot)) done++; } catch (_) {}
      }));
    });
    return { done, total, pct: percent(done, total), diaries };
  }

  function storageAnalytics() {
    const phases = typeof storageRoute !== 'undefined' ? storageRoute : [];
    const tasks = phases.flatMap(p => p.tasks || []);
    const done = tasks.filter(taskIsDone).length;
    return { done, total: tasks.length, pct: percent(done, tasks.length) };
  }

  function activityAnalytics() {
    const phases = typeof route !== 'undefined' ? route : [];
    const activityPhases = phases.filter(p => /optional|minigame|activity|tempoross|guardian|wintertodt|foundry|pest|barbarian|motherlode|mahogany|blast furnace|pyramid|sepulchre/i.test(p.phase || ''));
    const tasks = activityPhases.flatMap(p => p.tasks || []);
    const done = tasks.filter(taskIsDone).length;
    return { done, total: tasks.length, pct: percent(done, tasks.length), tasks };
  }

  function currentGoal() {
    if (progressionEngine && progressionMilestones.length) {
      const completedIds = engineCompletedIds();
      const milestone = progressionEngine.getNextMilestone(completedIds);
      if (milestone) {
        const remaining = milestoneRemainingItems(milestone, completedIds);
        const progress = progressionEngine.getMilestoneProgress(milestone.id, completedIds);
        return {
          title: milestone.name,
          done: progress.done,
          total: progress.total,
          pct: progress.percent,
          remaining,
          reason: milestone.reason,
          estimatedMinutes: milestone.estimatedMinutes,
          category: milestone.category,
          route: milestone.route || 'main',
          wiki: milestone.wiki
        };
      }
      return { title: 'Current milestone map complete', done: 1, total: 1, pct: 100, remaining: [], reason: 'Every milestone in the current engine dataset is complete.' };
    }

    const phases = typeof route !== 'undefined' ? route : [];
    for (const phase of phases) {
      const tasks = phase.tasks || [];
      const incomplete = tasks.filter(t => !taskIsDone(t));
      if (!incomplete.length) continue;
      const done = tasks.length - incomplete.length;
      return { title: phase.phase, done, total: tasks.length, pct: percent(done, tasks.length), remaining: incomplete.slice(0, 4) };
    }
    return { title: 'Current roadmap complete', done: 1, total: 1, pct: 100, remaining: [] };
  }

  function nextUnlock() {
    if (progressionEngine && progressionMilestones.length) {
      const completedIds = engineCompletedIds();
      const next = progressionEngine.getNextMilestone(completedIds);
      if (next) {
        const unlockNames = (next.unlocks || [])
          .map((id) => progressionEngine.getMilestone(id)?.name || id.replaceAll('_', ' '))
          .slice(0, 2);
        return {
          title: next.reward || next.name,
          reason: next.reason || 'Recommended progression unlock.',
          meta: `${next.category} · about ${next.estimatedMinutes} min${unlockNames.length ? ` · leads to ${unlockNames.join(', ')}` : ''}`,
          route: next.route || 'main'
        };
      }
    }

    try {
      const quests = typeof questData !== 'undefined' ? questData : [];
      const ready = quests.find(q => typeof questStatus === 'function' && questStatus(q) === 'ready');
      if (ready) return { title: ready.name, reason: ready.reward || 'Useful quest progression unlock.', meta: `${ready.tier || 'Quest'} · ready now`, route: 'quests' };
    } catch (_) {}
    const next = typeof allTasks === 'function' ? allTasks().find(t => !taskIsDone(t)) : null;
    return next ? { title: next.title, reason: next.desc || 'The next recommended roadmap step.', meta: next.phase || 'Progression', route: 'main' } : { title: 'All current unlocks complete', reason: 'Your group has completed the available roadmap.', meta: 'Great work', route: 'main' };
  }

  function recommendations() {
    const results = [];
    if (progressionEngine && progressionMilestones.length) {
      const completedIds = engineCompletedIds();
      progressionEngine.getRecommendedMilestones(completedIds, 3).forEach((milestone) => {
        results.push({
          icon: iconForText(`${milestone.category} ${milestone.name}`),
          title: milestone.name,
          reason: `${milestone.reason || 'Recommended progression milestone.'} Estimated time: ${milestone.estimatedMinutes} minutes.`,
          route: milestone.route || 'main'
        });
      });
      if (results.length) return results;
    }

    try {
      const activities = activityAnalytics().tasks || [];
      activities.filter(t => !taskIsDone(t)).slice(0, 3).forEach(t => results.push({ icon: iconForText(t.title), title: t.title, reason: t.desc || 'Optional group progression.', route: 'main' }));
      if (results.length < 3) {
        const readyQuests = (typeof questData !== 'undefined' ? questData : []).filter(q => typeof questStatus === 'function' && questStatus(q) === 'ready');
        readyQuests.slice(0, 3 - results.length).forEach(q => results.push({ icon: '📜', title: q.name, reason: q.reward || 'Quest unlock available now.', route: 'quests' }));
      }
    } catch (_) {}
    return results.slice(0, 3);
  }

  function iconForText(text) {
    const value = String(text || '').toLowerCase();
    if (/tempoross|fish|cook/.test(value)) return '🎣';
    if (/guardian|runecraft|gotr/.test(value)) return '🔷';
    if (/defender|warrior|combat|slayer/.test(value)) return '⚔️';
    if (/wintertodt|fire/.test(value)) return '🔥';
    if (/agility|sepulchre/.test(value)) return '🏃';
    if (/farm|tithe/.test(value)) return '🌿';
    if (/barbarian|torso/.test(value)) return '🛡️';
    return '⭐';
  }

  function renderDashboardInsights() {
    if (typeof state === 'undefined') return;
    const routeA = routeAnalytics();
    const questA = questAnalytics();
    const diaryA = diaryAnalytics();
    const activityA = activityAnalytics();
    const storageA = storageAnalytics();

    const metrics = [
      { label: 'Progression', pct: setMetric('categoryRoute', routeA.done, routeA.total), target: 'main' },
      { label: 'Questing', pct: setMetric('categoryQuest', questA.done, questA.total), target: 'quests' },
      { label: 'Diaries', pct: setMetric('categoryDiary', diaryA.done, diaryA.total), target: 'diary' },
      { label: 'Activities', pct: setMetric('categoryActivity', activityA.done, activityA.total), target: 'main' },
      { label: 'Group Bank', pct: setMetric('categoryStorage', storageA.done, storageA.total), target: 'storage' }
    ];
    const weakest = metrics.filter(m => m.pct < 100).sort((a,b) => a.pct - b.pct)[0];
    const weakestEl = document.getElementById('weakestAreaText');
    if (weakestEl) weakestEl.textContent = weakest ? `Weakest area: ${weakest.label} (${weakest.pct}%). This is a good place to focus next.` : 'Every tracked category is complete.';

    document.querySelectorAll('.category-card').forEach((card, index) => {
      const metric = metrics[index];
      card.tabIndex = 0;
      card.onclick = () => openRoute(metric.target);
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') openRoute(metric.target); };
    });

    const goal = currentGoal();
    const goalTitle = document.getElementById('smartGoalTitle');
    const goalReason = document.getElementById('smartGoalReason');
    const goalPct = document.getElementById('smartGoalPercent');
    const goalBar = document.getElementById('smartGoalBar');
    const checklist = document.getElementById('smartGoalChecklist');
    if (goalTitle) goalTitle.textContent = goal.title;
    if (goalReason) goalReason.textContent = goal.remaining.length ? `${goal.reason || `${goal.remaining.length} tracked steps remain.`}${goal.estimatedMinutes ? ` Estimated time: ${goal.estimatedMinutes} minutes.` : ''}` : (goal.reason || 'This milestone is complete.');
    if (goalPct) goalPct.textContent = `${goal.pct}%`;
    if (goalBar) goalBar.style.width = `${goal.pct}%`;
    if (checklist) checklist.innerHTML = goal.remaining.map(t => `<div class="goal-item"><span>○</span><div><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.desc || '')}</small></div></div>`).join('') || '<div class="goal-item complete"><span>✓</span><div><strong>Milestone complete</strong><small>Your group is ready for the next chapter.</small></div></div>';

    const unlock = nextUnlock();
    const unlockTitle = document.getElementById('nextUnlockTitle');
    const unlockReason = document.getElementById('nextUnlockReason');
    const unlockMeta = document.getElementById('nextUnlockMeta');
    if (unlockTitle) unlockTitle.textContent = unlock.title;
    if (unlockReason) unlockReason.textContent = unlock.reason;
    if (unlockMeta) unlockMeta.innerHTML = `<span>${escapeHtml(unlock.meta)}</span><span>Recommended next</span>`;

    const recGrid = document.getElementById('recommendedActivityGrid');
    if (recGrid) {
      const recs = recommendations();
      recGrid.innerHTML = recs.map((r, i) => `<article class="recommended-card card" data-recommend-route="${r.route}"><span class="recommended-icon">${r.icon}</span><div><span class="eyebrow">RECOMMENDATION ${i + 1}</span><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.reason)}</p></div><span class="recommend-arrow">→</span></article>`).join('') || '<article class="card"><h3>No recommendations remaining</h3><p>Your current roadmap is complete.</p></article>';
      recGrid.querySelectorAll('[data-recommend-route]').forEach(card => card.addEventListener('click', () => openRoute(card.dataset.recommendRoute)));
    }

    renderPlayerOverview();
  }

  function scheduleDashboardRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(renderDashboardInsights, 80);
  }

  async function loadGroupPage(detail) {
    const { user, profile, groupId, group } = detail;
    document.getElementById('sidebarGroupName').textContent = group.name || 'HCIM Group';
    document.getElementById('dashboardGreeting').textContent = `Welcome back, ${profile.displayName || user.displayName || 'Ironman'}`;
    document.getElementById('dashboardGroupLine').textContent = `${group.name || 'Your group'} is ready for the next milestone.`;
    document.getElementById('groupInviteCode').textContent = group.inviteCode || 'Unavailable';
    document.getElementById('groupPageName').textContent = group.name || 'HCIM Group';
    document.getElementById('groupCapacityText').textContent = `Members: ${group.memberCount || 1}/${group.groupSize || 3}`;
    document.getElementById('sidebarMemberCount').textContent = `${group.memberCount || 1}/${group.groupSize || 3} members`;
    document.getElementById('settingsAccountName').textContent = profile.displayName || user.displayName || 'Player';
    document.getElementById('settingsAccountEmail').textContent = user.email || '';

    try {
      const db = firebase.firestore();
      const snap = await db.collection('groups').doc(groupId).collection('members').orderBy('slot').get();
      const members = snap.docs.map(d => d.data());
      const owner = members.find(m => m.role === 'owner');
      document.getElementById('groupOwnerText').textContent = `Owner: ${owner?.displayName || owner?.runescapeName || 'Group owner'}`;
      const cards = document.getElementById('groupMemberCards');
      cards.innerHTML = '';
      members.forEach((m, i) => {
        const card = document.createElement('article');
        card.className = 'member-card card';
        card.innerHTML = `<div class="member-number">${i + 1}</div><div><h3>${escapeHtml(m.runescapeName || m.displayName || `Player ${i+1}`)}</h3><p>${escapeHtml(m.displayName || '')}</p><span class="member-role">${m.role === 'owner' ? 'Owner' : 'Member'} · ${escapeHtml(m.slot || '')}</span></div>`;
        cards.appendChild(card);
      });
    } catch (error) {
      console.warn('Could not load group members', error);
    }
    scheduleDashboardRefresh();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.side-link').forEach(btn => btn.addEventListener('click', () => openRoute(btn.dataset.target)));
    document.querySelectorAll('[data-open-route]').forEach(btn => btn.addEventListener('click', () => openRoute(btn.dataset.openRoute)));
    document.getElementById('copyInviteBtn')?.addEventListener('click', async () => {
      const code = document.getElementById('groupInviteCode').textContent.trim();
      try { await navigator.clipboard.writeText(code); document.getElementById('copyInviteBtn').textContent = 'Copied!'; setTimeout(()=>document.getElementById('copyInviteBtn').textContent='Copy Invite Code',1500); }
      catch (_) { prompt('Copy this invite code:', code); }
    });
    document.getElementById('settingsLogoutBtn')?.addEventListener('click', () => document.getElementById('logoutBtn')?.click());
    document.getElementById('settingsImportBtn')?.addEventListener('click', () => document.getElementById('importBtn')?.click());
    document.getElementById('settingsExportBtn')?.addEventListener('click', () => document.getElementById('exportBtn')?.click());
    window.addEventListener('hcim-group-ready', e => loadGroupPage(e.detail));

    const observer = new MutationObserver(scheduleDashboardRefresh);
    ['progressText','mainTasks','questTracker','diaryTracker','storageTasks','player1','player2','player3','player4','player5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { subtree:true, childList:true, characterData:true, attributes:true });
    });
    scheduleDashboardRefresh();
  });
})();
