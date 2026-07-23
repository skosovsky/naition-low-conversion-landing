# Yandex Metrica Field Notes

The script uses Yandex Metrica Stat API `stat/v1/data`.

Default presets are intentionally conservative and may need adjustment per counter configuration:

- `traffic`: `ym:s:visits`, `ym:s:users`, `ym:s:bounceRate`, dimensions `ym:s:lastsignTrafficSource`, `ym:s:lastsignSourceEngine`.
- `utm`: `ym:s:visits`, `ym:s:users`, `ym:s:goalReachesAny`, dimensions `ym:s:UTMCampaign`, `ym:s:UTMSource`, `ym:s:UTMMedium`.
- `goals`: uses `ym:s:goal<id>reaches`, `ym:s:goal<id>conversionRate` for each `--goal-id`.
- `ecommerce`: `ym:s:ecommercePurchases`, `ym:s:ecommerceRevenue`, dimensions `ym:s:lastsignTrafficSource`, `ym:s:UTMCampaign`.
- `finance-summary`: traffic + goals-any + ecommerce revenue/purchases.
- `landing-pages`: `ym:s:startURL` + source/device, with visits, users, bounce, page depth, duration and goals.
- `exit-pages`: `ym:s:endURL` + `ym:s:startURL` + device, with visits, users, bounce, page depth, duration and goals.
- `content-engagement`: start URL + source, with visits, users, pageviews, bounce, depth, duration and goals.
- `pageviews`: hit-level `ym:pv:URL`, `ym:pv:pageviews`, `ym:pv:users`.

Important compatibility rule: session dimensions/metrics use `ym:s:*`; hit/pageview dimensions/metrics use `ym:pv:*`. Keep them in separate presets unless using filters intentionally.

Web analytics caveat: exits are not automatically bad. Expected exits include checkout success, payment, thank-you, contacts, login/logout and other terminal pages. Unexpected exits should be judged by page intent, bounce, duration, depth, conversion and traffic source.

CFO caveat: Metrica revenue is not gross margin. Join with себестоимость, refunds, discounts, logistics, ad costs, and marketplace commissions before making profit decisions.
