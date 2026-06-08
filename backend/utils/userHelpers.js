import User from "../models/User.js";

export const getPrincipal = async () =>
  User.findOne({ role: "Principal" });

export const getAccountsUsers = async () =>
  User.find({ role: "Accounts" });

export const getStoresUsers = async () =>
  User.find({ role: "Stores" });