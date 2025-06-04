import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSyncHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'logout') {
        // Khi tab khác gọi logout
        navigate('/login');
      }

      if (event.key === 'token' && event.newValue) {
        // Khi tab khác login thành công
        const role = localStorage.getItem('roleName');
        const userId = localStorage.getItem('userId');

        if (role === 'ROLE_HR') {
          navigate('/attendances');
        } else {
          navigate(`/attendances/user/${userId}`);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  return null; // Không render gì
};

export default AuthSyncHandler;
