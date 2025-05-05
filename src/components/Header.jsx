import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import authService from "../services/authService";

const Header = () => {
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're on a light background page (auth or profile pages)
    const isLightBackground = location.pathname.includes('/auth') || 
                              location.pathname.includes('/profile') || 
                              location.pathname.includes('/trips') || 
                              location.pathname.includes('/admin') ||
                              location.pathname.includes('/manager') ||
                              location.pathname.includes('/about') ||
                              location.pathname.includes('/community');

    // Check if we're on the home page
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        // Check if user is logged in by looking for token
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        
        // Check if user is admin or manager
        if (token) {
            setIsAdmin(authService.isAdmin());
            setIsManager(authService.isManager());
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                setIsHeaderHidden(true);
            } else {
                setIsHeaderHidden(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, location]);

    const handleAuthNavigation = (mode) => {
        navigate(`/auth/${mode}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsManager(false);
        setProfileDropdown(false);
        navigate('/');
    };

    const toggleProfileDropdown = () => {
        setProfileDropdown(!profileDropdown);
    };

    // Handle navigation to map section
    const handleMapNavigation = (e) => {
        if (!isHomePage) {
            // If not on home page, navigate to home page first
            e.preventDefault();
            navigate('/?scrollTo=map');
        } else {
            // If already on home page, scroll to map section
            e.preventDefault();
            const mapSection = document.getElementById('interactive-map');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Check for scrollTo parameter when component mounts or location changes
    useEffect(() => {
        if (isHomePage && location.search.includes('scrollTo=map')) {
            // Small delay to ensure the DOM is fully loaded
            setTimeout(() => {
                const mapSection = document.getElementById('interactive-map');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                }
                // Clean up URL parameter without refreshing page
                window.history.replaceState({}, document.title, '/');
            }, 100);
        }
    }, [isHomePage, location]);

    return (
        <header className={`header ${isHeaderHidden ? "hide" : ""} ${isLightBackground ? "light-mode" : ""}`}>
            <div className="header-content">
                <div className="logo">
                    <Link to="/">Sapar</Link>
                </div>

                <nav className="nav-links">
                    <Link to="/trips">Маршруты</Link>
                    <Link to="/community">Сообщества</Link>
                    <a href="#interactive-map" onClick={handleMapNavigation}>Направления</a>
                    <Link to="/about">О нас</Link>
                    {isAdmin && (
                        <Link to="/admin" className="admin-link">
                            Админ панель
                        </Link>
                    )}
                    {isManager && !isAdmin && (
                        <Link to="/manager" className="manager-link">
                            Панель менеджера
                        </Link>
                    )}
                </nav>

                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <div className="profile-container">
                            <button className="profile-button" onClick={toggleProfileDropdown}>
                                <svg className="profile-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {profileDropdown && (
                                <div className="profile-dropdown">
                                    <Link to="/profile" onClick={() => setProfileDropdown(false)}>
                                        Мой профиль
                                    </Link>
                                    <Link to="/trips" onClick={() => setProfileDropdown(false)}>
                                        Мои маршруты
                                    </Link>
                                    <Link to="/community" onClick={() => setProfileDropdown(false)}>
                                        Сообщества
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin" onClick={() => setProfileDropdown(false)}>
                                            Админ панель
                                        </Link>
                                    )}
                                    {isManager && !isAdmin && (
                                        <Link to="/manager" onClick={() => setProfileDropdown(false)}>
                                            Панель менеджера
                                        </Link>
                                    )}
                                    <button onClick={handleLogout}>
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                className="btn btn-outline"
                                onClick={() => handleAuthNavigation("login")}>
                                Войти
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleAuthNavigation("register")}>
                                Регистрация
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
