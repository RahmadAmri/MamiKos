"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lodging extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lodging.belongsTo(models.Type, {
        foreignKey: "TypeId",
      }),
        Lodging.belongsTo(models.User, {
          foreignKey: "AuthorId",
        });
    }
  }
  Lodging.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      facility: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Facility is required",
          },
          notEmpty: {
            msg: "Facility is required",
          },
        },
      },
      roomCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Room Capacity is required",
          },
          notEmpty: {
            msg: "Room Capacity is required",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ImageUrl is required",
          },
          notEmpty: {
            msg: "ImageUrl is required",
          },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Location is required",
          },
          notEmpty: {
            msg: "Location is required",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price is required",
          },
          notEmpty: {
            msg: "Price is required",
          },
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      TypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "TypeId is required",
          },
          notEmpty: {
            msg: "TypeId is required",
          },
        },
      },
      AuthorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "AuthorId is required",
          },
          notEmpty: {
            msg: "AuthorId is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Lodging",
    }
  );
  return Lodging;
};
