import { BuildingStorefrontIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">About SupplyCo</h1>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <BuildingStorefrontIcon className="h-12 w-12 text-blue-600 mb-6" />
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To connect communities with reliable suppliers and streamline essential goods distribution 
            through transparent, efficient digital solutions.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <ChartBarIcon className="h-12 w-12 text-blue-600 mb-6" />
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <p className="text-gray-600">• Verified supplier network</p>
            <p className="text-gray-600">• Real-time inventory tracking</p>
            <p className="text-gray-600">• Secure transaction system</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-xl">
        <UserGroupIcon className="h-12 w-12 text-blue-600 mb-6 mx-auto" />
        <h2 className="text-3xl font-semibold text-center mb-8">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg text-center">
              <div className="h-40 w-40 bg-gray-200 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Team Member</h3>
              <p className="text-gray-600">Position/Role</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;