import { Button } from './ui/button';
import { GraduationCap, LogOut, ShieldCheck } from 'lucide-react';
import { BuntingDecoration } from './BuntingDecoration';
import { ThemeToggle } from './ui/theme-toggle';
import logo from '../assets/logo.png';

interface HeaderProps {
  user: any | null;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ user, onNavigate, onLogout, showBackButton = false, title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10 relative" style={{ boxShadow: 'rgb(0 0 0 / 25%) 0px 7px 5px 2px' }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('home')}
                className="mr-2"
              >
                ←
              </Button>
            )}
            <img src={logo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                {title || 'Karang Taruna DIY'}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {subtitle || 'Platform Tutorial Pertukangan'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onNavigate('my-learning')} 
                  className="text-xs sm:text-sm"
                >
                  <GraduationCap className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Pembelajaran Saya</span>
                </Button>
                {user?.role === 'admin' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onNavigate('admin-tutorials')} 
                    className="text-xs sm:text-sm text-purple-600"
                  >
                    <ShieldCheck className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                )}
                <div className="text-right hidden md:block">
                  <p className="text-xs text-gray-500">Selamat datang,</p>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                </div>
                {onLogout && (
                  <Button variant="outline" size="sm" onClick={onLogout} className="text-xs sm:text-sm">
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Keluar</span>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onNavigate('login')} 
                  className="text-xs sm:text-sm"
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onNavigate('register')} 
                  className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                >
                  Daftar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bunting Decoration */}
      <BuntingDecoration />
    </header>
  );
}
