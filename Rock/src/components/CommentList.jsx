import { useAuth } from "../context/AuthContext";

function CommentList({ comments, setComments }) {
  const { token, user } = useAuth();

  async function handleDelete(commentId) {
    await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  }

  async function handleEdit(commentId, newText) {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newText }),
    });
    const updated = await res.json();
    setComments((prev) => prev.map((c) => (c._id === commentId ? updated : c)));
  }

  if (comments.length === 0) return <p>No comments yet. Be the first!</p>;

  return (
    <ul className="issue-list">
      {comments.map((comment) => (
        <li key={comment._id} className="issue-card">
          <p>{comment.text}</p>
          <p className="issue-author">🌿 {comment.userId?.username}</p>

          {comment.userId?._id === user?.id && (
            <div>
              <button
                className="btn btn-sm"
                onClick={() => {
                  const newText = prompt("Edit comment:", comment.text);
                  if (newText) handleEdit(comment._id, newText);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm"
                onClick={() => handleDelete(comment._id)}
              >
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
