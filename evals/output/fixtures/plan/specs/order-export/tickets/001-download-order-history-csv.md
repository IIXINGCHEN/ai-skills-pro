# Ticket 1: Download order history as CSV

Feature: order-export  |  Blocked by: none

## User story

As an account owner, I can download my order history as a CSV, so that I can hand it to accounting.

## Slice scope

One demonstrable outcome: clicking export in the orders screen yields a CSV file.

## Layers touched

- [x] Frontend / interface: `src/components/OrdersToolbar/CsvButton.tsx`
- [x] Backend / logic: `src/routes/orders.export.ts`
- [x] Data / persistence: none (reads existing orders table)
- [x] Tests: route integration test + component test
- [x] Acceptance: download via UI, open file in a spreadsheet

## Acceptance criteria

- [ ] Given an authenticated account with orders, when the user clicks Export, then a CSV downloads containing every order row.
- [ ] Given no orders, when the user clicks Export, then the CSV downloads with headers only.

## Done means

- [x] Every checked layer above is complete within this ticket
- [x] Validation suite green (`eng-validate`)
- [x] Slice demoed against the user story
