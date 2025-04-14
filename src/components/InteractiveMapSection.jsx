import React, { useState, useEffect, useRef } from 'react';
import '../styles/InteractiveMapSection.css';
import regionsData from '../data/regionsData.json';
import mapFeaturesData from '../data/mapFeaturesData.json';

const InteractiveMapSection = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  const yandexMapRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize Yandex Map
  useEffect(() => {
    if (!window.ymaps) {
      const loadingTimeout = setTimeout(() => {
        if (!window.ymaps) {
          setMapError("Не удалось загрузить карты Яндекс. Проверьте подключение к интернету.");
        }
      }, 5000);

      const checkForYmaps = setInterval(() => {
        if (window.ymaps) {
          clearTimeout(loadingTimeout);
          clearInterval(checkForYmaps);
          initMap();
        }
      }, 500);

      return () => {
        clearTimeout(loadingTimeout);
        clearInterval(checkForYmaps);
      };
    } else {
      initMap();
    }

    function initMap() {
      window.ymaps.ready(() => {
        try {
          if (mapRef.current && !yandexMapRef.current) {
          
            const map = new window.ymaps.Map(mapRef.current, {
              center: [48.005, 66.923], // Kazakhstan center
              zoom: 4,
              controls: ['zoomControl', 'fullscreenControl']
            });

            // Create markers for each region
            markersRef.current = regionsData.map(region => {
              const marker = new window.ymaps.Placemark(
                region.coordinates,
                {
                  hintContent: region.name,
                  balloonContent: region.description
                },
                {
                  iconLayout: 'default#image',
                  iconImageHref: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                  iconImageSize: [32, 32],
                  iconImageOffset: [-16, -32]
                }
              );

              marker.events.add('click', () => {
                setSelectedRegion(region.id);
              });

              map.geoObjects.add(marker);
              return marker;
            });

            yandexMapRef.current = map;
            setIsMapLoaded(true);
          }
        } catch (error) {
          console.error("Error initializing Yandex Map:", error);
          setMapError("Произошла ошибка при инициализации карты.");
        }
      });
    }

    return () => {
      if (yandexMapRef.current) {
        yandexMapRef.current.destroy();
        yandexMapRef.current = null;
      }
    };
  }, []);

  // Update markers when selected region changes
  useEffect(() => {
    if (yandexMapRef.current && markersRef.current.length > 0) {
      const selectedRegionData = regionsData.find(r => r.id === selectedRegion);
      
      if (selectedRegionData) {
      
        yandexMapRef.current.setCenter(selectedRegionData.coordinates, 6, {
          duration: 500
        });
      }
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (yandexMapRef.current) {
      yandexMapRef.current.container.fitToViewport();
    }
  }, [isMapExpanded]);

  return (
    <section className="interactive-map" id='interactive-map'>
      <div className="section-container">
        <h2>Исследуйте Казахстан</h2>
        <p className="section-description">
          Интерактивная карта поможет вам открыть для себя самые интересные места
        </p>

        <div className={`map-container ${isMapExpanded ? 'expanded' : ''}`}>
          <div className="map-wrapper" ref={mapRef}>
            {!isMapLoaded && !mapError && (
              <div className="map-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка карты...</p>
              </div>
            )}
            
            {mapError && (
              <div className="map-error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{mapError}</p>
                <button 
                  className="btn btn-outline"
                  onClick={() => window.location.reload()}
                >
                  Попробовать снова
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="map-features">
          {mapFeaturesData.map((feature, index) => (
            <div key={index} className="feature">
              <i className={feature.icon}></i>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;