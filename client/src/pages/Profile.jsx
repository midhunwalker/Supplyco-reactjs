import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
        <p className="text-center text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Profile</h1>

      {/* Regular User Profile */}
      {user.rationCardId && (
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="mb-2">
            <strong>Ration Card ID:</strong> {user.rationCardId || 'N/A'}
          </p>
          {/* Add more user details here */}
        </div>
      )}

      {/* Shop Owner Profile */}
      {user.licenseId && (
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="mb-2">
            <strong>License ID:</strong> {user.licenseId || 'N/A'}
          </p>
          <p className="mb-2">
            <strong>Shop Name:</strong> {user.shopName || 'N/A'}
          </p>
          {/* Add more shop details here */}
        </div>
      )}
    </div>
  );
};

export default Profile;
