import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import "../styles/Header.css";

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("login");
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

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

    const handleOpenModal = (mode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSwitchMode = (newMode) => {
        setModalMode(newMode);
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
                        onClick={() => handleOpenModal("login")}>
                        Войти
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleOpenModal("register")}>
                        Регистрация
                    </button>
                </div>
            </div>

            <AuthModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={modalMode}
                onSwitchMode={handleSwitchMode}
            />
        </header>
    );
};

export default Header;
