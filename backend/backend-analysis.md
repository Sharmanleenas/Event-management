# Centralized Event Management System - Backend Analysis

## 1. Project Overview
The Centralized Event Management System is a comprehensive Node.js and Express backend designed to handle event creation, participant registration, payment verification, and automated workflows. It leverages MongoDB for data storage, JWT for secure authentication, Cloudinary for payment proof uploads, Nodemailer for automated email dispatch (including inline QR codes), and the Google Gemini API for intelligent SES (Summary & Evaulation) event reporting. The system uses a strict Role-Based Access Control (RBAC) architecture to segregate capabilities among Admins, HODs, Leaders, and individual Participants.

## 2. Complete Folder Structure
```text
backend/
├── config/
│   ├── cloudinary.js         # Cloudinary SDK configuration
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── analyticsController.js   # Analytics and reporting logic
│   ├── authController.js        # Login and registration logic
│   ├── certificateController.js # PDF certificate generation logic
│   ├── eventController.js       # Event CRUD and approvals
│   ├── notificationController.js# User notifications logic
│   ├── participantController.js # Registration, QR gen, email, proofs
│   └── sesController.js         # Gemini AI report generation
├── middleware/
│   ├── authMiddleware.js     # JWT verification middleware
│   ├── errorMiddleware.js    # Global error handler
│   ├── roleMiddleware.js     # RBAC role verification
│   └── uploadMiddleware.js   # Multer local storage setup
├── models/
│   ├── Event.js              # Event database schema
│   ├── Notification.js       # Notification database schema
│   ├── Participant.js        # Participant database schema
│   └── User.js               # User (Admin/HOD/Leader) schema
├── routes/
│   ├── analyticsRoutes.js
│   ├── authRoutes.js
│   ├── certificateRoutes.js
│   ├── eventRoutes.js
│   ├── notificationRoutes.js
│   ├── participantRoutes.js
│   └── sesRoutes.js
├── utils/
│   ├── generateParticipantId.js # Auto-incrementing ID generator
│   └── sendEmail.js             # Nodemailer email transporter
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
└── server.js                 # Express application entry point
```

## 3. Backend Architecture Explanation
The application follows a standard **MVC (Model-View-Controller)** pattern, specifically tailored for an API-first approach (Model-Route-Controller):
- **Server Initialization (`server.js`)**: Connects to the database, applies global middleware (CORS, Morgan logger, Rate Limiting), and registers route prefixes (e.g., `/api/auth`).
- **Routes (`routes/`)**: Defines the HTTP endpoints and attaches necessary middleware (like `protect`, `authorizeRoles`, or `multer` upload handlers) before passing the request to a controller.
- **Controllers (`controllers/`)**: Contains the core business logic. They process incoming `req` parameters/body, interact with the models, communicate with external SDKs (Cloudinary/Gemini), and format the JSON `res` payload.
- **Models (`models/`)**: Mongoose schemas defining the structure, relationships (`ref`), and data types in the MongoDB database.
- **Middleware (`middleware/`)**: Functions that intercept requests. Handles token decoding, role gating, file parsing, and error catching.
- **Utilities (`utils/`)**: Reusable helper functions abstracted away from controllers, such as dynamic ID generation and email dispatch logic.

## 4. Authentication & Authorization Flow
- **Registration**: Users (Admin, HOD, Leader) register via `/api/auth/register`. Their plaintext password is mathematically hashed using `bcryptjs` before being saved to MongoDB.
- **Login**: Users authenticate with email/password. The system compares hashes. On success, it generates a securely signed `JWT (JSON Web Token)` containing their `id` and `role`.
- **Token Handling**: The client must send this JWT in the `Authorization: Bearer <token>` header for protected routes.
- **Access Control**: 
  - `authMiddleware.js` (`protect`) intercepts the request, decodes the JWT, and attaches the `User` document to `req.user`.
  - `roleMiddleware.js` (`authorizeRoles`) checks `req.user.role` against an allowed array of roles. If unauthorized, it instantly rejects with a `403 Access Denied`.

## 5. Database Schema Documentation

### User Schema (`users`)
- **name**: `String`
- **email**: `String` (Unique)
- **password**: `String` (Hashed)
- **role**: `String` (Enum: `ADMIN`, `HOD`, `LEADER`)
- **department**: `String`
- **timestamps**: `createdAt`, `updatedAt`

### Event Schema (`events`)
- **title**: `String`
- **description**: `String`
- **department**: `String`
- **createdBy**: `ObjectId` (ref: `User`)
- **upiId**: `String`
- **amount**: `Number`
- **participantIdPrefix**: `String`
- **status**: `String` (Enum: `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED`, Default: `PENDING`)
- **timestamps**: `createdAt`, `updatedAt`

### Participant Schema (`participants`)
- **participantId**: `String` (Auto-generated prefix + counter)
- **name**: `String`
- **email**: `String`
- **phone**: `String`
- **eventId**: `ObjectId` (ref: `Event`)
- **paymentScreenshot**: `String` (Cloudinary URL)
- **paymentStatus**: `String` (Enum: `PENDING`, `APPROVED`, `REJECTED`, Default: `PENDING`)
- **verifiedBy**: `ObjectId` (ref: `User`)
- **timestamps**: `createdAt`, `updatedAt`

### Notification Schema (`notifications`)
- **userId**: `ObjectId` (ref: `User`)
- **title**: `String`
- **message**: `String`
- **read**: `Boolean` (Default: `false`)
- **timestamps**: `createdAt`, `updatedAt`


## 6. Module-wise API Endpoints

| Module | Purpose |
|--------|---------|
| **Auth** | Login and user creation |
| **Events** | Event requests, approvals, and listing |
| **Participants** | Registration, proof uploads, and payment verification |
| **Analytics** | Dashboard statistics and revenue |
| **Notifications** | Reading and marking system alerts |
| **Certificates** | PDF generation for verified participants |
| **SES Reports** | AI-driven evaluation reports for completed events |

## 7. Detailed API Documentation

### Auth Module
**1. Register User**
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Controller:** `register`
- **Desc:** Registers a new backend user (staff).
- **Body:** `{ name, email, password, role, department }`
- **Auth Reqd:** No
- **Response:** `{ _id, token }`
- **Errors:** 500 Server Error

**2. Login User**
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Controller:** `login`
- **Desc:** Authenticates a user and returns a JWT.
- **Body:** `{ email, password }`
- **Auth Reqd:** No
- **Response:** `{ _id, role, token }`
- **Errors:** 401 Invalid credentials

---

### Events Module
**3. Create Event**
- **URL:** `/api/events/create`
- **Method:** `POST`
- **Controller:** `createEvent`
- **Desc:** Submits an event for approval.
- **Body:** `{ title, description, upiId, amount, participantIdPrefix }`
- **Auth Reqd:** Yes
- **Roles:** ADMIN, HOD
- **Response:** Event Object
- **Errors:** 403 Access Denied

**4. Get Pending Events**
- **URL:** `/api/events/pending`
- **Method:** `GET`
- **Controller:** `getPendingEvents`
- **Desc:** Retrieves events awaiting approval.
- **Auth Reqd:** Yes
- **Roles:** ADMIN
- **Response:** Array of Event Objects

**5. Get Approved (Public) Events**
- **URL:** `/api/events/public`
- **Method:** `GET`
- **Controller:** `getApprovedEvents`
- **Desc:** Retrieves live, approved events for public viewing.
- **Auth Reqd:** No
- **Response:** Array of Event Objects

**6. Approve Event**
- **URL:** `/api/events/approve/:id`
- **Method:** `PUT`
- **Controller:** `approveEvent`
- **Desc:** Sets an event status to APPROVED.
- **URL Params:** `id` (Event ID)
- **Auth Reqd:** Yes
- **Roles:** ADMIN
- **Response:** `{ message: "Event Approved" }`
- **Errors:** 404 Event not found

**7. Reject Event**
- **URL:** `/api/events/reject/:id`
- **Method:** `PUT`
- **Controller:** `rejectEvent`
- **Desc:** Sets an event status to REJECTED.
- **URL Params:** `id` (Event ID)
- **Auth Reqd:** Yes
- **Roles:** ADMIN
- **Response:** `{ message: "Event Rejected" }`

**8. Mark Event Completed**
- **URL:** `/api/events/complete/:id`
- **Method:** `PUT`
- **Controller:** `markEventCompleted`
- **Desc:** Closes out an event.
- **URL Params:** `id` (Event ID)
- **Auth Reqd:** Yes
- **Roles:** ADMIN, HOD
- **Response:** `{ message: "Event marked as completed" }`

---

### Participant Module
**9. Register Participant**
- **URL:** `/api/participants/register`
- **Method:** `POST`
- **Controller:** `registerParticipant`
- **Desc:** Registers a user for an event, emails them a generated QR code for payment.
- **Body:** `{ name, email, phone, eventId }`
- **Auth Reqd:** No (Public Form)
- **Response:** `{ message, participantId, _id, qrImage }`
- **Errors:** 404 Event not found, 400 Event not available

**10. Upload Payment Proof**
- **URL:** `/api/participants/upload/:id`
- **Method:** `POST`
- **Controller:** `uploadPaymentProof`
- **Desc:** Parses a `multipart/form-data` image and uploads it to Cloudinary.
- **URL Params:** `id` (Participant ID)
- **Body:** Form Data containing a file.
- **Auth Reqd:** No (Public Form upload step)
- **Response:** `{ message, url }`
- **Errors:** 400 No file uploaded

**11. Verify Payment**
- **URL:** `/api/events/verify/:id` *(Note: Registered inside eventRoutes.js)*
- **Method:** `PUT`
- **Controller:** `verifyPayment`
- **Desc:** Staff approves or rejects a participant's payment proof.
- **URL Params:** `id` (Participant ID)
- **Body:** `{ status }` (e.g., 'APPROVED')
- **Auth Reqd:** Yes
- **Roles:** LEADER, HOD
- **Response:** `{ message: "Payment Verified Successfully" }`
- **Errors:** 400 No payment proof uploaded

---

### Analytics & System Modules
**12. Get Analytics**
- **URL:** `/api/analytics/`
- **Method:** `GET`
- **Controller:** `getAnalytics`
- **Desc:** Returns system-wide statistics (counts and total revenue).
- **Auth Reqd:** Yes
- **Roles:** ADMIN, HOD
- **Response:** `{ totalEvents, totalParticipants, totalRevenue }`

**13. Generate Certificate**
- **URL:** `/api/certificate/generate/:id`
- **Method:** `GET`
- **Controller:** `generateCertificate`
- **Desc:** Downloads a PDF certificate for an approved participant.
- **URL Params:** `id` (Participant ID)
- **Auth Reqd:** Yes *(Wait, note: currently protected by `protect`. Should test if participant needs auth or if handled differently)*
- **Response:** `application/pdf` download stream
- **Errors:** 400 Payment not approved

**14. Get Notifications**
- **URL:** `/api/notifications/`
- **Method:** `GET`
- **Controller:** `getNotifications`
- **Desc:** Returns the logged-in user's notifications.
- **Auth Reqd:** Yes
- **Response:** Array of Notification Objects

**15. Mark Notification Read**
- **URL:** `/api/notifications/read/:id`
- **Method:** `PUT`
- **Controller:** `markAsRead`
- **URL Params:** `id` (Notification ID)
- **Auth Reqd:** Yes
- **Response:** `{ message: "Marked as read" }`

**16. Generate SES Report**
- **URL:** `/api/ses/generate`
- **Method:** `POST`
- **Controller:** `generateSESReport`
- **Desc:** Pings Google Gemini API to generate an event report string.
- **Body:** `{ eventDetails, feedbackSummary }`
- **Auth Reqd:** Yes
- **Roles:** HOD
- **Response:** `{ report: "..." }`


## 8. Role-based Features

- **ADMIN**: 
  - Complete oversight. 
  - Can create events.
  - Sole authority to Approve/Reject pending events created by HODs.
  - Can mark events completed.
  - Views high-level analytics.
- **HOD** (Head of Department): 
  - Creates events.
  - Can mark events completed.
  - Verifies event payments.
  - Solicits Gemini AI for SES Reports.
  - Views analytics.
- **LEADER** (Event Leaders): 
  - Ground-level staff.
  - Cannot create events.
  - Primary role is Verifying Payments uploaded by participants.
- **PARTICIPANT** (Public User):
  - No authentication in the system.
  - Browses Approved events.
  - Fills registration form.
  - Scans received QR code.
  - Uploads payment screenshot via open route parameter mapping.


## 9. Frontend Implementation Plan

### Required Pages
1. **Public Landing Page:** Displays a grid of `GET /api/events/public`.
2. **Registration Form:** A public dynamic form linked to a specific event ID. Triggers `POST /api/participants/register`.
3. **Payment Step Page:** Upon registration success, displays the returned QR code and asks the user to upload their screenshot (`POST /api/participants/upload/:id`). 
4. **Login Portal:** Shared portal for Admin/HOD/Leader (`POST /api/auth/login`).
5. **Dashboard Frame:** Includes Sidebar, Header, and logic to display roles based on localstorage.

### Role-Based Dashboards
- **Admin Dashboard:**
  - Route: `/admin/dashboard`
  - Widgets showing `totalRevenue` and `totalEvents`.
  - Table: Pending Events with `Approve` / `Reject` action buttons.
- **HOD Dashboard:**
  - Route: `/hod/dashboard`
  - Table: Owned Events.
  - Form: Create Event Modal.
  - View: Participant list for payment verification.
  - Tool: SES Report Generator UI (Textareas for details & feedback -> AI Report).
- **Leader Dashboard:**
  - Route: `/leader/dashboard`
  - Table: Assigned Participants indicating `Payment Status: PENDING`.
  - Action: Clicking a row opens a modal displaying the Cloudinary image URL, with `Verify` / `Reject` buttons.

### Workflows
- **Auth Flow:** Store JWT in `localStorage` or `cookies`. Intercept all `axios` requests to append `Authorization: Bearer <token>`.
- **Registration Flow:** Ensure state management handles the transition seamlessly between Form -> Success UI (Email parsing) -> Upload UI.

## 10. API Collection Structure
(To be imported into Postman / Thunder Client)

1. **Auth**
   - `POST /api/auth/register`
   - `POST /api/auth/login`
2. **Events**
   - `GET /api/events/public` (No Auth)
   - `POST /api/events/create` (Auth: Bearer)
   - `GET /api/events/pending` (Auth: Bearer)
   - `PUT /api/events/approve/:id` (Auth: Bearer)
   - `PUT /api/events/reject/:id` (Auth: Bearer)
   - `PUT /api/events/complete/:id` (Auth: Bearer)
3. **Participants**
   - `POST /api/participants/register`
   - `POST /api/participants/upload/:id`
   - `PUT /api/events/verify/:id` (Auth: Bearer)
4. **Operations**
   - `GET /api/analytics` (Auth: Bearer)
   - `GET /api/certificate/generate/:id` (Auth: Bearer)
   - `POST /api/ses/generate` (Auth: Bearer)
5. **Notifications**
   - `GET /api/notifications` (Auth: Bearer)
   - `PUT /api/notifications/read/:id` (Auth: Bearer)

## 11. Notes for Frontend Developers
- **File Uploads**: When implementing the payment screenshot upload, you must send the request as `multipart/form-data`, **not** `application/json`. You can name the file key anything (e.g., `file`, `screenshot`, `payment`) as the backend uses `upload.any()` to safely extract the first file array element.
- **Cloudinary Links**: The participant model stores absolute URLs (e.g., `https://res.cloudinary.com/...`). You can render them directly in `<img>` tags for verification dashboards.
- **Error Handling**: Every backend error responds with a standard `{ message: "..." }` or `{ success: false, message: "..." }`. Ensure your Axios interceptors catch 400, 401, 403, and 404 blockages and surface these messages via a Toast notification.
- **CORS Support**: The backend utilizes the standard `cors` package, so local development requests from `localhost:3000` (React/Next) to `localhost:5000` (Express) will pass smoothly without pre-flight errors. 
- **Certificate Downloads**: The certificate API returns a PDF binary stream. On the frontend, ensure you parse the axios response as a `blob`, generate a blob URL, and programmatically trigger a download anchor tag click.
