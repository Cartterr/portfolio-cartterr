# Portfolio repo (josecarter.dev)

- Site content lives in frontend/src/data (software.ts = main page, visual.ts = /visual).
- The main page's UI is frontend/src/site (sections/, fx/ for effects, site.css). Its motion rules
  are at the top of site.css: transform/opacity only, time-based scripts, no CSS masks.
- After any change, run `npm test` from the repo root. Do not push if it fails.
- If tests pass, commit to main with a clear message and push.
- Railway (project carter-portfolio, service portfolio-cartterr) deploys main automatically.
- After pushing, confirm the new deployment succeeded via the Railway MCP.
- Keep claims accurate: DICTUC work is emotion and physiological measurement research
  (ANID 13250116), not neurological. Dily is listed Sep 2025 to Sep 2026.
