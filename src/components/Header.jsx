import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Map, Settings } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ProfileExplorer</span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            <NavLink to="/" active={location.pathname === '/'}>
              <Users className="h-5 w-5" />
              <span className="hidden md:inline">Profiles</span>
            </NavLink>
            <NavLink to="/admin" active={location.pathname === '/admin'}>
              <Settings className="h-5 w-5" />
              <span className="hidden md:inline">Admin</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
        active 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;