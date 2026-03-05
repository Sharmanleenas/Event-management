# Bug Debug Report: 403 Forbidden in Event Creation API

## 1. Root Cause Explanation
We analyzed the JWT pipeline, `authMiddleware`, and the `eventController`. The issue lied entirely in a flawed boolean logic check inside `createEvent`.

The controller initially evaluated:
```javascript
if (req.user.role !== "HOD" || req.user.role !== "ADMIN") {
  return res.status(403).json({ message: "Only HOD and ADMIN can create events" });
}
```
**Why this triggers 403 for ADMIN:**
Since you are an `ADMIN`, the evaluation becomes:
`"ADMIN" !== "HOD"` -> **TRUE**
`"ADMIN" !== "ADMIN"` -> **FALSE**
`TRUE || FALSE` -> **TRUE**.
The OR (`||`) operator meant that **every possible role**, including ADMIN, would trigger the 403 block because no role can simultaneously be *both* "HOD" and "ADMIN". 

Additionally, the `routes/eventRoutes.js` file used `authorizeRoles("HOD", "LEADER", "ADMIN")` which would erroneously allow "LEADER" past the router layer, before bouncing them out at the controller. The token initialization in `authController.js` also solely signed the `id` without the `role`. 

## 2. Corrected Backend Code
The following files were updated to immediately resolve the issue:

### `controllers/eventController.js`
Fixed the operator from `||` to `&&` and injected a console debug log.
```javascript
    // Role check
    console.log(req.user);
    if (req.user.role !== "HOD" && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only HOD and ADMIN can create events" });
    }
```

### `routes/eventRoutes.js`
Removed the redundant and conflicting `authorizeRoles` overlay to rely precisely on the controller definition.
```javascript
router.post("/create", protect, createEvent);
```

### `controllers/authController.js`
Added the explicit role attachment to JWT payload.
```javascript
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
```
*Note: Both `register` and `login` now execute `generateToken(user._id, user.role)`.*

### `middleware/authMiddleware.js`
Overhauled explicit structured processing layout for standard extraction.
```javascript
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    // extracts, verifies and attaches req.user properly
  }
```

## 3. Postman API Test Instructions

To verify the event creation correctly triggers:

1. **Login API (POST `/api/auth/login`)**
   - Body: `{"email": "admin@college.edu", "password": "securepassword"}`
   - *If using Postman scripts from our previous session, the variable visually updates.*
   
2. **Copy token**
   - Copy the JWT `token` string obtained from the Login response object.

3. **Use Bearer Token authentication**
   - On your `Create Event` Request tab, go to **Authorization** > Type: **Bearer Token** > paste your token.

4. **Send event creation request with body (POST `/api/events/create`)**
   - Header: `Content-Type: application/json`
   - Body:
   ```json
   {
      "title": "AI Workshop",
      "description": "Hands-on AI session",
      "upiId": "event@upi",
      "amount": 200,
      "participantIdPrefix": "AI"
   }
   ```
   - Hit **Send**. You should now securely receive a **201 Created** status with your populated MongoDB `event` model!

## 4. Debugging Validation
The output of your backend console will securely trace the intercepted user token with `console.log(req.user)` as requested, printing:
```json
{
  "_id": "60a7e8b...",
  "name": "Global Admin",
  "email": "admin@college.edu",
  "role": "ADMIN",
  "department": "Admin Block"
}
```
