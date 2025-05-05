import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HeroSection.css";
import heroBackground from "../assets/ALP-hero-bg-hiking-medium.png";
import ContactModal from "./ContactModal";

const HeroSection = () => {
    const [showContactModal, setShowContactModal] = useState(false);

    const openContactModal = () => {
        setShowContactModal(true);
    };

    const closeContactModal = () => {
        setShowContactModal(false);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="hero" style={{ background: `url(${heroBackground}) center/cover no-repeat` }}>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1>Откройте для себя сокровища Казахстана</h1>
                <p>
                    Присоединяйтесь к сообществу путешественников и исследуйте
                    самые красивые места нашей страны
                </p>
                <div className="hero-buttons">
                    <a href="#trips" className="btn btn-primary">
                        Найти маршрут
                    </a>
                    <button onClick={openContactModal} className="btn btn-outline">
                        Связаться с нами
                    </button>
                </div>
            </div>
            <div className="hero-scroll-indicator">
                <span>Прокрутите вниз</span>
                <div className="scroll-arrow"></div>
            </div>

            {/* Contact Modal */}
            <ContactModal 
                isOpen={showContactModal} 
                onClose={closeContactModal} 
            />
        </section>
    );
};

export default HeroSection;
