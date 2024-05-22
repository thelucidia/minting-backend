const User = require("../models/User");

exports.findAll = () => User.findAll();
exports.create = (userData) => User.create(userData);
exports.findById = (id) => User.findById(id);
exports.update = (id, updateData) =>
  User.findByIdAndUpdate(id, updateData, { new: true });
exports.delete = (id) => User.findByIdAndDelete(id);
