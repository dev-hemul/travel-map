import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

const TelegramLoginButton = () => {
  const botId = '7744665366'; 
  const botUsername = 'TravelMapSupport_bot';
  const redirectUri = 'https://yourdomain.com/profile';
  const origin = window.location.origin;

  const handleLogin = () => {
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&bot=${botUsername}&origin=${encodeURIComponent(origin)}&request_access=write&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = telegramAuthUrl;
  };

  return (
<button
    onClick={handleLogin}
    className="
      bg-[#229ED9] 
      text-white 
      hover:bg-[#178bb7] 
      transition-all 
      duration-200 
      flex 
      items-center 
      justify-center
      rounded-lg       
      sm:rounded-full  
      w-full 
      h-full
    "
    aria-label="Увійти через Telegram"
    type="button"
    style={{ fontSize: '1.5rem' }}
  >
    <FaTelegramPlane />
  </button>
  );
};

export default TelegramLoginButton;
