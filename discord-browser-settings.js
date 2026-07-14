(() => {
  const STORAGE_KEY = 'progressPathDiscordWebhook';
  const WEBHOOK_PATTERN = /^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+(?:\?.*)?$/;

  function normalize(value) {
    return String(value || '').trim();
  }

  window.ProgressPathDiscord = {
    getWebhook() {
      return localStorage.getItem(STORAGE_KEY) || '';
    },

    saveWebhook(value) {
      const webhook = normalize(value);
      if (webhook && !WEBHOOK_PATTERN.test(webhook)) {
        throw new Error('That does not look like a valid Discord webhook URL.');
      }
      if (webhook) localStorage.setItem(STORAGE_KEY, webhook);
      else localStorage.removeItem(STORAGE_KEY);
      return webhook;
    },

    clearWebhook() {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('discordWebhookUrl');
    const saveButton = document.getElementById('saveDiscordWebhook');
    const clearButton = document.getElementById('clearDiscordWebhook');
    const status = document.getElementById('discordWebhookStatus');

    if (input) input.value = window.ProgressPathDiscord.getWebhook();

    saveButton?.addEventListener('click', () => {
      try {
        const saved = window.ProgressPathDiscord.saveWebhook(input?.value);
        if (status) status.textContent = saved ? 'Saved on this browser ✅' : 'Discord webhook removed.';
      } catch (error) {
        if (status) status.textContent = error.message;
      }
    });

    clearButton?.addEventListener('click', () => {
      window.ProgressPathDiscord.clearWebhook();
      if (input) input.value = '';
      if (status) status.textContent = 'Discord webhook removed.';
    });
  });
})();
