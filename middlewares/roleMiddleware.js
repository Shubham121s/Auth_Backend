
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    
    

    // Case-insensitive role check
    const userRole = req.user.role.toLowerCase();
    const allowed = roles.map(r => r.toLowerCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};





