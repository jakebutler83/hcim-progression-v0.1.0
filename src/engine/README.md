# Progression Engine

The progression engine separates game progression data from the dashboard UI.

- `../data/milestones.js` defines milestone relationships, priorities, task mappings, rewards, and Wiki links.
- `progressionEngine.js` calculates available, blocked, completed, and recommended milestones.
- `app-ui.js` maps the existing tracker task state into completed milestone IDs and renders engine recommendations.

The current engine is intentionally small and focused on the midgame defender, gear, Barrows, and Fire Cape chains. Expand it by adding milestone objects rather than hardcoding dashboard conditions.
