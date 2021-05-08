import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';

//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== 'undefined';

const ProtectedRoute = ({ router, children }) => {
  let unprotectedRoutes = ['/', '/register', '/phising', '/leaked_data'];

  const isAuthenticated = useSelector(selectIsAuthenticated);

  /**
   * @var pathIsProtected Checks if path exists in the unprotectedRoutes routes array
   */
  let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;

  if (isBrowser() && !isAuthenticated && pathIsProtected) {
    router.push('/');
  }

  return children;
};
export default ProtectedRoute;
