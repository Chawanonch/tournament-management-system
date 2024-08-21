import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '../components/Path';

export default function AnnouncePage() {
    const location = useLocation();
    const { top3Teams } = location.state || { top3Teams: [] };
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = (index:number) => {
        setCurrentIndex(index);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
      <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                  src={`${routes.home}${top3Teams[currentIndex]?.rank}.png`} 
                  alt={`Team ${top3Teams[currentIndex]?.rank}`} 
                  style={{ 
                      width: '100%', 
                      height: 'auto', 
                      maxWidth: '1550px', 
                      cursor: 'pointer', 
                      display: isModalOpen ? 'none' : 'block' // Hide when modal is open
                  }} 
                  onClick={openModal}
              />
              <h4 style={{ 
                  position: 'absolute', 
                  top: '80%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  color: '#000', 
                  fontSize: '42px', 
                  whiteSpace: 'pre-wrap', 
                  overflowWrap: 'break-word', 
                  maxWidth: '90%'
              }}>
                  {top3Teams[currentIndex]?.schoolName}
              </h4>
          </div>
          <div style={{ marginTop: 20 }}>
              {top3Teams.map((_:any, index:number) => (
                  <button 
                      key={index} 
                      onClick={() => handleClick(index)} 
                      style={{ margin: '0 5px', padding: '10px', fontSize: '16px' }}
                  >
                      {index + 1}
                  </button>
              ))}
          </div>
  
          {isModalOpen && (
              <div 
                  style={{
                      position: 'fixed', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      zIndex: 9999, 
                      overflow: 'hidden'
                  }} 
                  onClick={closeModal}
              >
                  <div 
                      style={{
                          position: 'relative',
                          maxWidth: '100%',
                          maxHeight: '100%',
                      }}
                  >
                      <img 
                          src={`${routes.home}${top3Teams[currentIndex]?.rank}.png`} 
                          alt={`Team ${top3Teams[currentIndex]?.rank}`} 
                          style={{ width: '100%', height: 'auto' }} 
                      />
                      <h4 style={{ 
                          position: 'absolute', 
                          top: '80%', 
                          left: '50%', 
                          transform: 'translate(-50%, -50%)', 
                          color: '#000', 
                          fontSize: '42px', 
                          whiteSpace: 'pre-wrap', 
                          overflowWrap: 'break-word', 
                          maxWidth: '90%'
                      }}>
                          {top3Teams[currentIndex]?.schoolName}
                      </h4>
                  </div>
              </div>
          )}
      </div>
  );
  
}
