// components/common/ShopSkeleton.jsx
export default function ShopSkeleton({ count = 3 }) {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div 
            key={i}
            className="animate-pulse bg-gray-100 rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-gray-300 rounded-full mr-4" />
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-1/3" />
          </div>
        ))}
      </>
    );
  }