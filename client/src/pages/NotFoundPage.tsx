import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
}
