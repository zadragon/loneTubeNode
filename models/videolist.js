'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VideoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VideoList.init({
    UserId: DataTypes.STRING,
    MovieId: DataTypes.STRING,
    Title: DataTypes.STRING,
    Like: DataTypes.INTEGER,
    View: DataTypes.INTEGER,
    URL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VideoList',
  });
  return VideoList;
};