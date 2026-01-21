# PHASE 2 — CORE USER JOURNEY — Tasks

Overview:
Phase 2 implements the complete "Signup → First Delivery" vertical (Week 3-4). Tasks below are actionable, include estimates, priorities, dependencies, and acceptance criteria.

1) Mobile: Onboarding & Purchase Flow
   - Owner: TBD
   - Estimate: 3 days
   - Priority: High
   - Dependencies: `packages/shared` types, shared auth, API client
   - Description: Implement taste-quiz onboarding, subscription selection UI, Indonesian address form (RT/RW), and payment screen (Xendit QRIS). Persist user profile and create subscription via API.
   - Acceptance Criteria:
     - User can complete taste quiz and submit profile
     - Address form validates `rt`/`rw` and postal code
     - Payment integration triggers a mock Xendit charge and returns success in dev environment

2) Web PWA: Mirror Mobile Flow
   - Owner: TBD
   - Estimate: 2.5 days
   - Priority: High
   - Dependencies: Mobile screens, shared API client
   - Description: Implement responsive PWA screens replicating mobile onboarding, subscription selection, address entry, and payment flow.
   - Acceptance Criteria:
     - Flow parity with mobile (same API calls and client types)
     - PWA install prompt works in supported browsers

3) Backend: User Service
   - Owner: TBD
   - Estimate: 1.5 days
   - Priority: High
   - Dependencies: `@nusantara/shared` types, DB migrations, event bus
   - Description: Implement user creation endpoint that stores taste profile, validates address, persists user and publishes `USER_CREATED` event.
   - Acceptance Criteria:
     - POST /users stores user with normalized Indonesian address
     - `USER_CREATED` published to Redis with typed payload

4) Backend: Subscription Service
   - Owner: TBD
   - Estimate: 1.5 days
   - Priority: High
   - Dependencies: User Service, DB schema, holiday calendar
   - Description: Create subscription records, calculate `next_billing_date` (skip Indonesian holidays), publish `SUBSCRIPTION_CREATED`.
   - Acceptance Criteria:
     - Subscription created and linked to user
     - `next_billing_date` respects holiday calendar in example cases

5) Backend: Payment Service (Xendit)
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Subscription Service events, shared API client, Xendit sandbox
   - Description: Listen to `SUBSCRIPTION_CREATED`, charge via Xendit sandbox (QRIS simulated), and emit `PAYMENT_SUCCEEDED` or `PAYMENT_FAILED`.
   - Acceptance Criteria:
     - Payment service receives `SUBSCRIPTION_CREATED` and performs a mock charge
     - `PAYMENT_SUCCEEDED` published on success and persisted to payments table

6) Backend: Order Service
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Payment Service events, product table, warehouse mapping
   - Description: On `PAYMENT_SUCCEEDED`, create order with PPN 11% tax, choose warehouse by region, persist order, publish `ORDER_CREATED`.
   - Acceptance Criteria:
     - Order contains tax line (11%) and correct warehouse assignment in tests
     - `ORDER_CREATED` event published

7) Backend: Shipping Service Integration (Shipper.id)
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Order Service, Shipper.id test account / mock
   - Description: Consume `ORDER_CREATED`, create shipment via Shipper.id (mock), generate AWB, publish `SHIPPING_CREATED`.
   - Acceptance Criteria:
     - Shipment created and AWB returned in dev flow
     - `SHIPPING_CREATED` published with tracking info

8) Notification Service
   - Owner: TBD
   - Estimate: 1 day
   - Priority: High
   - Dependencies: Shipping Service events, WhatsApp/Email dev integration
   - Description: On `SHIPPING_CREATED`, send WhatsApp (in Indonesian) and email with tracking link; schedule delivery reminders.
   - Acceptance Criteria:
     - WhatsApp mock message sent with Indonesian template
     - Email is queued with tracking link

9) Admin Dashboard: Order Processing View
   - Owner: TBD
   - Estimate: 2 days
   - Priority: Medium
   - Dependencies: Event bus, API gateway
   - Description: Real-time list of new signups and orders, ability to view order and print label (mock), customer support view.
   - Acceptance Criteria:
     - Admin can see `USER_CREATED` and `ORDER_CREATED` in real-time (dev UI)

10) Analytics: Event Listener
    - Owner: TBD
    - Estimate: 1.5 days
    - Priority: Medium
    - Dependencies: Event bus, shared types
    - Description: Listen to all events and record funnel steps for first-time users and payment success rates.
    - Acceptance Criteria:
      - Analytics captures sample events and exposes simple metrics (counts)

11) End-to-end Test Scenario
    - Owner: TBD
    - Estimate: 1 day
    - Priority: High
    - Dependencies: All above, Docker Compose
    - Description: Automated E2E test that runs through signup → subscription → payment → order → shipping → notification using mocks where required.
    - Acceptance Criteria:
      - Test completes and asserts each event and DB state transitions

12) Monitoring Dashboard for Vertical E2E
    - Owner: TBD
    - Estimate: 1 day
    - Priority: Medium
    - Dependencies: Instrumented services (traces/metrics), analytics
    - Description: Build a simple monitoring dashboard that visualizes the signup→first-delivery flow, showing spans/traces, event counts, and key metrics (time to first delivery, payment success rate).
    - Acceptance Criteria:
      - Dashboard displays trace for a sample E2E run and shows conversion funnel metrics

Notes:
- Re-read `Master-plan.txt` after Phase 2 completion to ensure no missing features.
- Keep event contracts stable; prefer adding new event fields only with backward compatibility.
