import React, { useState, useEffect } from "react";
import "../styles/AuthModal.css";

const AuthModal = ({ isOpen, onClose, mode = "login", onSwitchMode }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
        }
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                email: "",
                password: "",
                name: "",
                confirmPassword: "",
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="modal-header">
                    <h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === "register" && (
                        <div className="form-group">
                            <label htmlFor="name">Имя</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {mode === "register" && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Подтвердите пароль
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary">
                        {mode === "login" ? "Войти" : "Зарегистрироваться"}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        {mode === "login"
                            ? "Нет аккаунта?"
                            : "Уже есть аккаунт?"}{" "}
                        <button
                            className="link-button"
                            onClick={(e) => {
                                e.preventDefault();
                                onSwitchMode(
                                    mode === "login" ? "register" : "login"
                                );
                            }}>
                            {mode === "login" ? "Зарегистрироваться" : "Войти"}
                        </button>
                    </p>
                </div>
                <div className="social-auth">
                    <p>Или войдите через</p>
                    <div className="social-buttons">
                        <button className="social-btn google">
                            <i className="fab fa-google"></i>
                            Google
                        </button>
                        <button className="social-btn facebook">
                            <i className="fab fa-facebook-f"></i>
                            Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
