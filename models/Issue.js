const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    votedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // One-to-many: one user can have many issues
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /* upvotes: [{
      type:Schema.Types.ObjectId,
      ref: "User"
    }] 
   downvotes: [{ 
    type: Schema.Types.ObjectId,
    ref: 'User'
   }] */
  },
  { timestamps: true },
);

module.exports = mongoose.model("Issue", issueSchema);
