(() => {
  const config = window.HCIM_FIREBASE_CONFIG || {};
  const configured = config.apiKey && !String(config.apiKey).includes('PASTE');
  let auth;
  let db;

  function authMessage(text, type = '') {
    const el = document.getElementById('authMessage');
    if (!el) return;
    el.textContent = text || '';
    el.className = `auth-message ${type}`.trim();
  }

  function groupMessage(text, type = '') {
    const el = document.getElementById('groupMessage');
    if (!el) return;
    el.textContent = text || '';
    el.className = `auth-message ${type}`.trim();
  }

  function friendlyError(error) {
    const code = error && error.code ? error.code : '';
    const messages = {
      'auth/email-already-in-use': 'That email already has an account.',
      'auth/invalid-email': 'Enter a valid email address.',
      'auth/invalid-credential': 'The email or password is incorrect.',
      'auth/user-not-found': 'The email or password is incorrect.',
      'auth/wrong-password': 'The email or password is incorrect.',
      'auth/weak-password': 'Use a password with at least 6 characters.',
      'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
      'auth/network-request-failed': 'Network error. Check your connection and try again.',
      'auth/missing-email': 'Enter your email address first.',
      'permission-denied': 'Firebase blocked this action. Check your Firestore rules.'
    };
    return messages[code] || (error && error.message) || 'Something went wrong.';
  }

  function showForm(which) {
    const login = document.getElementById('loginForm');
    const signup = document.getElementById('signupForm');
    const loginBtn = document.getElementById('showLoginBtn');
    const signupBtn = document.getElementById('showSignupBtn');
    const isLogin = which === 'login';
    login.hidden = !isLogin;
    signup.hidden = isLogin;
    loginBtn.classList.toggle('active', isLogin);
    signupBtn.classList.toggle('active', !isLogin);
    authMessage('');
  }

  function showOnly(screen) {
    document.getElementById('authScreen').hidden = screen !== 'auth';
    document.getElementById('groupScreen').hidden = screen !== 'group';
    document.getElementById('appShell').hidden = screen !== 'app';
  }

  function makeInviteCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = 'HC';
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }


  function makeDinkToken() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID().replace(/-/g, '') + window.crypto.randomUUID().replace(/-/g, '');
    }
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out = '';
    for (let i = 0; i < 64; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  async function ensureDinkToken(user, profile) {
    if (profile && profile.dinkToken) return profile;
    const dinkToken = makeDinkToken();
    await db.collection('users').doc(user.uid).set({
      dinkToken,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return { ...(profile || {}), dinkToken };
  }


  function normalizeInviteCode(value) {
    return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  }

  async function ensureInviteDocument(groupId, group, user) {
    if (!group || group.ownerUid !== user.uid || !group.inviteCode) return;
    const code = normalizeInviteCode(group.inviteCode);
    if (!code) return;
    const inviteRef = db.collection('groupInvites').doc(code);
    const inviteSnap = await inviteRef.get();
    if (!inviteSnap.exists) {
      await inviteRef.set({
        groupId,
        groupName: group.name || 'HCIM Group',
        ownerUid: user.uid,
        active: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  async function createProfile(user, displayName, rsName) {
    await db.collection('users').doc(user.uid).set({
      email: user.email || '',
      displayName,
      runescapeName: rsName,
      groupId: null,
      role: null,
      dinkToken: makeDinkToken(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    await user.updateProfile({ displayName });
  }

  async function loadProfile(user) {
    const ref = db.collection('users').doc(user.uid);
    const snap = await ref.get();
    if (snap.exists) return snap.data();
    const fallback = {
      email: user.email || '',
      displayName: user.displayName || 'Player',
      runescapeName: '',
      groupId: null,
      role: null,
      dinkToken: makeDinkToken(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await ref.set(fallback, { merge: true });
    return fallback;
  }

  async function openGroup(groupId, profile, user) {
    profile = await ensureDinkToken(user, profile);
    const groupSnap = await db.collection('groups').doc(groupId).get();
    if (!groupSnap.exists) {
      await db.collection('users').doc(user.uid).update({ groupId: null, role: null });
      showOnly('group');
      return;
    }
    const group = groupSnap.data();
    try { await ensureInviteDocument(groupId, group, user); } catch (error) { console.warn('Invite backfill failed:', error); }
    window.HCIM_CURRENT_USER = user;
    window.HCIM_CURRENT_PROFILE = profile;
    window.HCIM_ACTIVE_GROUP_ID = groupId;
    window.HCIM_ACTIVE_GROUP = group;
    document.getElementById('authUserBadge').textContent = profile.displayName || user.displayName || user.email || 'Signed in';
    const title = document.querySelector('#appShell .topbar h1');
    if (title) title.textContent = `${group.name} HCIM Progression`;
    showOnly('app');
    window.dispatchEvent(new CustomEvent('hcim-group-ready', { detail: { user, profile, groupId, group } }));
  }

  async function routeSignedInUser(user) {
    try {
      const profile = await loadProfile(user);
      window.HCIM_CURRENT_USER = user;
      window.HCIM_CURRENT_PROFILE = profile;
      if (profile.groupId) {
        await openGroup(profile.groupId, profile, user);
      } else {
        document.getElementById('groupWelcomeTitle').textContent = `Welcome, ${profile.displayName || user.displayName || 'Ironman'}!`;
        showOnly('group');
      }
    } catch (error) {
      console.error(error);
      authMessage(friendlyError(error), 'error');
      showOnly('auth');
    }
  }

  function updateVerificationBanner(user) {
    const banner = document.getElementById('verificationBanner');
    if (!banner) return;
    banner.hidden = !user || user.emailVerified;
  }

  async function sendVerification(user, messageTarget = 'auth') {
    if (!user || user.emailVerified) return;
    await user.sendEmailVerification();
    const message = 'Verification email sent. Check your inbox and spam folder.';
    if (messageTarget === 'group') groupMessage(message, 'success');
    else authMessage(message, 'success');
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!configured) {
      authMessage('Firebase is not configured. Add your Firebase config first.', 'error');
      document.body.classList.remove('auth-loading');
      return;
    }

    if (!firebase.apps.length) firebase.initializeApp(config);
    auth = firebase.auth();
    db = firebase.firestore();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(console.warn);

    document.getElementById('showLoginBtn')?.addEventListener('click', () => showForm('login'));
    document.getElementById('showSignupBtn')?.addEventListener('click', () => showForm('signup'));
    document.getElementById('forgotPasswordBtn')?.addEventListener('click', async () => {
      const email = document.getElementById('loginEmail')?.value.trim();
      if (!email) return authMessage('Enter your email address, then click Forgot password again.', 'error');
      authMessage('Sending password reset email…');
      try {
        await auth.sendPasswordResetEmail(email);
        authMessage('Password reset email sent. Check your inbox and spam folder.', 'success');
      } catch (error) {
        authMessage(friendlyError(error), 'error');
      }
    });

    document.getElementById('resendVerificationBtn')?.addEventListener('click', async () => {
      const user = auth.currentUser;
      if (!user) return;
      const button = document.getElementById('resendVerificationBtn');
      if (button) button.disabled = true;
      try {
        await sendVerification(user);
        if (button) button.textContent = 'Verification sent';
      } catch (error) {
        authMessage(friendlyError(error), 'error');
      } finally {
        setTimeout(() => { if (button) { button.disabled = false; button.textContent = 'Resend verification'; } }, 4000);
      }
    });

    document.getElementById('loginForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      authMessage('Logging in…');
      try {
        await auth.signInWithEmailAndPassword(
          document.getElementById('loginEmail').value.trim(),
          document.getElementById('loginPassword').value
        );
      } catch (error) {
        authMessage(friendlyError(error), 'error');
      }
    });

    document.getElementById('signupForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      const displayName = document.getElementById('signupDisplayName').value.trim();
      const rsName = document.getElementById('signupRsName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirmPassword').value;
      if (password !== confirm) return authMessage('Passwords do not match.', 'error');
      authMessage('Creating account…');
      try {
        const credential = await auth.createUserWithEmailAndPassword(email, password);
        await createProfile(credential.user, displayName, rsName);
        try { await sendVerification(credential.user); } catch (verificationError) { console.warn('Verification email failed:', verificationError); }
      } catch (error) {
        authMessage(friendlyError(error), 'error');
      }
    });

    document.getElementById('createGroupForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      const user = auth.currentUser;
      if (!user) return groupMessage('Please log in again.', 'error');
      const name = document.getElementById('createGroupName').value.trim();
      const groupSize = Number(document.getElementById('createGroupSize').value);
      if (!name) return groupMessage('Enter a group name.', 'error');
      groupMessage('Creating your group…');
      const button = event.submitter;
      if (button) button.disabled = true;
      try {
        const profile = await loadProfile(user);
        const groupRef = db.collection('groups').doc();
        const inviteCode = makeInviteCode();
        const batch = db.batch();
        batch.set(groupRef, {
          name,
          ownerUid: user.uid,
          memberUids: [user.uid],
          memberCount: 1,
          groupSize,
          inviteCode,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.set(db.collection('groupInvites').doc(inviteCode), {
          groupId: groupRef.id,
          groupName: name,
          ownerUid: user.uid,
          active: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.set(groupRef.collection('members').doc(user.uid), {
          uid: user.uid,
          displayName: profile.displayName || user.displayName || '',
          runescapeName: profile.runescapeName || '',
          role: 'owner',
          slot: 'player1',
          joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.update(db.collection('users').doc(user.uid), {
          groupId: groupRef.id,
          role: 'owner',
          slot: 'player1',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.set(groupRef.collection('progress').doc('main'), {
          done: {}, playerDone: {}, diaryDone: {}, diarySteps: {},
          players: {
            groupName: name,
            player1: profile.runescapeName || profile.displayName || 'Player 1',
            player2: '', player3: '', player4: '', player5: ''
          },
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        await batch.commit();
        const updatedProfile = { ...profile, groupId: groupRef.id, role: 'owner', slot: 'player1' };
        await openGroup(groupRef.id, updatedProfile, user);
      } catch (error) {
        console.error(error);
        groupMessage(friendlyError(error), 'error');
      } finally {
        if (button) button.disabled = false;
      }
    });


    document.getElementById('joinInviteCode')?.addEventListener('input', event => {
      event.target.value = normalizeInviteCode(event.target.value);
    });

    document.getElementById('joinGroupForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      const user = auth.currentUser;
      if (!user) return groupMessage('Please log in again.', 'error');
      const code = normalizeInviteCode(document.getElementById('joinInviteCode').value);
      if (code.length < 4) return groupMessage('Enter a valid invite code.', 'error');
      groupMessage('Joining group…');
      const button = event.submitter;
      if (button) button.disabled = true;
      try {
        const profile = await loadProfile(user);
        if (profile.groupId) throw new Error('Your account already belongs to a group.');
        const inviteRef = db.collection('groupInvites').doc(code);
        let joinedGroupId = null;
        let joinedGroup = null;
        let joinedSlot = null;
        await db.runTransaction(async transaction => {
          const inviteSnap = await transaction.get(inviteRef);
          if (!inviteSnap.exists || inviteSnap.data().active === false) throw new Error('That invite code is invalid or expired.');
          const invite = inviteSnap.data();
          const groupRef = db.collection('groups').doc(invite.groupId);
          const groupSnap = await transaction.get(groupRef);
          if (!groupSnap.exists) throw new Error('That group no longer exists.');
          const group = groupSnap.data();
          const members = Array.isArray(group.memberUids) ? group.memberUids : [];
          if (members.includes(user.uid)) throw new Error('You are already a member of this group.');
          const memberCount = Number(group.memberCount || members.length || 0);
          const groupSize = Number(group.groupSize || 3);
          if (memberCount >= groupSize) throw new Error('That group is already full.');
          const slotNumber = memberCount + 1;
          const slot = `player${slotNumber}`;
          joinedSlot = slot;
          const memberRef = groupRef.collection('members').doc(user.uid);
          const userRef = db.collection('users').doc(user.uid);
          const progressRef = groupRef.collection('progress').doc('main');
          const playerName = profile.runescapeName || profile.displayName || user.displayName || `Player ${slotNumber}`;

          transaction.update(groupRef, {
            memberUids: firebase.firestore.FieldValue.arrayUnion(user.uid),
            memberCount: memberCount + 1,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          transaction.set(memberRef, {
            uid: user.uid,
            displayName: profile.displayName || user.displayName || '',
            runescapeName: profile.runescapeName || '',
            role: 'member',
            slot,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          transaction.update(userRef, {
            groupId: groupRef.id,
            role: 'member',
            slot,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          transaction.set(progressRef, {
            players: { [slot]: playerName },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          joinedGroupId = groupRef.id;
          joinedGroup = { ...group, memberUids: [...members, user.uid], memberCount: memberCount + 1 };
        });
        const updatedProfile = { ...profile, groupId: joinedGroupId, role: 'member', slot: joinedSlot };
        window.HCIM_ACTIVE_GROUP = joinedGroup;
        await openGroup(joinedGroupId, updatedProfile, user);
      } catch (error) {
        console.error(error);
        groupMessage(friendlyError(error), 'error');
      } finally {
        if (button) button.disabled = false;
      }
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => auth.signOut());
    document.getElementById('groupLogoutBtn')?.addEventListener('click', () => auth.signOut());

    auth.onAuthStateChanged(async user => {
      document.body.classList.remove('auth-loading');
      updateVerificationBanner(user);
      if (user) {
        await user.reload().catch(() => {});
        updateVerificationBanner(user);
        await routeSignedInUser(user);
      } else {
        window.HCIM_CURRENT_USER = null;
        window.HCIM_CURRENT_PROFILE = null;
        window.HCIM_ACTIVE_GROUP_ID = null;
        showOnly('auth');
        showForm('login');
      }
    });
  });
})();
