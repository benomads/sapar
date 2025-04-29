import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../styles/AuthPage.css";
import authService from "../services/authService";

const AuthPage = () => {
    const { mode = "login" } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (mode === "register") {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Пароли не совпадают");
                }
                await authService.register(formData.name, formData.email, formData.password);
                navigate("/auth/login");
            } else {
                const response = await authService.login(formData.email, formData.password);
                // Store the token in localStorage or a secure storage
                localStorage.setItem("token", response.token);
                navigate("/");
            }
        } catch (error) {
            setError(error.message || "Произошла ошибка при аутентификации");
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = (newMode) => {
        navigate(`/auth/${newMode}`);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Link to="/" className="back-button">
                    ← Вернуться на главную
                </Link>
                
                <div className="auth-content">
                    <div className="auth-header">
                        <h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>
                    </div>
                    
                    {error && (
                        <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        {mode === "register" && (
                            <div className="form-group name-field">
                                <label htmlFor="name">Имя</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Введите ваше имя"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group email-field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Введите ваш email"
                                required
                            />
                        </div>

                        <div className="form-group password-field">
                            <label htmlFor="password">Пароль</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Введите пароль"
                                required
                            />
                        </div>

                        {mode === "register" && (
                            <div className="form-group confirm-password-field">
                                <label htmlFor="confirmPassword">
                                    Подтвердите пароль
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Повторите пароль"
                                    required
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? "Загрузка..." : (mode === "login" ? "Войти" : "Зарегистрироваться")}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {mode === "login"
                                ? "Нет аккаунта?"
                                : "Уже есть аккаунт?"}
                            <button
                                className="link-button"
                                onClick={() => switchMode(mode === "login" ? "register" : "login")}>
                                {mode === "login" ? "Зарегистрироваться" : "Войти"}
                            </button>
                        </p>
                    </div>
                    
                    <div className="social-auth">
                        <p>Или войдите через</p>
                        <div className="social-buttons">
                            <button className="social-btn google">
                                Google
                            </button>
                            <button className="social-btn facebook">
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage; 