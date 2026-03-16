import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { token, user } = useAuth();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetch("/api/issues/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setIssues(data));
  }, []);

  return (
    <div className="card">
      <h2 className="section-title">My Issues</h2>
      {issues.length === 0 && <p>You haven't posted any issues yet.</p>}
      <ul className="issue-list">
        {issues.map((issue) => (
          <li key={issue._id} className="issue-card">
            <Link to={`/issues/${issue._id}`}>
              <p className="issue-title">{issue.title}</p>
            </Link>
            <p className="issue-description">{issue.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfilePage;
