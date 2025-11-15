"use client";

import { useState } from "react";

interface UserMenuProps {
  user: { name: string; email: string } | null;
  onSignOut: () => void;
}

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="user-menu-container">
        <div 
          className="nav-icon profile"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {isOpen && (
          <div className="user-dropdown">
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <div className="dropdown-divider" />
            <button className="dropdown-item" onClick={() => setIsOpen(false)}>
              ⚙️ Settings
            </button>
            <button className="dropdown-item" onClick={() => setIsOpen(false)}>
              👤 Profile
            </button>
            <div className="dropdown-divider" />
            <button 
              className="dropdown-item sign-out"
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          className="user-menu-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx>{`
        .user-menu-container {
          position: relative;
        }
        
        .nav-icon.profile {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .nav-icon.profile:hover {
          transform: scale(1.05);
        }
        
        .user-menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 1500;
        }
        
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          min-width: 280px;
          z-index: 1600;
          overflow: hidden;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #667eea10, #764ba210);
        }
        
        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-weight: bold;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-details {
          flex: 1;
        }
        
        .user-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        
        .user-email {
          font-size: 14px;
          color: #666;
        }
        
        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 8px 0;
        }
        
        .dropdown-item {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
          color: #333;
        }
        
        .dropdown-item:hover {
          background: #f5f5f5;
        }
        
        .dropdown-item.sign-out {
          color: #ef4444;
        }
        
        .dropdown-item.sign-out:hover {
          background: #fee2e2;
        }
      `}</style>
    </>
  );
}
