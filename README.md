# HelpDesk Web

A lightweight HelpDesk frontend built with HTML, Bootstrap, CSS, and JavaScript. It communicates with the HelpDesk API through `fetch()`.

**Live site:** https://helpdesk-web-plum.vercel.app

## Run locally

No `npm install` is required. Open the folder with the VS Code Live Server extension and start from `index.html`. The local address is normally `http://127.0.0.1:5500`.

For local development, confirm the target URL at the beginning of `js/api.js`.

## API configuration

This static project does not use an `.env` file. The `API_URL` constant in `js/api.js` centralizes the API address and currently targets `https://helpdesk-api-t1hv.onrender.com/api`. Temporarily replace it with `http://127.0.0.1:3001/api` to use a local API.

## Features

- Registration and login
- JWT stored in `localStorage`
- Bearer token on private requests
- Ticket list and status filters
- Ticket creation, details, editing, and deletion
- Comments
- Status changes and technician assignment
- Logout

## Files

- `index.html` — landing page
- `login.html` and `cadastro.html` — authentication
- `chamados.html` — ticket list and creation
- `chamado.html` — ticket details, comments, and status
- `css/style.css` — responsive styling
- `js/api.js` — API URL and shared request helper
- `js/auth.js` — browser session flow
- `js/chamados.js` — ticket workflow

Bootstrap 5.3.8 is loaded from its official CDN. The custom stylesheet adds the light-purple visual identity without changing system behavior.

## Vercel deployment

The project is deployed as a static Vercel site. The API uses `FRONTEND_URL=https://helpdesk-web-plum.vercel.app`, keeping CORS restricted to the live frontend.
