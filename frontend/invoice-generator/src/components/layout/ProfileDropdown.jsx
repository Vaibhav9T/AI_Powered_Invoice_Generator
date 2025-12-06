import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {

  const navigate = useNavigate();

  return <div className="relative">
      <button 
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
      >
        { avatar ? (
        <img 
          src={avatar || '/default-avatar.png'} 
          alt="User Avatar"
          className="w-9 h-9 object-cover rounded-xl"
        />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{companyName}</p>
          <p className="text-xs text-gray-600">{email}</p>
        </div>

        <ChevronDown 
          className="h-4 w-4 text-gray-400"
        />

      </button>
      { isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-600">{companyName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <a onClick={()=> navigate('/Profile')}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >View Profile</a>

            <div className="border-t border-gray-100 mt-2 pt-2">
              <a
               href="#"
               onClick={onLogout}
                className="block px-4 py-2 text-red-600 hover-bg-red-50 coursor-pointer transition-colors"
                >
                  Sign Out
                </a>
            </div>
        </div>
      )}
    </div>
};

export default ProfileDropdown;