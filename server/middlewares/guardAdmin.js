function guardAdmin(req, res, next) {
  if (req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden Access" });
  }
}


module.exports = guardAdmin