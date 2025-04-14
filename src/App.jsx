
import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturedTripsSection from "./components/FeaturedTripsSection";
import InteractiveMapSection from "./components/InteractiveMapSection";
import CommunityTestimonialsSection from "./components/CommunityTestimonialsSection";
import TipsSection from "./components/TipsSection";
import FAQSection from "./components/FaqSection";
import Footer from "./components/Footer";
import "./styles/App.css";

const App = () => {
    return (
        <div className="app">
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
        </div>
    );
};

export default App;

