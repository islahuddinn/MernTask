const express = require("express");
const userRoutes = require("./userRoute");
const noteRoutes = require("./noteRoute");

const setupRoutesV1 = () => {
  const router = express.Router();
  router.use("/users/user", userRoutes);
  router.use("/notes", noteRoutes);

  return router;
};
module.exports = setupRoutesV1;
