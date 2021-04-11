import { useAuth } from 'features/auth/authHook';

const DashboardPage = () => {
  const { logout } = useAuth();
  return (
    <div>
      <h1>Dashboard Page</h1>
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default DashboardPage;
