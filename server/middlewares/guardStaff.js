const { Lodging } = require("../models");

module.exports = async function guardStaff(req, res, next) {
   try {
      if (req.user.role === "Admin") {
         return next();
      }

      const { id } = req.params;
      const data = await Lodging.findByPk(id);

      if (!data) {
         return res.status(404).json({ message: "Lodging not found" });
      }

      if (data.AuthorId === req.user.id) {
         return next();
      }

      return res.status(403).json({ message: "Forbidden" });
   } catch (error) {
      next(error);
   }
};