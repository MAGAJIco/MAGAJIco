'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Lightbulb, Radio, Lock, Search } from 'lucide-react';

interface PageNavProps {
  onMenuOpen?: () => void;
}

export default function PageNav({ onMenuOpen }: PageNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    if (pathname?.includes('/live')) setActivePage('live');
    else if (pathname?.includes('/secrets')) setActivePage('secrets');
    else if (pathname?.includes('/predictions')) setActivePage('predictions');
    else setActivePage('home');
  }, [pathname]);

  const navStyle: React.CSSProperties = {
    borderBottom: '1px solid #e5e7eb',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  };

  const navButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    background: 'transparent',
    color: '#4b5563',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  };

  const activeNavButtonStyle: React.CSSProperties = {
    ...navButtonStyle,
    background: '#a855f7',
    color: 'white',
    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onMenuOpen}
              style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.3s ease' }}
              title="Menu"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '24px', height: '24px', justifyContent: 'center' }}>
                <div style={{ height: '2px', background: '#374151', borderRadius: '1px' }}></div>
                <div style={{ height: '2px', background: '#374151', borderRadius: '1px' }}></div>
              </div>
            </button>
            <button
              style={{ padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.3s ease', fontSize: '14px', color: '#4b5563', fontWeight: '500' }}
              title="Current Page"
            >
              {activePage === 'home' && 'Dashboard'}
              {activePage === 'live' && 'Live'}
              {activePage === 'secrets' && 'Achilles'}
              {activePage === 'predictions' && 'Predictions'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => { setActivePage('home'); router.push('/en'); }}
              style={{...navButtonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '16px', borderRight: '1px solid #e5e7eb', ...(activePage === 'home' ? activeNavButtonStyle : {})}}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.3)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Lightbulb className="w-5 h-5" style={{ color: activePage === 'home' ? 'white' : '#4b5563', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }} />
            </button>
            <button
              onClick={() => { setActivePage('live'); router.push('/en/live'); }}
              style={{...navButtonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(activePage === 'live' ? activeNavButtonStyle : {})}}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.3)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Radio className="w-5 h-5" style={{ color: activePage === 'live' ? 'white' : '#4b5563', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }} />
            </button>
            <button
              onClick={() => { setActivePage('secrets'); router.push('/en/secrets'); }}
              style={{...navButtonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(activePage === 'secrets' ? activeNavButtonStyle : {})}}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.3)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Lock className="w-5 h-5" style={{ color: activePage === 'secrets' ? 'white' : '#4b5563', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
