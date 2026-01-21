# PHASE 3 — SUBSCRIPTION MANAGEMENT — Tasks

Overview:
Phase 3 implements the subscription lifecycle features (Week 5-6). Tasks below are actionable and include estimates, priorities, dependencies, and acceptance criteria.

1) Mobile: Subscription Dashboard & Actions
   - Owner: TBD
   - Estimate: 3 days
   - Priority: High
   - Dependencies: Shared auth, API client, subscription service
   - Description: Build subscription dashboard with next delivery, history, and one-tap actions: Skip next delivery, Pause, Cancel, Vacation hold, and plan upgrade/downgrade.
   - Acceptance Criteria:
     - Users can perform Skip/Pause/Cancel and see immediate UI state changes
     - Vacation hold screens allow date ranges and enforce 3-month max

2) Web PWA: Subscription Management UI
   - Owner: TBD
   - Estimate: 2 days
   - Priority: Medium
   - Dependencies: Mobile components, API client
   - Description: Provide the same management features as mobile, with bulk management for diaspora accounts.
   - Acceptance Criteria:
     - Bulk operations succeed in dev environment

3) Subscription Service: Core State Machine
   - Owner: TBD
   - Estimate: 3 days
   - Priority: High
   - Dependencies: DB schema, event bus, payment service
   - Description: Implement skip/pause/cancel/vacation hold logic, publish events for state transitions, implement prorated refunds and resume behaviors.
   - Acceptance Criteria:
     - State transitions are unit-tested and published events exist for each transition
     - Proration logic has example calculations and tests

4) Payment Service: Proration & Recurring Updates
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Subscription state events, Xendit integration
   - Description: React to subscription state changes, update recurring charges, handle refunds via Xendit (mock or sandbox), and adjust tax calculations (PPN 11%).
   - Acceptance Criteria:
     - Refund and proration flows covered by tests and sample transactions

5) Order Service: Respect Subscription State
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Subscription events, scheduling service
   - Description: Skip order creation for skipped subscriptions, suspend order generation for paused subscriptions, schedule skip/resume for vacation holds.
   - Acceptance Criteria:
     - Orders not created for skipped cycles; scheduling tested

6) Shipping Service: Cancel/Update Shipments
   - Owner: TBD
   - Estimate: 1.5 days
   - Priority: Medium
   - Dependencies: Order events, courier APIs
   - Description: Cancel pending shipments for skipped orders, update courier preferences, and handle mid-subscription address changes.
   - Acceptance Criteria:
     - Test demonstrates cancellation and courier update flow

7) Notification Service: Subscription Messages
   - Owner: TBD
   - Estimate: 1 day
   - Priority: Medium
   - Dependencies: Subscription events, WhatsApp/email integration
   - Description: Notify users on skip/pause/cancel/vacation hold actions and send reminders (7 days before resume).
   - Acceptance Criteria:
     - Notifications are queued and templated in Indonesian

8) Analytics: Churn & Forecasting
   - Owner: TBD
   - Estimate: 2 days
   - Priority: Medium
   - Dependencies: Event stream, producer portal data model
   - Description: Track churn reasons and build forecasting models (baseline analytics), provide dashboards for churn analysis.
   - Acceptance Criteria:
     - Churn metrics available; sample forecast run produces output

9) Admin Dashboard: Subscription Tools
   - Owner: TBD
   - Estimate: 1.5 days
   - Priority: Medium
   - Dependencies: Subscription service API, analytics
   - Description: Admin interface for bulk subscription edits, churn interventions, and revenue forecasting tools.
   - Acceptance Criteria:
     - Admin can trigger bulk pause/unpause and see effects in analytics

10) Producer Portal: Demand Forecasting Integration
    - Owner: TBD
    - Estimate: 2 days
    - Priority: Low-to-Medium
    - Dependencies: Analytics, subscription counts, export APIs
    - Description: Provide demand forecasting data for producers based on subscription counts and trends.
    - Acceptance Criteria:
      - Producer portal receives sample forecast data and displays it

11) Integration Tests & State Machine Diagram
    - Owner: TBD
    - Estimate: 1.5 days
    - Priority: High
    - Dependencies: All subscription-related services
    - Description: Create integration tests covering skip/pause/cancel/proration and produce a state machine diagram documenting transitions. Include explicit test cases for holiday-proration interactions (e.g., Eid, national holidays) and regional courier constraints (Papua, Bali) to validate scheduling and proration logic.
    - Acceptance Criteria:
      - Tests pass and state machine diagram checked into docs
      - Integration tests include holiday-proration scenarios and regional courier constraint cases with expected outcomes

Notes:
- Re-read `Master-plan.txt` after Phase 3 completion to ensure subscription edge-cases (holiday handling, regional constraints) are covered.
