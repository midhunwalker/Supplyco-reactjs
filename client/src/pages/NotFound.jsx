import { NavLink } from 'react-router-dom';
import { FaceFrownIcon, HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <FaceFrownIcon className="h-32 w-32 text-gray-400 mx-auto mb-8" />
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <NavLink
          to="/"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Return Home
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;