# HaatPoint

Marketplace (vendors, products, orders, Pathao courier) built with Laravel 12, Inertia + React (TypeScript), Vite and MySQL.

## Local setup

```bash
composer install
cp .env.example .env          # then fill in the values below
php artisan key:generate
php artisan migrate
npm install
php artisan storage:link      # needed for uploaded images
npm run dev                   # Vite (http://localhost:5173)
php artisan serve             # Laravel (http://127.0.0.1:8000)
```

`.env` values that must be present: `DB_*`, `MAIL_*` (Brevo), `GOOGLE_*` (Socialite), `PATHAO_*` (courier).

## Mail (Brevo SMTP relay)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=<Login value from Brevo: Settings → SMTP & API → SMTP keys>
MAIL_PASSWORD=<the SMTP key, not the account password>
MAIL_FROM_ADDRESS="no-reply@haatpoint.com"   # must be a verified sender/domain in Brevo
```

STARTTLS on port 587 is negotiated automatically, so `MAIL_SCHEME` / `MAIL_ENCRYPTION` are not needed
(Laravel 12 ignores `MAIL_ENCRYPTION`).

### Common Brevo errors

| Error | Cause | Fix |
| --- | --- | --- |
| `525 5.7.1 Unauthorized IP address` | "Blocking unknown IP addresses" is active for SMTP keys and this machine's outbound IP is not listed | [Settings → Security → Authorized IPs](https://app.brevo.com/security/authorised_ips): add the IP (the page shows your current one) or deactivate blocking for SMTP |
| `535 5.7.8 Authentication failed` | Wrong login format, wrong/rotated key, extra whitespace, truncated key | Copy the **Login** field from Settings → SMTP & API and generate a fresh SMTP key |

For local development without Brevo access use `MAIL_MAILER=log` (mails are written to
`storage/logs/laravel.log`), or `array` in tests.

## Uploaded images / files

Uploads are stored on the `public` disk and served through the `public/storage` symlink
(`php artisan storage:link`). Folders: `product_images`, `category_images`, `store_logos`,
`profile_images`. Product/store/avatar images are resized with Intervention Image (GD driver).

If uploads fail locally, check that PHP has a writable temp directory:
`php -r "var_dump(sys_get_temp_dir(), is_writable(sys_get_temp_dir()));"` — the path printed must exist.

## Tests

`php artisan test` currently cannot run against the default SQLite in-memory setup, because several
migrations use MySQL-only syntax (`ALTER TABLE ... MODIFY`). Point `DB_CONNECTION` in `phpunit.xml`
at a MySQL test database before running the suite.
