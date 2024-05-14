const User = require("../models/User");

exports.findAll = () => User.findAll();
exports.create = () => User.create(userData);
exports.findById = () => User.findById(id);
exports.update = (id, updateData) =>
  User.findByIdAndUpdate(id, updateData, { new: true });
exports.delete = (id) => User.findByIdAndDelete(id);
