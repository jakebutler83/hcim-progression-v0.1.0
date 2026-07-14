# Progression Engine

The progression engine separates game progression data from the dashboard UI.

- `../data/milestones.js` defines milestone relationships, priorities, task mappings, rewards, and Wiki links.
- `progressionEngine.js` calculates available, blocked, completed, and recommended milestones.
- `app-ui.js` maps the existing tracker task state into completed milestone IDs and renders engine recommendations.

The current engine is intentionally small and focused on the midgame defender, gear, Barrows, and Fire Cape chains. Expand it by adding milestone objects rather than hardcoding dashboard conditions.


## Netlify secrets required for beta

The public-beta Netlify functions use Firebase Admin so webhook callers cannot write directly to Firestore.
Set either:

- `FIREBASE_SERVICE_ACCOUNT_JSON` — the complete Firebase service-account JSON stored as one secret value

or all three:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Discord webhooks are now entered per browser on the Connections page. `DISCORD_WEBHOOK_URL` remains an optional server-side fallback; never commit webhook values to GitHub.

Each signed-in user receives a private Dink URL on the Group page. Quest, Diary, and Level overrides in Dink should use that URL.
