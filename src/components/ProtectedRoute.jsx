import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuthenticated, isAdmin } from '../utils/auth.js';

/**
 * Route guard component that protects routes based on authentication and role.
 *
 * @param {object} props
 * @param {boolean} [props.adminOnly=false] - If true, only admin users can access the route
 * @param {React.ReactNode} [props.children] - Optional children to render instead of Outlet
 * @returns {JSX.Element} The protected content, or a redirect
 */
function ProtectedRoute({ adminOnly = false, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/blogs" replace />;
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  adminOnly: PropTypes.bool,
  children: PropTypes.node,
};

ProtectedRoute.defaultProps = {
  adminOnly: false,
  children: undefined,
};

export default ProtectedRoute;