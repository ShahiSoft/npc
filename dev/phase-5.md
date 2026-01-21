# PHASE 5 — INTEGRATION, SCALE & LAUNCH — Tasks

Overview:
Phase 5 integrates all verticals, optimizes for scale, secures production readiness, and prepares for launch (Week 9-10). Tasks include infra, observability, performance, security, and launch planning.

1) API Gateway Unification (Apollo Federation)
   - Owner: TBD
   - Estimate: 3 days
   - Priority: High
   - Dependencies: All service GraphQL schemas, shared types
   - Description: Implement federated GraphQL gateway combining all services, single endpoint, rate-limiting, tracing, and API versioning (v1).
   - Acceptance Criteria:
     - Single GraphQL endpoint serves queries across services
     - Distributed tracing shows end-to-end request spans
     - Rate limits applied per-user and per-IP (Indonesia rules)

2) Database Optimization & Reliability
   - Owner: TBD
   - Estimate: 3 days
   - Priority: High
   - Dependencies: DB schema/migrations, infra
   - Description: Add FK indexes, connection pooling, read-replicas for analytics, backup/PITR strategy, and consistency checks.
   - Acceptance Criteria:
     - Indexing and pooling validated under load tests
     - Backups restored to a test environment successfully

3) Event System Finalization
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Shared events package, Redis/Kafka infra
   - Description: Add event versioning, dead-letter queue, replay capability, and event-sourcing for subscription critical flows.
   - Acceptance Criteria:
     - Failed events land in DLQ and can be replayed after fix
     - Versioning strategy documented and backward-compatible

4) Performance Optimization
   - Owner: TBD
   - Estimate: 3 days
   - Priority: High
   - Dependencies: Caching infra (Redis), CDN, build tooling
   - Description: Implement shared Redis caching, CDN configuration (Indonesia edge), image optimization, DB query tuning, and mobile bundle optimizations for low-end Android.
   - Acceptance Criteria:
     - End-to-end latency improves on measured critical flows
     - Mobile bundle size reduced and verified on test devices

5) Security Hardening
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Shared auth, secrets management, vendor accounts (Xendit/Shipper)
   - Description: Centralize JWT validation, rotate API keys, perform PDP compliance checks, complete PCI DSS readiness steps and payment security audit (for Xendit integration), and DDoS protections for Indonesian ranges. Produce a vendor audit checklist for payment and courier integrations.
   - Acceptance Criteria:
     - JWT validation enforced across services
     - API keys rotated in test environment and services still function
     - PCI DSS readiness task documented and initial gap-assessment completed for payment flows
     - Vendor audit checklist for Xendit and Shipper.id exists and assigned

6) Monitoring & Observability
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Metrics/logging stacks (Prometheus/Grafana/ELK), tracing (Jaeger/OpenTelemetry)
   - Description: Consolidate dashboards (business + technical), add alerts aligned with Indonesian business hours, and log aggregation with request/context enrichment.
   - Acceptance Criteria:
     - Dashboards show conversion, churn, delivery success, and API latency
     - Alerts fire for simulated degradation scenarios

7) Deployment Pipeline & Runbooks
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: CI/CD infra, infra as code (Terraform), DB migration tooling
   - Description: Create unified CI/CD that supports blue-green deployments, migrations with rollbacks, multi-environment promotion, and runbooks for common failures.
   - Acceptance Criteria:
     - Blue-green deploy performed in staging with zero downtime simulation
     - Rollback executed and validated in test environment

8) Disaster Recovery & Multi-AZ
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: Cloud infra, cross-region replication capabilities
   - Description: Multi-AZ primary deployments in Jakarta, Singapore failover for diaspora, DB replication and runbooks for failover.
   - Acceptance Criteria:
     - Failover plan runbook exercised in staging with simulated outage

9) Launch Preparation: Soft Launch & Go-Live Checklist
   - Owner: TBD
   - Estimate: 2 days
   - Priority: High
   - Dependencies: All systems validated, monitoring active, customer support ready
   - Description: Execute soft launch plan phases (Jakarta → Java → Sumatra/Bali → Nationwide), run load tests, UAT with Indonesian users and diaspora, and complete go-live checklist (payments, couriers, tax, notifications, admin, legal).
   - Acceptance Criteria:
     - Load test targets achieved (10k concurrent simulated users)
     - All go-live checklist items checked or mitigations documented

10) Post-Launch Observability & Runbook Drills
    - Owner: TBD
    - Estimate: 1 day
    - Priority: High
    - Dependencies: Monitoring, alerting, runbooks
    - Description: Run live runbook drills, validate alerting cadence, and prepare incident response teams for Indonesian business hours.
    - Acceptance Criteria:
      - Drill executed and after-action report created

Notes:
- Re-read `Master-plan.txt` after Phase 5 completion to ensure final deliverables and runbooks match the documented checklist.
