import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { refreshSession } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Session duration in minutes
const SESSION_DURATION_MINUTES = 60; // Updated to 60 minutes to match our new configuration

// Styled components
const TimerContainer = styled.div<{ isExpiring: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${props => (props.isExpiring ? '#f44336' : '#4caf50')};
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  font-size: 14px;
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: ${props => (props.isExpiring ? 1 : 0.8)};

  &:hover {
    opacity: 1;
  }
`;

const RefreshButton = styled.button`
  background-color: white;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const TimerIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

interface SessionTimerProps {
  onRefresh?: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ onRefresh }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(SESSION_DURATION_MINUTES * 60);
  const [visible, setVisible] = useState<boolean>(false);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is not authenticated, don't show the timer
    if (!isAuthenticated) {
      setVisible(false);
      return;
    }

    // Only start showing the timer when less than 5 minutes remain
    const showTimerThreshold = 5 * 60; // 5 minutes in seconds
    
    // Check localStorage for login timestamp
    const loginTimestamp = localStorage.getItem('mmartLoginTimestamp');
    
    if (loginTimestamp) {
      const elapsed = (Date.now() - parseInt(loginTimestamp)) / 1000;
      const remaining = SESSION_DURATION_MINUTES * 60 - elapsed;
      
      // If the remaining time is negative, the session has already expired
      if (remaining <= 0) {
        setSessionExpired(true);
        setTimeRemaining(0);
      } else {
        setSessionExpired(false);
        setTimeRemaining(Math.max(0, remaining));
      }
      
      // Show timer if less than threshold time remaining
      if (remaining < showTimerThreshold && remaining > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } else {
      // If there's no login timestamp but user is authenticated, 
      // create a new timestamp now rather than showing session expired
      localStorage.setItem('mmartLoginTimestamp', Date.now().toString());
      setTimeRemaining(SESSION_DURATION_MINUTES * 60);
      setVisible(false);
      setSessionExpired(false);
    }
    
    // Set up interval to update timer
    const timerId = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = prevTime - 1;
        
        if (newTime <= 0) {
          setSessionExpired(true);
        }
        
        if (newTime <= showTimerThreshold && newTime > 0 && !visible) {
          setVisible(true);
        }
        
        return Math.max(0, newTime);
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [visible, isAuthenticated]);

  const handleRefresh = async () => {
    // Refresh the session
    const success = await refreshSession();
    
    if (success) {
      // Reset timer
      setTimeRemaining(SESSION_DURATION_MINUTES * 60);
      setVisible(false);
      setSessionExpired(false);
      
      // Call the provided refresh callback
      if (onRefresh) {
        onRefresh();
      }
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Show session expired modal
  if (sessionExpired && isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h3>Your session has expired. Please log in again.</h3>
          <p>Login session should last up to {SESSION_DURATION_MINUTES} mins.</p>
          <button 
            onClick={handleRefresh}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
  
  // Only show timer if less than threshold minutes remain and not expired
  if (!visible || !isAuthenticated) {
    return null;
  }
  
  // Determine if time is critically low (less than 1 minute)
  const isExpiring = timeRemaining < 60;
  
  return (
    <TimerContainer isExpiring={isExpiring}>
      <TimerIcon>⏱️</TimerIcon>
      <div>
        Session expires in {formatTime(timeRemaining)}
      </div>
      <RefreshButton onClick={handleRefresh}>
        Refresh
      </RefreshButton>
    </TimerContainer>
  );
};

export default SessionTimer;
