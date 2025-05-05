import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturedTripsSection from "./components/FeaturedTripsSection";
import InteractiveMapSection from "./components/InteractiveMapSection";
import CommunityTestimonialsSection from "./components/CommunityTestimonialsSection";
import TipsSection from "./components/TipsSection";
import FAQSection from "./components/FaqSection";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import ProfilePage from "./components/ProfilePage";
import TripsPage from "./components/TripsPage";
import TripDetailsPage from "./components/TripDetailsPage";
import AdminPanel from "./components/AdminPanel";
import ManagerPanel from "./components/ManagerPanel";
import AboutUsPage from "./components/AboutUsPage";
import CommunityPage from "./components/CommunityPage";
import authService from "./services/authService";
import "./styles/App.css";

const HomePage = () => {
    return (
        <>
            <Header />
            <main>
                <HeroSection />
                <HowItWorksSection />
                <FeaturedTripsSection />
                <InteractiveMapSection />
                <TipsSection />
                <CommunityTestimonialsSection />
                <FAQSection />
            </main>
            <Footer />
        </>
    );
};

// Protected route component for admin routes
const AdminRoute = ({ children }) => {
    if (!authService.isAuthenticated() || !authService.isAdmin()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

// Protected route component for manager routes
const ManagerRoute = ({ children }) => {
    if (!authService.isAuthenticated() || !authService.isManager()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/:mode" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/trip/:id" element={<TripDetailsPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route 
                    path="/admin/*" 
                    element={
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/manager/*" 
                    element={
                        <ManagerRoute>
                            <ManagerPanel />
                        </ManagerRoute>
                    } 
                />
            </Routes>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default App;
