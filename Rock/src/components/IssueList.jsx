import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IssueForm from "./IssueForm";

function IssueList() {
  const { token, user } = useAuth();
  const [issues, setIssues] = useState([]);

  function fetchIssues() {
    fetch("/api/issues", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setIssues([...data].sort((a, b) => b.votes - a.votes)));
  }

  useEffect(() => {
    fetchIssues();
  }, []);

  async function handleVote(id, direction) {
    // Optimistic update
    setIssues((prev) =>
      [...prev]
        .map((issue) =>
          issue._id === id
            ? {
                ...issue,
                votes: issue.votes + (direction === "down" ? -1 : 1),
                votedBy: [...issue.votedBy, user.id],
              }
            : issue
        )
        .sort((a, b) => b.votes - a.votes)
    );

    const res = await fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ direction }),
    });

    if (!res.ok) {
      fetchIssues();
    }
  }

  return (
    <div>
      <IssueForm onIssueCreated={fetchIssues} />

      <div className="card">
        <h2 className="section-title">Park Issues 🌲</h2>
        <ul className="issue-list">
          {issues.map((issue) => {
            const hasVoted = issue.votedBy.includes(user.id);
            return (
              <li key={issue._id} className="issue-card">
                <Link to={`/issues/${issue._id}`}>
                  <p className="issue-title">{issue.title}</p>
                </Link>
                <p className="issue-description">{issue.description}</p>
                <div className="issue-meta">
                  <span className="issue-votes">🗳️ {issue.votes} votes</span>
                  <span className="issue-votes">💬 {issue.commentCount} comments</span>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleVote(issue._id, "up")}
                    disabled={hasVoted}
                  >
                    ▲ Upvote
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleVote(issue._id, "down")}
                    disabled={hasVoted}
                  >
                    ▼ Downvote
                  </button>
                  <span className="issue-author">🌿 {issue.author.username}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default IssueList;
