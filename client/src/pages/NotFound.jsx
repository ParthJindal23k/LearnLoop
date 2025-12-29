import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-gray-900">404</h1>

        <p className="mt-4 text-xl font-semibold text-gray-800">
          Page not found
        </p>

        <p className="mt-2 text-gray-500">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <ArrowLeft size={18} />
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
