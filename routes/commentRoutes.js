const express = require("express");
const Comment = require("../models/Comment");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// All comment routes are protected
router.use(requireAuth);

// POST /api/comments — create a new comment
router.post("/", async (req, res, next) => {
  try {
    const { text, issueId } = req.body;
    const comment = await Comment.create({
      text,
      issueId,
      userId: req.auth.id,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

// GET /api/comments/:issueId — get all comments for an issue
router.get("/:issueId", async (req, res, next) => {
  try {
    const comments = await Comment.find({
      issueId: req.params.issueId,
    }).populate("userId", "username");
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// PUT /api/comments/:id — edit a comment (owner only)
router.put("/:id", async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.auth.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/comments/:id — delete a comment (owner only)
router.delete("/:id", async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.auth.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
