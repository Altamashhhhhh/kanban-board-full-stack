function roleAuth(allowedRoles) {
  return (req, res, next) => {
    const role = req.user.role;
    if (allowedRoles.includes(role)) {
      next();
    } else {
      return res.status(403).send({ message: "Access denied" });
    }
  };
}

module.exports = roleAuth ; 