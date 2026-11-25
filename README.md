# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Peoplecom content and forms

- The six generated studio-detail images are not team portraits. Replace them with approved real team photos before presenting them as team photography.
- Contact messages are stored privately in `contact_messages`; newsletter signups in `newsletter_subscribers`. Open More → Database to review them. No visitor can read, update or delete either table.
- Submissions are validated in the browser and on the server, reject the honeypot, and use an atomic hashed-IP rate limit (five attempts per 15 minutes). No raw IP is stored.
- Owner email notifications are not enabled: a verified sending domain and confirmed owner address are still required. Newsletter signup stores consented addresses only; it sends no campaigns.
- Confirm email, phone, response hours, street address and social URLs in the content records. Unknown values are labelled in preview and omitted in production; no response-time promise is invented.
