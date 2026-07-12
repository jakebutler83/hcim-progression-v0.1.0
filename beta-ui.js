(() => {
  function groupStorageKey(name) {
    const uid = window.HCIM_CURRENT_USER?.uid || 'guest';
    const groupId = window.HCIM_ACTIVE_GROUP_ID || 'no-group';
    return `${name}:${uid}:${groupId}`;
  }

  function showWelcomeOnce() {
    const modal = document.getElementById('welcomeModal');
    if (!modal || !window.HCIM_CURRENT_USER || !window.HCIM_ACTIVE_GROUP_ID) return;
    const key = groupStorageKey('hcimBetaWelcomeSeen');
    if (localStorage.getItem(key)) return;
    modal.hidden = false;
  }

  function closeWelcome() {
    const modal = document.getElementById('welcomeModal');
    if (modal) modal.hidden = true;
    localStorage.setItem(groupStorageKey('hcimBetaWelcomeSeen'), '1');
  }

  function showError(message) {
    const banner = document.getElementById('appErrorBanner');
    const text = document.getElementById('appErrorText');
    if (!banner || !text) return;
    text.textContent = message || 'Refresh the page or report this beta issue.';
    banner.hidden = false;
  }

  window.addEventListener('hcim-group-ready', () => setTimeout(showWelcomeOnce, 300));
  window.addEventListener('error', (event) => {
    console.error('Unhandled app error:', event.error || event.message);
    showError('A beta error occurred. Your saved Firebase data should be safe. Refresh and report the steps that caused it.');
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showError('A connection or app action failed. Refresh once; if it repeats, send a beta report.');
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeWelcomeBtn')?.addEventListener('click', closeWelcome);
    document.getElementById('dismissErrorBtn')?.addEventListener('click', () => {
      const banner = document.getElementById('appErrorBanner');
      if (banner) banner.hidden = true;
    });
  });
})();
