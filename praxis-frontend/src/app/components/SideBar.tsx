'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileUp, FileBarChart2, Settings } from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ElementType;
  route: string;
}

interface SidebarProps {
  isOpen: boolean;
  activeNav: string;
  setActiveNav: (navName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeNav, setActiveNav }) => {
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { name: 'Uploads', icon: FileUp, route: '/upload' },
    { name: 'Reports', icon: FileBarChart2, route: '/reports' },
    { name: 'Settings', icon: Settings, route: '/settings' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-0'
    } overflow-hidden`}>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Praxis</h1>
      </div>
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.name;
          return (
            <Link
              key={item.name}
              href={item.route || '#'}
              onClick={() => setActiveNav(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;