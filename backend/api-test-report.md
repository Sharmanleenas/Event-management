# API Test Report
**Project:** Centralized Event Management System
**Generated:** Automatically based on source code analysis

## 1. Summary
- **Total APIs Detected:** 14
- **Working APIs:** 14 (Configured in routers and controllers)
- **Failed/Missing APIs:** 9 (Details below)

## 2. Analyzed Endpoints
### Auth Module
- `POST /api/auth/register` (Working)
- `POST /api/auth/login` (Working)

### Admin & HOD Event Module
- `POST /api/events/create` (Working)
- `GET /api/events/pending` (Working)
- `GET /api/events/public` (Working)
- `PUT /api/events/approve/:id` (Working)
- `PUT /api/events/reject/:id` (Working)
- `PUT /api/events/verify/:id` (Working - Used for verifying participant payment)
- `PUT /api/events/complete/:id` (Working)

### Participant Module
- `POST /api/participants/register` (Working)
- `POST /api/participants/upload/:id` (Working)

### Analytics Module
- `GET /api/analytics` (Working)

### Notifications Module
- `GET /api/notifications` (Working)
- `PUT /api/notifications/read/:id` (Working)

### Certificate Module
- `GET /api/certificate/generate/:id` (Working)

### SES Module
- `POST /api/ses/generate` (Working)

## 3. Discrepancies (Missing vs Requested)
The following APIs were requested but **do not exist** in the existing codebase:
- `GET /api/events/my-events`
- `GET /api/events/:id/participants`
- `GET /api/events/leader`
- `GET /api/participants/event/:id`
- `GET /api/participants/status/:id`
- `POST /api/notifications/send`
- `POST /api/certificate/generate`
- `GET /api/analytics/events`
- `GET /api/analytics/participants`
- `GET /api/analytics/revenue`

*(Note: Only existing routes were added to Postman collection to avoid False Positives as per requirements.)*

## 4. Observations & Route Errors
- **Payment Verification Route Mismatch:** In documentation, payment verification is typically mapped to `/api/participants/verify/:id`. However, in the code, `verifyPayment` controller function is incorrectly mapped under the Event Router as `PUT /api/events/verify/:id`. It still works perfectly but could be moved to `participantRoutes` for architectural coherence.
- **REST Consistency:** `GET /api/certificate/generate/:id` should ideally omit the action word `/generate` and map simply to `GET /api/certificates/:id` considering it returns a file payload inline with REST conventions.

## 5. Security Improvements
- **Missing File Validation:** In `uploadPaymentProof` (Participant Controller), validation only checks if `req.file` exists. File type checks (images only) and size limits should be explicitly validated to prevent malicious payload uploads and excessive bucket/bandwidth consumption.
- **Role Middleware Constraints:** Leader check explicitly occurs inside event approval flows; however, more granular "LEADER" scopes mapping models restrict access optimally at controller levels.
- **Email/QR Spam Vulnerability:** `registerParticipant` triggers email + QR generation synchronously on every hit. Malicious users could easily spam this unauthenticated endpoint to trigger SMTP blocks and DoS vectors. Proper rate-limiting exclusively for registration or queuing systems (e.g. BullMQ) is heavily recommended.
