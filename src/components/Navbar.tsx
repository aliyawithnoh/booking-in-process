import React from 'react';
import { Button } from './ui/button';
import { Home, History, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'history';
  onNavigate: (view: 'home' | 'history') => void;
  onLogout: () => void;
}

export function Navbar({ currentView, onNavigate, onLogout }: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">BCHS Booking</h1>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant={currentView === 'home' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('home')}
                className={`flex items-center space-x-2 ${
                  currentView === 'home' 
                    ? 'bg-white text-blue-600 hover:bg-gray-100' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
              
              <Button
                variant={currentView === 'history' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('history')}
                className={`flex items-center space-x-2 ${
                  currentView === 'history' 
                    ? 'bg-white text-blue-600 hover:bg-gray-100' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="flex items-center space-x-2 text-white hover:bg-blue-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}