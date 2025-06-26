const { Type, Lodging, User } = require("../models/index");
const { Op } = require("sequelize");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
class Controller {
  static async postAddLodging(req, res, next) {
    try {
      const { name, facility, roomCapacity, imgUrl, location, price, TypeId } =
        req.body;
      const data = await Lodging.create({
        name,
        facility,
        roomCapacity,
        imgUrl,
        location,
        price,
        TypeId,
        AuthorId: req.user.id,
      });
      res.status(201).json({
        message: `Lodging ${data.name} added successfully`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLodging(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: data } = await Lodging.findAndCountAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        limit,
        offset,
        order: [["id", "ASC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicLodging(req, res, next) {
    try {
      const { page = 1, search, sort = "DESC", type, location } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      const paramQuerySQL = {
        limit,
        offset,
        where: {},
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: Type,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", sort]],
      };

      // Add search by name
      if (search) {
        paramQuerySQL.where.name = {
          [Op.iLike]: `%${search}%`,
        };
      }

      // Add filter by location
      if (location) {
        paramQuerySQL.where.location = {
          [Op.iLike]: `%${location}%`,
        };
      }

      // Add filter by type
      if (type) {
        paramQuerySQL.where.TypeId = parseInt(type);
      }

      const { count, rows: data } = await Lodging.findAndCountAll(
        paramQuerySQL
      );
      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        data,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicTypes(req, res, next) {
    try {
      const types = await Type.findAll({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
      });

      res.status(200).json({
        data: types,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicLodgingById(req, res, next) {
    try {
      const data = await Lodging.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      });

      if (!data) {
        return res.status(404).json({ message: "Lodging not found" });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
  static async lodgingById(req, res, next) {
    try {
      const data = await Lodging.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      if (!data) {
        throw res.status(404).json({ message: "Lodging not found" });
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async editLodging(req, res, next) {
    try {
      const { id } = req.params;
      const lodging = await Lodging.findByPk(id);

      if (!lodging) {
        return res.status(404).json({ message: "Lodging not found" });
      }

      await Lodging.update(req.body, {
        where: { id },
      });

      const data = await Lodging.findByPk(id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
        ],
      });

      res.status(201).json({
        message: `Lodging ${lodging.name} has been updated`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLodging(req, res, next) {
    try {
      const { id } = req.params;
      const lodging = await Lodging.findByPk(id);

      if (!lodging) {
        return res.status(422).json({ message: "Lodging not found" });
      }

      await Lodging.destroy({
        where: { id },
      });

      res
        .status(200)
        .json({ message: `Lodging with ${lodging.name} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }

  static async postAddTypes(req, res, next) {
    try {
      const data = await Type.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getTypes(req, res, next) {
    try {
      const data = await Type.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async editTypes(req, res, next) {
    try {
      const { id } = req.params;
      const type = await Type.findByPk(id);

      if (!type) {
        throw res.status(404).json({ message: "Type not found" });
      }

      await Type.update(req.body, {
        where: { id },
      });

      await Type.findByPk(id, {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
      res.status(200).json({ message: `type ${type.name} has been edited` });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTypes(req, res, next) {
    try {
      const { id } = req.params;
      const type = await Type.findByPk(id);
      const deleted = await Type.destroy({
        where: { id },
      });

      if (!deleted) {
        throw res.status(404).json({ message: "Type not found" });
      }

      res
        .status(200)
        .json({ message: `Type with ${type.name} has been deleted` });
    } catch (error) {
      next(error);
    }
  }

  static async cloudinary(req, res, next) {
    try {
      const base64File = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64File}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "MamiKos",
        public_id: req.file.originalname,
      });
      const lodging = await Lodging.findByPk(req.params.id);
      if (!lodging) {
        throw { name: "NotFound", message: "Lodging Not Found" };
      }

      await lodging.update({ imgUrl: uploadResult.secure_url });
      res.json({
        message: "Cover url has been updated",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
