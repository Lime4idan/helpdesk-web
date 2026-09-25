<div align="center">

# HelpDesk Web

A simple, responsive interface for support requests from opening to resolution.

<p>
  <img alt="HTML5" src="https://img.shields.io/badge/Markup-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/Style-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/Logic-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827">
  <img alt="Bootstrap" src="https://img.shields.io/badge/UI-Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
  <img alt="Status" src="https://img.shields.io/badge/Status-Live-B39BC8?style=for-the-badge">
</p>

A lightweight frontend connected to the HelpDesk REST API through the native `fetch()` interface.

[Open the live website](https://helpdesk-web-plum.vercel.app) · [View the API repository](https://github.com/Lime4idan/helpdesk-api) · [Explore the API docs](https://helpdesk-api-t1hv.onrender.com/api-docs)

</div>

---

## About the project

HelpDesk Web gives customers and technicians a focused interface for managing support requests. It uses semantic HTML, responsive styling, Bootstrap components, and modular JavaScript without requiring a frontend framework or build step.

The interface translates API data into clear ticket cards, filters, detail views, comments, role-specific actions, and status labels.

## Features

### Shared experience

- Responsive landing page
- Account registration and login
- Persistent browser session
- Protected API requests with a Bearer token
- Ticket status filters
- Ticket details and comment history
- Clear loading, success, and error feedback
- Logout and session cleanup

### Customer workflow

- Open new support tickets
- View personal requests
- Edit or delete owned tickets
- Add comments and follow progress

### Technician workflow

- View the support queue
- Claim tickets
- Change ticket status
- Add comments to ongoing requests

## Technology

| Area | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3 and Bootstrap 5.3.8 |
| Logic | Vanilla JavaScript |
| HTTP client | Native `fetch()` |
| Authentication storage | Browser `localStorage` |
| Deployment | Vercel |

## Project structure

```text
helpdesk-web/
├── index.html          # landing page
├── login.html          # sign-in screen
├── cadastro.html       # account registration
├── chamados.html       # ticket list and creation
├── chamado.html        # details, comments, and status
├── css/
│   └── style.css       # responsive visual identity
└── js/
    ├── api.js          # API URL and shared request helper
    ├── auth.js         # browser authentication flow
    └── chamados.js     # ticket workflow
```

## Run locally

No dependency installation or build process is required.

1. Clone the repository:

```bash
git clone https://github.com/Lime4idan/helpdesk-web.git
cd helpdesk-web
```

2. Open the folder with the VS Code Live Server extension.
3. Start from `index.html`.
4. Visit the generated address, normally `http://127.0.0.1:5500`.

## API configuration

This static project does not use an `.env` file. The `API_URL` constant at the beginning of `js/api.js` centralizes the API address.

The deployed site targets:

```text
https://helpdesk-api-t1hv.onrender.com/api
```

For local API development, temporarily use:

```text
http://127.0.0.1:3001/api
```

## Deployment

The project is deployed as a static Vercel website. The backend must configure its `FRONTEND_URL` with the exact deployed origin:

```text
https://helpdesk-web-plum.vercel.app
```

This keeps CORS restricted to the official frontend.

## Related project

Authentication, business rules, ticket persistence, validation, and Swagger documentation live in the [HelpDesk API repository](https://github.com/Lime4idan/helpdesk-api).

## Project status

**Status:** Live and functional  
**Focus:** Responsive interface, browser authentication, API consumption, and role-based workflows

---

<div align="center">

### 💜 Support should feel clear from the very first click.

</div>
