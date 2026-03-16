import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function IssueForm({ onIssueCreated }) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      onIssueCreated();
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="section-title">Report an Issue 🌿</h2>

      <div className="field">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button className="btn" type="submit">Submit</button>
    </form>
  );
}

export default IssueForm;
