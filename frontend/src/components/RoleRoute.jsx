import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles is provided, check if user's role is in the allowed roles
  if (roles && roles.length > 0) {
    if (!roles.includes(user.role)) {
      // Redirect to dashboard with error message
      return <Navigate to="/dashboard" replace state={{ error: `This feature is only available for ${roles.join(' and ')} users` }} />;
    }
  }

  return children;
};

export default RoleRoute;
