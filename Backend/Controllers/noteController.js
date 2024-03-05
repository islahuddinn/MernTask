const catchAsync = require("../Utils/catchAsync");
const Note = require("../Models/noteModel");
const User = require("../Models/userModel");
const factory = require("./handleFactory");

exports.createNote = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
    });

    const createdNote = await newNote.save();

    res.status(201).json({
      status: 201,
      success: true,
      note: createdNote,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/////// Update notes

exports.updateNote = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  const noteId = req.params.id;

  try {
    const noteToUpdate = await Note.findById(noteId);

    if (!noteToUpdate) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "note not found",
      });
    }
    noteToUpdate.title = title;
    noteToUpdate.content = content;

    const updatednote = await noteToUpdate.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "note updated successfully",
      data: updatednote,
    });
  } catch (error) {
    next(error);
  }
});

////// Delete note By Id
exports.deleteNote = catchAsync(async (req, res, next) => {
  const noteId = req.params.id;
  console.log(noteId);
  try {
    const noteToDelete = await Note.findById(noteId);
    console.log(noteToDelete);
    if (!noteToDelete) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "note not found...",
      });
    }

    await noteToDelete.deleteOne();

    res.status(204).json({
      success: true,
      status: 204,
      message: "note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

exports.getallNote = factory.getAll(Note);
exports.getOneNote = factory.getOne(Note);
