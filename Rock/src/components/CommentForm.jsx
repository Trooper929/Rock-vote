import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function CommentForm({ issueId, onCommentAdded }) {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, issueId }),
      });
      const newComment = await res.json();
      onCommentAdded(newComment);
      setText("");
    } catch (err) {
      setError("Failed to post comment");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a Comment</h3>
      {error && <p className="error-message">{error}</p>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
      />
      <button className="btn" type="submit">
        Post Comment
      </button>
    </form>
  );
}

export default CommentForm;
