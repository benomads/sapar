import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
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
    }, [lastScrollY]);

    const handleAuthNavigation = (mode) => {
        navigate(`/auth/${mode}`);
    };

    return (
        <header className={`header ${isHeaderHidden ? "hide" : ""}`}>
            <div className="header-content">
                <div className="logo">
                    <Link to="/">Sapar</Link>
                </div>

                <nav className="nav-links">
                    <a href="#trips">Маршруты</a>
                    <a href="#interactive-map">Направления</a>
                    <a href="#footer">О нас</a>
                    <a href="#footer">Контакты</a>
                </nav>

                <div className="auth-buttons">
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
                </div>
            </div>
        </header>
    );
};

export default Header;
