const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toUpperCase();
    const authorizedRoles = roles.map(r => r.toUpperCase());
    
    if (!authorizedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

module.exports = authorizeRoles;
