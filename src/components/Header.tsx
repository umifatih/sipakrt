import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

export function Header() {
  return (
    <header className="bg-white/50 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-gray-800">Halo, Budi Santoso 👋</h2>
          <p className="text-sm text-gray-500">RT 03 / RW 05 • Kelurahan Sejahtera</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-3 rounded-xl hover:bg-[#E8F1FB] transition-all duration-300 ease-out group">
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-[#007BFF] transition-colors" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#007BFF] hover:bg-[#007BFF] text-white text-xs rounded-full">
              3
            </Badge>
          </button>

          <Avatar className="w-10 h-10 ring-2 ring-[#007BFF] ring-offset-2 cursor-pointer hover:ring-offset-4 transition-all duration-300">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" />
            <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#0056d2] text-white">BS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default Header;

