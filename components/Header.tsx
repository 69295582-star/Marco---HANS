
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-effect shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold">
          W
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          WhiteHair Stylist
        </h1>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
      </nav>
    </header>
  );
};

export default Header;
