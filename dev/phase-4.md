# PHASE 4 — REAL-TIME DELIVERY ECOSYSTEM — Tasks

Overview:
Phase 4 implements the real-time delivery ecosystem (Week 7-8). Tasks below are actionable and include estimates, priorities, dependencies, and acceptance criteria.

1) Mobile: Real-time Tracking & Delivery UX
   - Owner: TBD
   - Estimate: 3 days
   - Priority: High
   - Dependencies: WebSocket server, shipping service, map SDK
   - Description: Implement real-time map, delivery countdown, driver contact, live updates via WebSocket, photo proof viewer, and redelivery scheduling.
   - Acceptance Criteria:
     - Mobile receives live location updates and shows ETA
     - Photo proof is uploaded and visible in UI

2) Web PWA: Delivery Tracking & Sharing
   - Owner: TBD
   - Estimate: 2 days
   - Priority: Medium
   - Dependencies: WebSocket server, analytics
   - Description: Provide tracking interface, shareable tracking links, delivery history with map views.
   - Acceptance Criteria:
     - Tracking links show live status and history

3) Shipping Service: WebSocket Server & Courier Polling
   - Owner: TBD
   - Estimate: 4 days
   - Priority: High
   - Dependencies: Courier APIs, Redis, order service
   - Description: Implement a WebSocket server for real-time updates, courier API polling adapters (JNE/SiCepat/Anteraja), driver location aggregation, ETA calculation, and exception handling.
   - Acceptance Criteria:
     - WebSocket server broadcasts mock driver locations
     - Courier adapter returns sample status updates and AWB tracking data

4) Order Service: Status Sync & Exceptions
   - Owner: TBD
   - Estimate: 1.5 days
   - Priority: Medium
   - Dependencies: Shipping service events, notification service
   - Description: Update order status from shipping events, trigger notifications for status changes, and handle delivery exceptions.
   - Acceptance Criteria:
     - Orders reflect delivery state transitions and exceptions are logged

5) Notification Service: Delivery Notifications
   - Owner: TBD
   - Estimate: 1.5 days
   - Priority: High
   - Dependencies: Shipping events, WhatsApp service, email service
   - Description: Send milestone notifications (out-for-delivery, 30-min warning, delivered with photo, failed/delay) in Indonesian and English.
   - Acceptance Criteria:
     - Notification templates exist and are triggered for sample events

6) Analytics: Delivery Performance & Scoring
   - Owner: TBD
   - Estimate: 2 days
   - Priority: Medium
   - Dependencies: Shipping events, courier adapters
   - Description: Track delivery performance per courier, calculate on-time rates, and compute courier scoring metrics for dashboards.
   - Acceptance Criteria:
     - Dashboard shows courier performance metrics for sample data

7) Warehouse Integration: Pick Lists & Thermal Printing
   - Owner: TBD
   - Estimate: 2 days
   - Priority: Medium
   - Dependencies: Order service, admin UI, printer adapters (mock)
   - Description: Implement pick list generation, thermal label printing flow (mock), inventory deduction and returns workflow.
   - Acceptance Criteria:
     - Pick list generates correctly and label printing simulated

8) Driver App (Simplified RN)
   - Owner: TBD
   - Estimate: 3 days
   - Priority: Low-to-Medium
   - Dependencies: WebSocket server, shipping service
   - Description: Minimal driver app with delivery list, navigation links, photo capture, and exception reporting.
   - Acceptance Criteria:
     - Driver app can change delivery status and upload photo proof in dev setup

9) Regional & Indonesian-specific Handling
   - Owner: TBD
   - Estimate: 1 day
   - Priority: High
   - Dependencies: Maps, address normalization, courier rules
   - Description: Implement gang/komplek handling, traffic-aware ETA heuristics (Jakarta), and regional constraints (Papua/Bali special cases).
   - Acceptance Criteria:
     - ETA heuristics show different ETA for Jakarta test cases vs rural test cases

10) Integration Tests & Load Smoke Tests
    - Owner: TBD
    - Estimate: 2 days
    - Priority: High
    - Dependencies: WebSocket server, shipping adapters, Docker Compose
    - Description: End-to-end tests simulating live updates, light load tests to validate WebSocket scaling assumptions, and contract tests to verify shipping adapters adhere to `@nusantara/shared/events` schemas.
    - Acceptance Criteria:
      - WebSocket broadcast under test load maintains acceptable latency for simulated clients
      - Contract tests validate shipping adapter event payloads match `@nusantara/shared/events` types and fail on incompatible changes

Notes:
- Re-read `Master-plan.txt` after Phase 4 completion to validate delivery edge cases and driver workflows.
