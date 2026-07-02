# ArtBox route map

## Landing (marketing)

| Design section | Route | Build order |
|---|---|---|
| Full long-scroll page | `/` | 1 |

## Ordering app

| Screen | Route | Build order |
|---|---|---|
| Auth (login/signup) | `/app/login` | 2 |
| Choose route (mail vs DIY) | `/app/choose` | 3 |
| Mail-in order details | `/app/order/mail` | 4 |
| DIY photo upload | `/app/order/diy` | 5 |
| Checkout / billing | `/app/checkout` | 6 |
| Order confirmation | `/app/confirmation` | 7 |
| Book tab | `/app/book` | 8 |
| Account tab | `/app/account` | 9 |
| Order tracker | `/app/track` | 10 |

## Source files

- Landing: `ArtBox-landing.dc.html`
- App: `ArtBox-app.dc.html`
