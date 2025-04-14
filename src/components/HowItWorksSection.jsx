import React from 'react';
import '../styles/HowItWorksSection.css';
import howItWorksData from '../data/howItWorksData.json';

const HowItWorksSection = () => {
  return (
    <section className="how-it-works" id='how-it-works'>
      <div className="section-container">
        <h2>Как это работает</h2>
        <p className="section-description">
          Простой процесс организации вашего идеального путешествия
        </p>

        <div className="steps-grid">
          {howItWorksData.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{index + 1}</div>
              <div className="step-icon">
                <i className={`fas ${step.icon}`}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;