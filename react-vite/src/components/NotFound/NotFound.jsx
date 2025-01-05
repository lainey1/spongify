import { Link } from 'react-router-dom';
import './notfound.css'; 

function NotFound() {
  return (
    <div className="not-found-container">
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="home-link">Go back to the home page</Link>
    </div>
  );
}

export default NotFound;