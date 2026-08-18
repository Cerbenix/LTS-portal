# LTS Portal

A Nuxt application for managing bookings, sending invoice emails, and handling booking-system webhooks. It uses PostgreSQL for persistence and Google OAuth for portal access.

## Setup

### Requirements

- Node.js 20 or newer
- A PostgreSQL database
- Google OAuth credentials for authentication

### Install and configure

```bash
npm install
copy .env.example .env
```

Fill in `.env` with the database, webhook, email, company, and Google OAuth values. `NUXT_SESSION_PASSWORD` must be a long random string, and `ALLOWED_LOGIN_EMAILS` should contain the permitted email addresses separated by commas.

### Configure credentials

#### Gmail email notifications

- Set `GMAIL_USER` to the full Gmail address used to send notifications.
- Set `GMAIL_PASS` to a Google **App Password**, not the regular account password. Enable 2-Step Verification in the Google Account security settings, open **App passwords**, create one for this application, and copy the generated 16-character password into `.env`.

#### Google sign-in

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Configure the Google Auth Platform and set the OAuth consent screen to **External**.
3. Add each permitted account to the OAuth **Test users** list. These addresses must also be included in `ALLOWED_LOGIN_EMAILS`.
4. Create an OAuth client ID with application type **Web application**.
5. Add these authorized redirect URIs to the client:

	- Local: `http://localhost:3000/auth/google`
	- Production: `https://your-domain.example/auth/google`

6. Copy the client ID and client secret into `NUXT_OAUTH_GOOGLE_CLIENT_ID` and `NUXT_OAUTH_GOOGLE_CLIENT_SECRET`.

#### Session security

Set `NUXT_SESSION_PASSWORD` to a randomly generated value of at least 32 characters. This key protects the session cookies; keep it private and use a different value for each environment.

### Initialize the database

```bash
npm run migrate
```

### Start development

```bash
npm run dev
```

## Production

Build and preview locally with:

```bash
npm run build
npm run preview
```

The `vercel-build` script runs database migrations before building, so it can be used as the Vercel build command. 