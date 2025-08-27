"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
  // { 
  //   label: 'Enquiries', 
  //   href: '/admin/enquiries', 
  //   icon: '📧'
  // },
  { 
    label: 'CMS Pages', 
    href: '#', 
    icon: '⚙️',
    children: [
      { label: 'Home Page', href: '/admin/cms/home', icon: '🏠' },
      { label: 'About', href: '/admin/cms/about', icon: 'ℹ️' },
      { label: 'Services', href: '/admin/services', icon: '🛠️' },
      { label: 'Blog', href: '/admin/blogs', icon: '📝' },
      { label: 'Contact', href: '/admin/contact', icon: '📞' },

 
      { label: 'Footer', href: '/admin/footer', icon: '📄' },
    ]
  },
  // { 
  //   label: 'Content', 
  //   href: '#', 
  //   icon: '📄',
  //   children: [
  //     { label: 'Banners', href: '/admin/banners', icon: '🖼️' },
  //     { label: 'Services', href: '/admin/services', icon: '🛠️' },
  //     { label: 'Blogs', href: '/admin/blogs', icon: '📝' },
  //     { label: 'Projects', href: '/admin/projects', icon: '📁' },
  //     { label: 'Brands', href: '/admin/brands', icon: '🏢' },
  //     { label: 'Footer', href: '/admin/footer', icon: '📄' },
  //     { label: 'Contact', href: '/admin/contact', icon: '📞' },
  //   ]
  // },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState(new Set(['CMS Pages', 'Content']));

  const toggleItem = (label) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item) => {
    if (item.children) {
      const isExpanded = expandedItems.has(item.label);
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleItem(item.label)}
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              padding: '12px 16px',
              borderRadius: 8, 
              marginBottom: 8, 
              textDecoration: 'none', 
              color: '#fff',
              background: 'none', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left',
              cursor: 'pointer', 
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span> 
            {item.label}
            <span style={{ 
              marginLeft: 'auto', 
              fontSize: 12,
              transition: 'transform 0.3s ease',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </span>
          </button>
          {isExpanded && (
            <div style={{ 
              marginLeft: 20,
              animation: 'slideDown 0.3s ease-out'
            }}>
              {item.children.map(child => (
                <Link key={child.href} href={child.href} style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '10px 16px',
                  borderRadius: 8, 
                  marginBottom: 6, 
                  textDecoration: 'none', 
                  color: '#fff',
                  background: pathname === child.href ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'none',
                  fontWeight: pathname === child.href ? '600' : '400',
                  transition: 'all 0.3s ease',
                  fontSize: 13,
                  border: pathname === child.href ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  boxShadow: pathname === child.href ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== child.href) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== child.href) {
                    e.target.style.background = 'none';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
                >
                  <span style={{ fontSize: 16 }}>{child.icon}</span> {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link key={item.href} href={item.href} style={{
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        padding: '12px 16px',
        borderRadius: 8, 
        marginBottom: 8, 
        textDecoration: 'none', 
        color: '#fff',
        background: pathname === item.href ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'none',
        fontWeight: pathname === item.href ? '600' : '500',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        border: pathname === item.href ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
        boxShadow: pathname === item.href ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (pathname !== item.href) {
          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          e.target.style.transform = 'translateX(4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (pathname !== item.href) {
          e.target.style.background = pathname === item.href ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'none';
          e.target.style.transform = 'translateX(0)';
        }
      }}
      >
        <span style={{ fontSize: 20 }}>{item.icon}</span> {item.label}
      </Link>
    );
  };

  return (
    <aside style={{ 
      width: 220, 
      background: '#18181b', 
      color: '#fff', 
      height: '100vh', 
      padding: 24, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 16,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#52525b #27272a'
    }}>
      <style jsx>{`
        /* Custom Webkit Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #52525b, #71717a);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #71717a, #a1a1aa);
          transform: scale(1.1);
        }
        
        /* Firefox Scrollbar Styling */
        scrollbar-width: thin;
        scrollbar-color: #52525b #27272a;
        
        /* Smooth Scrolling */
        scroll-behavior: smooth;
        
        /* Slide Down Animation for Submenu */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Hover Effects for Navigation Items */
        .nav-item {
          transition: all 0.3s ease;
        }
        
        .nav-item:hover {
          transform: translateX(4px);
        }
        
        /* Active State Glow Effect */
        .nav-item.active {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: 22, 
        marginBottom: 32, 
        letterSpacing: 1,
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        padding: '8px 0'
      }}>
        Admin Panel
      </div>
      
      <nav style={{ flex: 1 }}>
        {navItems.map(renderNavItem)}
      </nav>
      
      <div style={{ 
        padding: '16px 0',
        borderTop: '1px solid #3f3f46',
        marginTop: 'auto'
      }}>
        <button 
          onClick={() => { 
            localStorage.removeItem('admin_token'); 
            window.location.href = '/admin/login'; 
          }} 
          style={{ 
            background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            padding: '12px 16px', 
            fontWeight: '600', 
            cursor: 'pointer',
            width: '100%',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
} 