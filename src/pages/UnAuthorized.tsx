import {
  Home,
  Shield,
  Lock,
  AlertCircle,
  User,
  Loader2,
  Package,
} from "lucide-react";
import { role } from "@/constants/role";
import { useLocation } from "react-router";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

const UnAuthorized = () => {
  // Fetch user info from the API
  const { data, isLoading } = useUserInfoQuery(undefined);
  const location = useLocation();

  // Extract user data from the response
  const user = data?.data;
  const userRole = user?.role || "UNAUTHENTICATED";

  // Function to get role display name
  const getRoleDisplayName = (roleValue: string) => {
    switch (roleValue) {
      case role.superAdmin:
        return "Super Admin";
      case role.admin:
        return "Admin";
      case role.receiver:
        return "Receiver";
      case role.sender:
        return "Sender";
      default:
        return "Guest";
    }
  };

  // Function to detect required role based on current path
  const getRequiredRoleForPath = () => {
    const path = location.pathname;

    if (path.includes("/sender/parcel/create")) {
      return role.sender;
    } else if (path.includes("/sender/")) {
      return role.sender;
    } else if (path.includes("/admin/")) {
      return role.admin;
    } else if (path.includes("/receiver/")) {
      return role.receiver;
    } else if (path.includes("/super-admin/")) {
      return role.superAdmin;
    }

    return null;
  };

  // Function to get specific resource name based on path
  const getResourceName = () => {
    const path = location.pathname;

    if (path.includes("/sender/parcel/create")) {
      return "Create Parcel";
    } else if (path.includes("/sender/")) {
      return "Sender Resources";
    } else if (path.includes("/admin/")) {
      return "Admin Panel";
    } else if (path.includes("/receiver/")) {
      return "Receiver Dashboard";
    } else if (path.includes("/super-admin/")) {
      return "Super Admin Console";
    }

    return "this resource";
  };

  // Function to get role-specific message
  const getRoleSpecificMessage = (roleValue: string) => {
    const requiredRole = getRequiredRoleForPath();

    if (requiredRole) {
      return `Your current role (${getRoleDisplayName(
        roleValue
      )}) does not have access to ${getResourceName()}.`;
    }

    switch (roleValue) {
      case role.superAdmin:
        return "Even with Super Admin privileges, some system resources might be restricted.";
      case role.admin:
        return "Super Admin privileges are required to access this resource.";
      case role.receiver:
        return "You need Admin or Super Admin privileges to access this resource.";
      case role.sender:
        return "You need Admin or Super Admin privileges to access this resource.";
      default:
        return "You need to be signed in with appropriate privileges to view this content.";
    }
  };

  // Function to get required access level
  const getRequiredAccessLevel = (roleValue: string) => {
    const requiredRole = getRequiredRoleForPath();

    if (requiredRole) {
      return getRoleDisplayName(requiredRole);
    }

    switch (roleValue) {
      case role.superAdmin:
        return "System Owner";
      case role.admin:
        return "Super Admin";
      case role.receiver:
        return "Admin or Super Admin";
      case role.sender:
        return "Admin or Super Admin";
      default:
        return "Authenticated User with appropriate role";
    }
  };

  // Check if current path requires a specific role
  const requiredRole = getRequiredRoleForPath();
  const hasRequiredRole = requiredRole ? userRole === requiredRole : false;
  const resourceName = getResourceName();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking your access permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Animated Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="px-8 py-10">
            {/* Icon with animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-ping-slow absolute h-24 w-24 rounded-full bg-purple-200 opacity-75"></div>
                </div>
                <div className="relative animate-float">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-full shadow-lg">
                    <Lock className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 animate-slide-in">
              Access Denied
            </h1>

            {/* Resource-specific message */}
            {requiredRole && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 animate-slide-in-delay-1">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Trying to access:{" "}
                    <span className="font-bold">{resourceName}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Role-based message */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 animate-slide-in-delay-1">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Current role:{" "}
                  <span className="font-bold">
                    {getRoleDisplayName(userRole)}
                  </span>
                </span>
              </div>
            </div>

            {/* Specific role requirement message */}
            {requiredRole && !hasRequiredRole && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4 animate-slide-in-delay-1">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-sm font-medium text-amber-800">
                    Required role:{" "}
                    <span className="font-bold">
                      {getRoleDisplayName(requiredRole)}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Message */}
            <p className="text-gray-600 text-center mb-6 animate-slide-in-delay-1">
              {getRoleSpecificMessage(userRole)}
            </p>

            {/* Additional info */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6 animate-slide-in-delay-2">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-purple-800 font-medium mb-1">
                    Required access level
                  </p>
                  <p className="text-sm text-purple-700">
                    {getRequiredAccessLevel(userRole)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 animate-slide-in-delay-3">
              <button
                onClick={() => (window.location.href = "/")}
                className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Return to Homepage
              </button>

              {/* <button
                onClick={() => window.history.back()}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </button> */}

              {/* Show login button for unauthenticated users */}
              {userRole === "UNAUTHENTICATED" && (
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 animate-fade-in-delay-4">
            <div className="flex items-center justify-center">
              <Shield className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-xs text-gray-500">Secure Access System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay-4 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.8s forwards;
        }
        
        .animate-slide-in {
          opacity: 0;
          animation: slideIn 0.6s ease-out forwards;
        }
        
        .animate-slide-in-delay-1 {
          opacity: 0;
          animation: slideIn 0.6s ease-out 0.1s forwards;
        }
        
        .animate-slide-in-delay-2 {
          opacity: 0;
          animation: slideIn 0.6s ease-out 0.2s forwards;
        }
        
        .animate-slide-in-delay-3 {
          opacity: 0;
          animation: slideIn 0.6s ease-out 0.3s forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default UnAuthorized;
