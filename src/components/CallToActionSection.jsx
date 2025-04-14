import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CallToActionSection.css';

const CallToActionSection = () => {
  return (
    <section className="call-to-action">
      <div className="call-to-action-content">
        <h2>Готовы к приключениям?</h2>
        <p>
          Присоединяйтесь к нашему сообществу путешественников и начните планировать
          своё следующее незабываемое приключение по Казахстану
        </p>
        <div className="call-to-action-buttons">
          <Link to="/signup" className="btn">
            Создать аккаунт
          </Link>
          <Link to="/trips" className="btn">
            Исследовать маршруты
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;