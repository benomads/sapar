import React, { useState } from 'react';
import '../styles/TripModal.css';

const TripModal = ({ trip, onClose, onBookTrip }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    date: '',
    notes: ''
  });
  
  const [activeTab, setActiveTab] = useState('details');
  const [isBooking, setIsBooking] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onBookTrip(trip.id, formData);
    setIsBooking(false);
  };
  
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const renderItineraryDays = () => {
    const numDays = parseInt(trip.duration.split(' ')[0]);
    return Array.from({ length: numDays }).map((_, index) => (
      <div key={index} className="itinerary-day">
        <div className="day-header">
          <div className="day-number">День {index + 1}</div>
        </div>
        <div className="day-content">
          <h4>Основные активности:</h4>
          <p>
            {index === 0 ? 'Встреча группы, инструктаж, начало маршрута' : 
            index === numDays - 1 ? 'Завершение маршрута, прощальный ужин, отъезд' : 
            'Продолжение маршрута, исследование местности, активности'}
          </p>
          
          <h4>Питание:</h4>
          <p>Завтрак, обед (ланч-бокс), ужин</p>
          
          <h4>Проживание:</h4>
          <p>
            {trip.difficulty === 'Легкий' ? 'Комфортабельный отель' : 
            trip.difficulty === 'Средний' ? 'Туристическая база или глэмпинг' : 
            'Палаточный лагерь в дикой природе'}
          </p>
        </div>
      </div>
    ));
  };

  // SVG Icons
  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const PeopleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  return (
    <div className="trip-modal-overlay" onClick={onClose}>
      <div className="trip-modal" onClick={handleModalContentClick}>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <div className="modal-image">
          <img src={trip.image} alt={trip.title} />
          <span className="modal-duration">{trip.duration}</span>
          <div className="modal-price">{trip.price}</div>
        </div>
        
        <div className="trip-modal-content">
          <div className="modal-header">
            <h2>{trip.title}</h2>
            <div className="modal-rating">
              <StarIcon />
              <span>{trip.rating}</span>
            </div>
          </div>
          
          <div className="modal-tabs">
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Подробности
            </button>
            <button 
              className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              Участники
            </button>
            <button 
              className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              Маршрут
            </button>
          </div>
          
          <div className="modal-tab-content">
            {activeTab === 'details' && (
              <div className="tab-details">
                <p className="trip-description">{trip.description}</p>
                
                <div className="trip-features">
                  <div className="feature_trip">
                    <ClockIcon />
                    <div>
                      <h4>Продолжительность</h4>
                      <p>{trip.duration}</p>
                    </div>
                  </div>
                  
                  <div className="feature_trip">
                    <PeopleIcon />
                    <div>
                      <h4>Участники</h4>
                      <p>Макс. {trip.participants} человек</p>
                    </div>
                  </div>
                  
                  <div className="feature_trip">
                    <FileIcon />
                    <div>
                      <h4>Сложность</h4>
                      <p>{trip.difficulty}</p>
                    </div>
                  </div>
                </div>
                
                <div className="whats-included">
                  <h3>Включено в стоимость</h3>
                  <ul>
                    <li>Проживание на протяжении всего маршрута</li>
                    <li>Профессиональный гид</li>
                    <li>Транспорт с кондиционером</li>
                    <li>Питание (завтрак и ужин)</li>
                    <li>Входные билеты в национальные парки</li>
                    <li>Снаряжение для активностей</li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'participants' && (
              <div className="tab-participants">
                <div className="participants-info">
                  <h3>Информация об участниках</h3>
                  <p>Данный маршрут рассчитан на группу размером до {trip.participants} человек.</p>
                  
                  <div className="participant-requirements">
                    <h4>Требования к участникам:</h4>
                    <ul>
                      <li>Возраст: от 16 лет (до 18 лет в сопровождении взрослых)</li>
                      <li>Физическая подготовка: {trip.difficulty === 'Легкий' ? 'начальный уровень' : trip.difficulty === 'Средний' ? 'средний уровень' : 'хорошая физическая форма'}</li>
                      <li>Отсутствие противопоказаний по здоровью</li>
                    </ul>
                  </div>
                  
                  <div className="group-composition">
                    <h4>Состав группы:</h4>
                    <p>В группе будут участвовать туристы разных возрастов и уровней подготовки. Маршрут разработан так, чтобы каждый участник получил максимум впечатлений и комфорта.</p>
                  </div>
                  
                  <div className="guides-info">
                    <h4>Гиды и инструкторы:</h4>
                    <p>Вашими проводниками будут опытные гиды, знающие местность и имеющие все необходимые сертификаты. На маршруте сложности "{trip.difficulty}" вас будут сопровождать {trip.difficulty === 'Легкий' ? '1 гид' : trip.difficulty === 'Средний' ? '2 гида' : '2 гида и инструктор'}.</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'itinerary' && (
              <div className="tab-itinerary">
                <h3>План маршрута</h3>
                <div className="itinerary-days">
                  {renderItineraryDays()}
                </div>
              </div>
            )}
          </div>
          
          {isBooking ? (
            <div className="booking-form">
              <h3>Забронировать маршрут</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Имя и фамилия</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-row">
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
                    <label htmlFor="phone">Телефон</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="participants">Количество участников</label>
                    <select 
                      id="participants" 
                      name="participants" 
                      value={formData.participants} 
                      onChange={handleInputChange} 
                      required
                    >
                      {[...Array(trip.participants)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="date">Дата начала</label>
                    <input 
                      type="date" 
                      id="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Дополнительная информация</label>
                  <textarea 
                    id="notes" 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsBooking(false)}>
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Забронировать
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setIsBooking(true)}>
                Забронировать за {trip.price}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripModal;