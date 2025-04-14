import React from 'react';
import '../styles/TipsSection.css';
import tipsData from '../data/tipsData.json';

const TipsSection = () => {
  return (
    <section className="tips" id="tips">
      <div className="section-container">
        <h2>Советы путешественникам</h2>
        <p className="section-description">
          Полезные рекомендации для комфортного и безопасного путешествия
        </p>

        <div className="tips-grid">
          {tipsData.map((tip, index) => (
            <div key={index} className="tip-card">
              <div className="tip-icon">
                <i className={tip.icon}></i>
              </div>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection; 