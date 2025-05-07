import React from 'react';
import { BotMessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center gap-2">
        <BotMessageSquare className="h-6 w-6 text-pink-400" />
        <span className="font-semibold text-xl">HeyA!</span>
      </div>
      
    </header>
  );
};

export default Header;