import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturedTripsSection from "./components/FeaturedTripsSection";
import InteractiveMapSection from "./components/InteractiveMapSection";
import CommunityTestimonialsSection from "./components/CommunityTestimonialsSection";
import TipsSection from "./components/TipsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
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

const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/:mode" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </div>
    );
};

export default App;

