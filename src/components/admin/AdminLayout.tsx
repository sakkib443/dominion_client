"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    FiHome, FiShoppingBag, FiUsers, FiCreditCard,
    FiGrid, FiLogOut, FiMenu, FiX, FiChevronDown,
    FiShoppingCart, FiMessageSquare, FiUser, FiChevronLeft,
} from 'react-icons/fi';

interface AdminLayoutProps { children: React.ReactNode; }

const menuItems = [
    { name: 'Dashboard',  href: '/dashboard/admin',            icon: FiHome,          submenu: null },
    { name: 'Products',   href: '/dashboard/admin/products',   icon: FiShoppingBag,   submenu: [
        { name: 'All Products', href: '/dashboard/admin/products' },
        { name: 'Add Product',  href: '/dashboard/admin/products/new' },
    ]},
    { name: 'Category',   href: '/dashboard/admin/categories', icon: FiGrid,          submenu: [
        { name: 'All Categories',   href: '/dashboard/admin/categories' },
        { name: 'Create Category',  href: '/dashboard/admin/categories/new' },
    ]},
    { name: 'Orders',     href: '/dashboard/admin/orders',     icon: FiShoppingCart,  submenu: null },
    { name: 'Inquiries',  href: '/dashboard/admin/inquiries',  icon: FiMessageSquare, submenu: null },
    { name: 'Payment',    href: '/dashboard/admin/payments',   icon: FiCreditCard,    submenu: null },
    { name: 'Customers',  href: '/dashboard/admin/customers',  icon: FiUsers,         submenu: null },
    { name: 'Profile',    href: '/dashboard/admin/profile',    icon: FiUser,          submenu: null },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

    useEffect(() => {
        menuItems.forEach((item) => {
            if (item.submenu?.some(sub => pathname === sub.href)) {
                setExpandedMenu(item.name);
            }
        });
    }, [pathname]);

    const handleLogout = () => { localStorage.removeItem('token'); router.push('/'); };

    const isActive = (href: string) => pathname === href;
    const isParentActive = (item: typeof menuItems[0]) =>
        item.submenu ? item.submenu.some(s => pathname === s.href) : pathname === item.href;

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
                {sidebarOpen && (
                    <Link href="/dashboard/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Image src="/logo.svg" alt="Logo" width={120} height={34} style={{ width: '120px', height: 'auto' }} />
                    </Link>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden lg:flex"
                    style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#888', borderRadius: '6px' }}
                >
                    <FiMenu size={18} />
                </button>
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden"
                    style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#888', borderRadius: '6px' }}
                >
                    <FiX size={18} />
                </button>
            </div>

            {/* Nav */}
            <nav style={{ padding: '12px 8px', overflowY: 'auto', flex: 1 }}>
                {sidebarOpen && (
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px', marginBottom: '8px' }}>
                        Main Menu
                    </p>
                )}
                {menuItems.map((item) => {
                    const hasSubmenu = item.submenu && item.submenu.length > 0;
                    const isExpanded = expandedMenu === item.name;
                    const parentActive = isParentActive(item);
                    const exactActive = !hasSubmenu && isActive(item.href);

                    return (
                        <div key={item.name}>
                            <Link
                                href={hasSubmenu ? '#' : item.href}
                                onClick={(e) => {
                                    if (hasSubmenu) {
                                        e.preventDefault();
                                        setExpandedMenu(isExpanded ? null : item.name);
                                    }
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: sidebarOpen ? '9px 12px' : '9px',
                                    borderRadius: '6px', textDecoration: 'none',
                                    marginBottom: '2px', transition: 'background 0.15s',
                                    background: exactActive || (hasSubmenu && parentActive) ? '#ebebeb' : 'transparent',
                                    color: exactActive || parentActive ? '#111' : '#666',
                                    fontWeight: exactActive || parentActive ? 700 : 500,
                                    fontSize: '13px',
                                    justifyContent: sidebarOpen ? 'space-between' : 'center',
                                } as React.CSSProperties}
                                onMouseEnter={e => { if (!exactActive && !parentActive) (e.currentTarget as HTMLElement).style.background = '#f5f5f5'; }}
                                onMouseLeave={e => { if (!exactActive && !parentActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <item.icon size={17} />
                                    {sidebarOpen && <span>{item.name}</span>}
                                </div>
                                {sidebarOpen && hasSubmenu && (
                                    <FiChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: '#aaa' }} />
                                )}
                            </Link>

                            {hasSubmenu && isExpanded && sidebarOpen && (
                                <div style={{ marginLeft: '16px', paddingLeft: '12px', borderLeft: '1px solid #e8e8e8', marginBottom: '4px' }}>
                                    {item.submenu!.map((sub) => (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            style={{
                                                display: 'block', padding: '7px 10px', borderRadius: '6px',
                                                fontSize: '12px', textDecoration: 'none', marginBottom: '1px',
                                                background: isActive(sub.href) ? '#ebebeb' : 'transparent',
                                                color: isActive(sub.href) ? '#111' : '#888',
                                                fontWeight: isActive(sub.href) ? 700 : 400,
                                            }}
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: '12px 8px', borderTop: '1px solid #f0f0f0' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', borderRadius: '6px', background: 'none',
                        border: 'none', cursor: 'pointer', color: '#999', fontSize: '13px',
                        fontWeight: 500, justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff0f0'; (e.currentTarget as HTMLElement).style.color = '#dc2626'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#999'; }}
                >
                    <FiLogOut size={17} />
                    {sidebarOpen && <span>Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fb', display: 'flex' }}>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
                    className="lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:flex"
                style={{
                    width: sidebarOpen ? '240px' : '60px', flexShrink: 0,
                    flexDirection: 'column', transition: 'width 0.25s',
                    background: '#fff', borderRight: '1px solid #f0f0f0',
                    position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 30,
                }}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className="lg:hidden"
                style={{
                    position: 'fixed', top: 0, left: 0, height: '100vh', width: '240px',
                    background: '#fff', borderRight: '1px solid #f0f0f0', zIndex: 50,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.25s', display: 'flex', flexDirection: 'column',
                }}
            >
                <SidebarContent />
            </aside>

            {/* Main */}
            <div style={{ flex: 1, marginLeft: 0, transition: 'margin 0.25s' }} className={sidebarOpen ? 'lg:ml-[240px]' : 'lg:ml-[60px]'}>
                {/* Header */}
                <header style={{
                    height: '48px', background: '#fff', borderBottom: '1px solid #f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px', position: 'sticky', top: 0, zIndex: 20,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                            style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                        >
                            <FiMenu size={18} />
                        </button>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#111', margin: 0 }}>
                            Admin Panel
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/" style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontSize: '12px', fontWeight: 600, color: '#666',
                            textDecoration: 'none', padding: '5px 10px',
                            borderRadius: '6px', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f5f5f5'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                            <FiChevronLeft size={13} /> Back to Store
                        </Link>
                        <div style={{ width: '1px', height: '20px', background: '#f0f0f0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: '#ebebeb', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: 700, color: '#444',
                            }}>A</div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', margin: 0 }} className="hidden sm:block">
                                Admin
                            </p>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main style={{ padding: '24px', minHeight: 'calc(100vh - 48px)' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
