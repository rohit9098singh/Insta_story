import Stories from "../components/custom/Stories";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile-first Instagram-like layout */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-orange-700">Instagram Stories</h1>
        </div>
        
        {/* Stories Component */}
        <Stories />
        
        {/* Demo content */}
        <div className="p-4 space-y-4">
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              Mobile Instagram Stories
            </h2>
            <p className="text-sm text-gray-900 mb-4">
              Tap any story above to view it in full screen!
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-orange-700 mb-2 text-2xl">Features:</h3>
              <ul className="text-xs text-gray-900 space-y-1">
                <li>• Horizontal scrollable story list</li>
                <li>• Full-screen story viewer</li>
                <li>• Auto-progression (5 seconds)</li>
                <li>• Tap left/right navigation</li>
                <li>• Progress indicators</li>
                <li>• Loading states</li>
                <li>• Viewed story tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
