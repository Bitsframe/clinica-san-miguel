# Google Ads — Audit Trail

Running log of every Google Ads action taken by Claude on this account.

---

## STANDING RULE — do not touch running campaigns

**Set by user, 2026-08-17.** No modification of live campaigns, ad groups, ads,
budgets, bids, keywords, or targeting. This account has real, active spend
(~$7.78K in the trailing 30 days as of 2026-08-16).

### Explicitly OFF-LIMITS
Even though the `google-ads-write` MCP server exposes these, they are not to be
used against live campaigns without an explicit, per-action instruction:

- `google_ads_create_campaign`, `google_ads_create_pmax_campaign`
- `google_ads_update_campaign_status`, `google_ads_update_campaign_budget`
- `google_ads_update_bidding_strategy`, `google_ads_set_campaign_schedule`
- `google_ads_update_ad_status`, `google_ads_update_ad_group_status`
- `google_ads_add_keywords`, `google_ads_remove_keywords`
- `google_ads_add_negative_keywords`, `google_ads_remove_negative_keywords`
- `google_ads_set_geo_targets`, `google_ads_remove_geo_targets`
- `google_ads_apply_recommendation`, `google_ads_dismiss_recommendation`
- `google_ads_create_responsive_search_ad`, `google_ads_create_text_assets`
- `google_ads_create_sitelinks`, `google_ads_create_callouts`,
  `google_ads_create_structured_snippets`, `google_ads_remove_extension`
- any other mutation touching campaign delivery or spend

### Allowed without asking
- **Read-only** reporting/inspection (list accounts, campaigns, conversion
  actions, search terms, policy issues, performance data)
- **GTM container** work (tags/triggers/variables) — separate system, does not
  alter campaign delivery
- Reading conversion action IDs/labels in order to build GTM tags

### Requires explicit per-action approval
- Creating or modifying **conversion actions**
- Anything that changes what Ads counts as a conversion (this influences
  automated bidding, so it is treated as campaign-affecting)

## SECOND STANDING RULE — ask before EVERY configuration change

**Set by user, 2026-08-17.** Do not make any configuration change without
asking first. This extends beyond campaigns to all settings: Google Ads
config, GTM container changes, `.env` / MCP config, conversion setup,
linked accounts, and analytics configuration. Read-only inspection and
reporting remain fine without asking. Propose the change, state what it
affects, and wait for a yes.

---

## Account reference

| Item | Value |
|---|---|
| Manager (MCC) | Clinica Manager — `749-724-1666` (created 2026-08-17) |
| Ads account | SMC Management llc — `560-856-9023` |
| Conversion ID in use | `AW-368434703` |
| Google account | `clinicasanmiguel.tx@gmail.com` |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | `7497241666` (manager) |

---

## Log

### 2026-08-17

| Time | Action | Type | Result |
|---|---|---|---|
| — | Attempted `customers_list_accessible_customers` | READ | Failed — developer token missing |
| — | Attempted `google_ads_list_accounts` | READ | Failed — developer token missing |
| — | Discovered API Center is manager-accounts-only | READ (UI) | Confirmed via browser; led to MCC creation |
| — | Set `GOOGLE_ADS_LOGIN_CUSTOMER_ID=7497241666` in marketing-mcp `.env` | CONFIG | Done (local file, gitignored) |
| 04:0x | Wrote `GOOGLE_ADS_DEVELOPER_TOKEN` into marketing-mcp `.env` | CONFIG | Done — token supplied by user. Note: token was pasted into the chat transcript, so rotate it if that matters. |
| 04:1x | `google_ads_list_accounts` (write-server) | READ | Failed — "may lack sufficient permissions" (token loaded, but access level too low) |
| 04:1x | `customers_list_accessible_customers` (read-server) | READ | ✅ Success — returned `5608569023` (SMC Management), `7497241666` (Clinica Manager) |
| 04:1x | `search` on `conversion_action` for `5608569023` | READ | ❌ Blocked — "developer token is only approved for use with test accounts; apply for Basic or Standard access" |

**Blocker:** developer token is at **Test access** level. Needs upgrade to
**Basic access** in API Center before any real account data can be read.
No conversion IDs/labels retrieved yet.

**No campaign, ad group, ad, keyword, budget, or bid has been created,
modified, paused, or removed. Zero mutations executed against this account
to date.**

---

## Related work (not Google Ads, logged for context)

GTM container `GTM-MFKTKNX` — 9 triggers + 10 GA4 tags created and published
(version 6). This is analytics collection only; it does not alter Ads campaign
delivery. Full detail in [Optimationtask.md](Optimationtask.md).
