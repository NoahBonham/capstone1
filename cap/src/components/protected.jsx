import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
