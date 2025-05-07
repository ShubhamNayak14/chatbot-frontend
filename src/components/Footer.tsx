import React from 'react';
import { Unplug } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-10  text-center text-gray-400">
      <div className="flex items-center justify-center gap-2">
        <span className='font-sans'>Made with</span>
        <Unplug className="h-4 w-4 text-pink-400 animate-pulse" />
        <span className='font-sans'>by Shubham Nayak</span>
      </div>
      <p className="mt-2 text-sm">© 2025 HeyA!. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

