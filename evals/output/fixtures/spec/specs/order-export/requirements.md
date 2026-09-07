# Feature Spec: order-export

## Requirements

- The orders screen exposes an Export action.
- The export streams the account's order history as CSV.
- A date range may narrow the export.

## Acceptance Criteria

- [ ] AC-1: Export endpoint returns 200 with content type text/csv.
- [ ] AC-2: The toolbar button shows progress while the file streams.
- [ ] AC-3: from/to parameters filter exported rows.

## Non-goals

- PDF or XLSX formats (future phase).
- Scheduled recurring exports.
- Admin-level bulk export across accounts.

## Contracts

- `GET /orders/export?from&to` requires session auth; 403 otherwise.
- CSV columns: order id, date, total, currency, status.
