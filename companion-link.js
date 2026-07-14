(() => {
  const FUNCTIONS_ROOT = '/.netlify/functions';
  let countdownTimer = null;

  function currentUser() {
    return window.HCIM_CURRENT_USER || (window.firebase && firebase.auth().currentUser);
  }

  function message(text, kind = '') {
    const el = document.getElementById('companionLinkMessage');
    if (!el) return;
    el.textContent = text || '';
    el.className = `small companion-link-message ${kind}`.trim();
  }

  async function authenticatedPost(functionName, payload = {}) {
    const user = currentUser();
    if (!user) throw new Error('Sign in before connecting RuneLite.');
    const idToken = await user.getIdToken();
    const response = await fetch(`${FUNCTIONS_ROOT}/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  }

  function startCountdown(expiresAtMs) {
    if (countdownTimer) clearInterval(countdownTimer);
    const expiry = document.getElementById('companionLinkExpiry');
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
      if (expiry) expiry.textContent = seconds ? `Expires in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : 'Code expired';
      if (!seconds && countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  async function generateCode() {
    const button = document.getElementById('generateCompanionCodeBtn');
    try {
      button.disabled = true;
      message('Creating a secure one-time code…');
      const data = await authenticatedPost('companion-link-create');
      document.getElementById('companionLinkCode').textContent = data.code;
      startCountdown(data.expiresAtMs);
      message('Enter this code in the RuneLite companion panel. It can only be used once.', 'success');
    } catch (error) {
      message(error.message, 'error');
    } finally {
      button.disabled = false;
    }
  }

  async function disconnect() {
    const button = document.getElementById('disconnectCompanionBtn');
    try {
      button.disabled = true;
      message('Disconnecting linked RuneLite companions…');
      const data = await authenticatedPost('companion-link-revoke');
      document.getElementById('companionLinkCode').textContent = '—';
      document.getElementById('companionLinkExpiry').textContent = '';
      message(`Disconnected ${data.revoked || 0} companion connection(s).`, 'success');
    } catch (error) {
      message(error.message, 'error');
    } finally {
      button.disabled = false;
    }
  }

  function install() {
    const settingsGrid = document.querySelector('#settings .settings-grid');
    if (!settingsGrid || document.getElementById('companionLinkCard')) return;

    const card = document.createElement('article');
    card.id = 'companionLinkCard';
    card.className = 'card companion-link-card';
    card.innerHTML = `
      <span class="eyebrow">RUNELITE COMPANION</span>
      <h3>Connect RuneLite</h3>
      <p>Create a one-time code, then enter it in the HCIM Progression Companion panel.</p>
      <div class="companion-code-box">
        <strong id="companionLinkCode">—</strong>
        <small id="companionLinkExpiry"></small>
      </div>
      <div class="mini-actions">
        <button id="generateCompanionCodeBtn" class="primary" type="button">Generate Link Code</button>
        <button id="disconnectCompanionBtn" type="button">Disconnect Companions</button>
      </div>
      <p id="companionLinkMessage" class="small companion-link-message">Codes expire after 10 minutes and work once.</p>`;
    settingsGrid.appendChild(card);

    document.getElementById('generateCompanionCodeBtn').addEventListener('click', generateCode);
    document.getElementById('disconnectCompanionBtn').addEventListener('click', disconnect);
  }

  document.addEventListener('DOMContentLoaded', install);
  window.addEventListener('hcim-group-ready', install);
})();
