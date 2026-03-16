import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

function IssuePage() {
  const { id } = useParams(); // the issue id from the URL e.g. /issues/:id
  const { token } = useAuth();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/issues/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load issue");
        return res.json();
      })
      .then((data) => setIssue(data))
      .catch((err) => setError(err.message));

    fetch(`/api/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [id]);

  function handleCommentAdded(newComment) {
    setComments((prev) => [...prev, newComment]);
  }

  if (error) return <p style={{ color: "#e07a5a", padding: "1rem" }}>{error}</p>;
  if (!issue) return <p style={{ padding: "1rem" }}>Loading...</p>;

  return (
    <div className="card">
      <h2 className="section-title">{issue.title}</h2>
      <p>{issue.description}</p>
      <p className="issue-votes">🗳️ {issue.votes} votes</p>

      <p className="issue-votes">💬 {comments.length} comments</p>
      <CommentList comments={comments} setComments={setComments} />
      <CommentForm issueId={id} onCommentAdded={handleCommentAdded} />
    </div>
  );
}

export default IssuePage;
