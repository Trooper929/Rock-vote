const express = require("express");
const Issue = require("../models/Issue");
const Comment = require("../models/Comment");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// All issue routes are protected — requireAuth runs first on every route below
router.use(requireAuth);

// GET /api/issues/mine — get issues created by the logged-in user
router.get("/mine", async (req, res, next) => {
  try {
    const issues = await Issue.find({ author: req.auth.id });
    res.json(issues);
  } catch (err) {
    next(err);
  }
});

// GET /api/issues — get all issues with comment counts
router.get("/", async (req, res, next) => {
  try {
    const issues = await Issue.find().populate("author", "username").lean();

    // One query to get comment counts for all issues
    const counts = await Comment.aggregate([
      { $group: { _id: "$issueId", count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach((c) => (countMap[c._id.toString()] = c.count));

    const issuesWithCounts = issues.map((issue) => ({
      ...issue,
      commentCount: countMap[issue._id.toString()] || 0,
    }));

    res.json(issuesWithCounts);
  } catch (err) {
    next(err);
  }
});

// GET /api/issues/:id — get a single issue
router.get("/:id", async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("author", "username");
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

// POST /api/issues — add a new issue
router.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const issue = await Issue.create({
      title,
      description,
      author: req.auth.id,
    });
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
});

// PUT /api/issues/:id — upvote or downvote an issue (one vote per user)
router.put("/:id", async (req, res, next) => {
  try {
    const existing = await Issue.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Issue not found" });

    if (existing.votedBy.includes(req.auth.id)) {
      return res.status(400).json({ message: "You have already voted on this issue" });
    }

    const increment = req.body.direction === "down" ? -1 : 1;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: increment }, $addToSet: { votedBy: req.auth.id } },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/issues/:id — delete an issue
router.delete("/:id", async (req, res, next) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json({ message: "Issue deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
