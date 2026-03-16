import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import IssueList from "./components/IssueList";
import IssuePage from "./pages/IssuePage";
import ProfilePage from "./pages/ProfilePage";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const { token, user, logout } = useAuth();

  return (
    <div>
      <div className="app-header">
        <h1 className="app-title">🌳 Hire Brandon National Park</h1>
        <p className="app-subtitle">
          Report and vote on issues in your community park
        </p>
        <div className="tree-row">🌲🌿🌲🌿🌲</div>
      </div>

      {token && (
        <div className="top-bar">
          <span className="welcome-text">Welcome, {user?.username}</span>
          <Link className="btn btn-ghost btn-sm" to="/">Home</Link>
          <Link className="btn btn-ghost btn-sm" to="/profile">My Profile</Link>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Log Out
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" replace /> : <SignupPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <IssueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  return (
    <div className="auth-page">
      <LoginForm onLogin={login} />
      <Link className="btn btn-ghost btn-sm" to="/signup">Create an account</Link>
    </div>
  );
}

function SignupPage() {
  const { login } = useAuth();
  return (
    <div className="auth-page">
      <SignupForm onLogin={login} />
      <Link className="btn btn-ghost btn-sm" to="/login">Back to Login</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
