import { DocumentTextIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Terms = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Terms of Service</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-3xl mx-auto">
        <div className="mb-8">
          <DocumentTextIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-center mb-6">
            Last Updated: January 1, 2024
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-4 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
              <p className="text-gray-600">
                Users must provide accurate information and comply with all applicable laws 
                while using our platform.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <UserCircleIcon className="h-6 w-6 text-blue-600 mr-4 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Account Security</h2>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account 
                credentials and all activities under your account.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-4 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Content Guidelines</h2>
              <p className="text-gray-600">
                Users agree not to post any unlawful, abusive, or harmful content. 
                We reserve the right to remove inappropriate content.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-600">
            <p>By using our services, you agree to these terms and conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;