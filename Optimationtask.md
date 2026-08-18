# Clinica San Miguel — Optimization Session Log

Full record of the tracking/SEO/local-search work done in this session, and everything still outstanding. Kept at repo root for reference in future sessions.

---

## Reference IDs / accounts

- **GTM account:** Clinica San Miguel (`accountId: 6005539175`)
- **GTM container:** clinicsanmiguel.com / `GTM-MFKTKNX` (`containerId: 56177622`), workspace 6
- **GA4 property:** `www.clinicsanmiguel.com`, Property ID `428240766`, Measurement ID `G-RP596Y97YQ`
- **Google Ads account:** SMC Management llc, conversion ID `368434703` (`AW-368434703`)
- **Supabase project (marketing site):** "Clinca San Miguel", `vsvueqtgulraaczqnnvh` — tables `Locations`, `services` used throughout
- **Supabase project (EMR, different product):** `bssjlpqdgmtgaxvadwdh` — not touched
- **Cloud project (Ads/GSC/GBP APIs):** `myclinicmd-419421` / `288257309793`
- **GTM/GBP-owning Google account:** `clinicasanmiguel.tx@gmail.com`
- **Canonical site email:** `contact@clinicsanmiguel.com` (confirmed — `contacto@...` is legacy/off-site only, Gmail address is admin-only)
- **Production:** deploys from `raheel-slug` branch → Vercel, live at www.clinicsanmiguel.com

---

## ✅ Completed and verified live

### GTM / GA4
- [x] Re-enabled all 6 MCP servers (were disabled in `.claude/settings.local.json`)
- [x] Authenticated `google-tag-manager` MCP (container owner: `clinicasanmiguel.tx@gmail.com`, not the account originally tried)
- [x] Built 9 new GTM triggers: Phone Call (tel:), Book Appointment Button, Contact Link, Specials Link, Get Directions, Social Media Links, Career Apply (mailto), Language Switcher, Newsletter Signup (form)
- [x] Built GA4 Configuration tag + 9 GA4 Event tags, all wired to the triggers above
- [x] Published GTM container version 6 — **live in production**
- [x] Fixed Kempwood's broken `direction` field (was a `goo.gl` short link that `Map.tsx` would mangle)

### Supabase data fixes
- [x] Fixed 3 broken location map embeds: Fresno ↔ Pasadena were swapped, Jefferson was pointing at Blanco's map (got real embed code from user for Jefferson)
- [x] Separated Kempwood into its own tenant (`tenant_id: 2`, matching the real "Kempwood" tenant record) and set `is_active: false` — fully hidden from the site now, data preserved
- [x] Added `services.slug` column, backfilled all 25 rows
- [x] Added `Locations.city` column, backfilled all 17 active locations
- [x] Reverted an incorrect Nacogdoches phone change (DB's `726-248-2002` is correct; GMB is wrong, see Outstanding)

### GMB / Business Profile
- [x] Diagnosed GMB access chain: fixed `/mcp` auth (VSCode session couldn't do OAuth, had to use plain terminal), fixed wrong-Google-account issue, fixed InsightfulPipe subscription block by pivoting to direct Google API access
- [x] Enabled Business Information + Account Management APIs in Cloud Console
- [x] Submitted Google's official API access request form
- [x] Converted user-provided GMB CSV export (19 locations) into `gmbdata.json` at repo root
- [x] Full GMB-vs-DB comparison — found and resolved the map-embed bugs above; documented remaining discrepancies (see Outstanding)

### Code / SEO
- [x] Fixed hreflang: `en`/`es` → `en-US`/`es-US` in `utils/seo.ts` (2 functions) and `app/sitemap.ts` (8 occurrences) — **verified live in HTML `<link>` tags**
- [x] Built 9 city hub pages (`/dallas`, `/houston`, `/san-antonio`, `/fort-worth`, `/arlington`, `/farmers-branch`, `/fresno`, `/pasadena`, `/spring`) — `utils/cities.ts` + `app/[locale]/(root)/[city]/page.tsx`
- [x] Built city×service matrix (`app/[locale]/(root)/[city]/[service]/page.tsx`) — 23 services × 9 cities (excludes Dentist per request, excludes "Others" catch-all row)
- [x] Fixed a real bug: `EXCLUDED_SERVICE_IDS` only blocked build-time static generation, not runtime access — added explicit `notFound()` guards
- [x] Updated `app/sitemap.ts` to include all new city + city×service URLs
- [x] Added `Locations.city` / `services.slug` to the hand-maintained `@types/database.types.ts` (was already missing several real columns before this session)
- [x] Recovered 15 real legacy `/location/tx/{city}/{zip}` URLs from the Wayback Machine and added exact `next.config.js` redirects (2 routed to city hubs instead of a specific clinic, since they were genuinely ambiguous/dead)
- [x] Added ~20 exact `/contents/additional-services/{old-slug}` → `/services/{id}` redirects, also from Wayback data
- [x] Fixed the "18 locations" text — was hardcoded in `messages/en.json` + `messages/es.json` (`section2_p1`, `locations_desc`), now says 17 in both languages. Footer's count was already dynamic and self-corrected once Kempwood was fixed.
- [x] Updated footer's Dallas/Houston/San Antonio links from `/contact?city=...` to the new `/dallas`, `/houston`, `/san-antonio` routes
- [x] Added `Offer` schema (price: $220 USD) to service 25 (immigration medical exam) — the only service with a confirmed real price; did not fabricate prices for the other 24
- [x] Confirmed FAQPage schema was already implemented and live (audit claim was wrong — no action needed)
- [x] Diagnosed (but deliberately did not fix) the `/en/` prefix bug — root cause is a documented `next-intl` library limitation (GitHub issue #647 on `createSharedPathnamesNavigation` + `localePrefix: "as-needed"`), not app code
- [x] Built `app/api/og/route.tsx` — a code-generated 1200×630 OG image via `next/og` (branded, no missing-asset problem), pointed all 4 `utils/seo.ts` image references at it — **not yet committed**

---

## ❌ Outstanding — everything still undone

### A. Needs your manual action in Google Business Profile
- **A1.** Nacogdoches's GMB listing shows the wrong phone (`210-251-2809`, duplicated from Blanco's listing) — DB has the correct number (`726-248-2002`). Fix directly in GBP.
- **A2.** Fort Worth no-suite location (`1114 E Seminary Dr`, no suite) — inactive on the site but still `Published` on Google. Decide: reactivate on the site, or unpublish on GMB.
- **A3.** Full GBP cleanup (from the original audit, still the single highest-leverage item): claim/reclaim all 17 locations, NAP matching character-for-character with `/contact/{slug}`, add services + prices + photos to each listing, turn on a review-request SMS flow in Spanish.
- **A4.** Suppress/correct stale "11 locations" / "19 locations" boilerplate on Yelp, Nextdoor, and any old legacy pages still indexed.
- **A5.** Confirm `contacto@clinicsanmiguel.com` isn't still live anywhere in GBP/Yelp citations now that `contact@` is the confirmed canonical address.
- **A6.** 2 "Dentista San Miguel" GMB listings (Fort Worth, Dallas NW) — confirmed decision to leave GMB-only, not added to the site's `Locations` table. No action needed unless this changes.

### B. Needs data/content only you can supply
- **B1.** Real Google Maps embed code for Dallas NW (id 3) — its `direction` field still points at the wrong location (copy of Dallas East's data). Same process as the Jefferson fix: Google Maps → search address → Share → Embed a map → send me the `pb=` code.
- **B2.** Real name and credentials of your USCIS-authorized civil surgeon — needed to add `Physician` schema markup (a genuine competitive differentiator, but I won't guess at a real person's identity).
- **B3.** Real prices for services beyond the immigration exam, if you want more `Offer` schema coverage — currently only service 25 ($220) has a confirmed price.
- **B4.** Service 7 ("Dot Test") has a data-entry artifact baked into its description ("Dot Test,Ensure road safety…") — needs a content rewrite, not a code fix.
- **B5.** Service 25's title is Spanish-only ("Evaluaciones Médicas de Inmigración…") even on the English page — needs a real English title supplied.

### C. Blocked on external approval/access
- **C1.** Google Ads `GOOGLE_ADS_DEVELOPER_TOKEN` — still missing. Check Ads → Admin → API Center for an Explorer-level token (should be instant if this is a manager/MCC account).
- **C2.** Direct Google Business Profile API access — request submitted, awaiting Google's review (no fixed timeline, can be rejected).
- **C3.** Once C1 or C2 unblocks: wire real Google Ads conversion tags to the GTM triggers already built (Book Appointment, Contact, Phone Call, Get Directions, Submit Lead Form) — this is what actually resolves the "Misconfigured"/"Needs attention" statuses on the Ads dashboard. Fastest path without the dev token: manually copy each conversion action's ID + Label from Ads UI (Goals → Conversions → Tag setup → "Use Google Tag Manager") and hand them to me.

### D. Held deliberately — real risk, no local test capability
- **D1.** The `/en/` prefix bug (every internal link on every page gets a redirect hop). Diagnosed with high confidence, fix identified (bypass `next-intl`'s `Link` with a manually-computed href in Navbar/Footer, or upgrade `next-intl` to get the newer `createNavigation` API). Not attempted because this machine has **no Node.js/npm installed at all** — no way to build, typecheck, or run a dev server to verify before pushing to production.
- **D2.** 17× "Loading map…" on `/contact` (Core Web Vitals problem — 17 simultaneous interactive map iframes). Needs static thumbnails on cards + one interactive map, but touches the shared `Location` card component used by `/contact` *and* all the new city/city-service pages — same no-test-capability risk as D1.

### E. Housekeeping
- **E1.** `app/api/og/route.tsx` + the `utils/seo.ts` image reference changes are built but **not committed/pushed** yet.
- **E2.** This machine has no Node.js/npm/`node_modules` at all — every code change this session was verified by manual review + production curl-checks after deploy, never by an actual local build. Worth running a real `npm run build` on a machine that has Node before trusting future changes blind.
- **E3.** Legacy redirect coverage is not 100% exhaustive — the Wayback CDX crawl only surfaced what Wayback happened to archive (15 location URLs, ~24 contents/service URLs). There may be other old indexed URLs not covered; worth checking Google Search Console's "Pages" report for 404s/soft-404s from real crawl data as a second pass.
