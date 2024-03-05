const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const noteController = require("../Controllers/noteController");
const router = express.Router();

router.use(authController.protect);

router.post("/note", noteController.createNote);

router.get("/all", noteController.getallNote);
router
  .route("/note/:id")
  .get(noteController.getOneNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;
