# Feature Plan: order-export

## 1. Overview & Context
- **Problem Statement**: Users cannot export their order history for accounting.
- **Proposed Solution**: CSV export endpoint plus a download button in the orders screen.
- **Spec Reference**: `specs/order-export/requirements.md`
- **Feature Type**: New Capability
- **Estimated Complexity**: Low

## 2. Context References & Existing Patterns
- `src/routes/orders.ts` (lines 10-40) - Pattern to mirror for route registration
- `src/services/reportService.ts` - Existing CSV writer to reuse

## 3. Tickets (Vertical Slices, blocking edges declared)

### Ticket 1: Download order history as CSV (blocked by: none)
- **STORY**: As an account owner, I can download my order history as a CSV so that I can hand it to accounting.
- **LAYERS**: frontend `OrdersToolbar` / backend `orders.export.ts` / data none (reads existing table) / tests route + component / acceptance click through and open file
- **STEPS**:
  - UPDATE `src/routes/orders.ts` - add GET /orders/export. OBJECTIVE: AC-1. PATTERN `src/routes/orders.ts:10`. VALIDATE `npm test -- orders.export`
  - CREATE `src/components/OrdersToolbar/CsvButton.tsx`. OBJECTIVE: AC-2. PATTERN `src/components/Toolbar/Button.tsx`. VALIDATE `npm test -- csv-button`

### Ticket 2: Date-range filter on export (blocked by: 1)
- **STORY**: As an account owner, I can limit the export to a date range so the file matches my fiscal quarter.
- **LAYERS**: frontend `CsvButton` props / backend query params / data none / tests param coverage / acceptance filter then download
- **STEPS**:
  - UPDATE `src/routes/orders.export.ts`. OBJECTIVE: AC-3. VALIDATE `npm test -- orders.export.range`

## 4. Testing & Validation Matrix
- **Syntax / Lint**: `npm run lint`
- **Unit Tests**: `npm test`
- **Integration Tests**: `npm run test:integration`
- **Manual Verification Checklist**:
  - [ ] Download from the orders screen produces a CSV that opens in a spreadsheet
  - [ ] Date range limits rows accordingly

## 5. Acceptance Criteria
- [ ] AC-1: Export endpoint returns 200 with text/csv content type
- [ ] AC-2: Toolbar button triggers download and shows a spinner while streaming
- [ ] AC-3: from/to query params filter exported rows
- [ ] All automated tests pass with zero regressions
