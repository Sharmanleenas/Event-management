# API Security Debug Report: 403 Access Denied on `markEventCompleted`

## 1. Root Cause Analysis
The 403 Forbidden Access Denied for `ADMIN` users on the `PUT /api/events/complete/:id` route was caused by restrictive hardcoded middleware inside `routes/eventRoutes.js`.

The route was defined as:
```javascript
router.put("/complete/:id", protect, authorizeRoles("HOD"), markEventCompleted);
```
The `authorizeRoles("HOD")` dynamically intercepted all incoming requests successfully authenticated by the `protect` layer but bounced any user who did not possess the specific string role of `"HOD"`. Thus, even users with an overarching `"ADMIN"` authorization token payload were immediately denied.

*Note: In our previous session, `authMiddleware.js` and `authController.js` were thoroughly tested, fixed, and verified to be properly attaching `role` to `req.user`, so the JWT pipeline is securely intact!*

## 2. Corrected Backend Code
I have implemented a permanent fix that shifts the granular context-aware authorization directly into the controller, resolving the issue without creating secondary security holes.

### `routes/eventRoutes.js`
Removed the inflexible `authorizeRoles("HOD")` interceptor and trusted the core router to pass token-verified candidates straight to the `markEventCompleted` methodology.
```javascript
// BEFORE:
// router.put("/complete/:id", protect, authorizeRoles("HOD"), markEventCompleted);

// AFTER:
router.put("/complete/:id", protect, markEventCompleted);
```

### `controllers/eventController.js`
Inserted rigorous role-checking syntax that grants equivalent top-level fulfillment permissions to both internal administrators ("ADMIN") and department heads ("HOD"):
```javascript
exports.markEventCompleted = async (req, res) => {
  try {
    console.log(req.user); // Debug token capture validation
    
    // Explicit Role Authorization
    if (req.user.role !== "ADMIN" && req.user.role !== "HOD") {
       return res.status(403).json({ message: "Access Denied" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.status = "COMPLETED";
    await event.save();
    res.json({ message: "Event marked as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

## 3. Postman API Testing Instructions
You can easily confirm this fix works via your Postman workspace right now:

1. **Obtain Secure Context**: 
   - Execute the `Login Admin` API to acquire your JWT token. Postman sets this dynamically in your `{{admin_token}}` environment variable.
2. **Retrieve Active Event**:
   - Run the `Get Pending Events` or `Get Approved Events` API. Note down a valid MongoDB `$oid` into the Postman `{{event_id}}` variable.
3. **Execute Event Completion API**:
   - Switch to the `Mark Event Completed` API endpoint (`PUT /api/events/complete/{{event_id}}`)
   - Go to the **Authorization Tab**, confirm the dropdown is set to `Bearer Token`, and ensure `{{admin_token}}` corresponds correctly.
4. **Trigger Output**: 
   - Hit **Send**. You should now securely intercept a `200 OK` status array containing:
     ```json
     {
         "message": "Event marked as completed"
     }
     ```
   - Looking closely at your local terminal, you should also visually verify the system's runtime debug logging to explicitly reflect `role: "ADMIN"`.
