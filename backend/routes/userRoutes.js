const express = require("express");
const router = express.Router();
const { getLeadersByDepartment, updateUser, deleteUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/leaders", protect, authorizeRoles("HOD", "ADMIN"), getLeadersByDepartment);
router.put("/:id", protect, authorizeRoles("HOD", "ADMIN"), updateUser);
router.delete("/:id", protect, authorizeRoles("HOD", "ADMIN"), deleteUser);

module.exports = router;
