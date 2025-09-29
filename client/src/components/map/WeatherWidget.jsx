import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaCloudRain } from 'react-icons/fa';
import { WiHumidity, WiWindy, WiThermometer, WiRain, WiDaySunny, WiDayCloudy, WiThunderstorm } from 'react-icons/wi';
import { useDebounce } from "use-debounce";


export default function WeatherWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState("Kyiv");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().getHours().toString().padStart(2, "0") + ":00");
  const [weather, setWeather] = useState(null);
  const [debouncedCity] = useDebounce(city, 600);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const fetchWeather = async (cityInput, selectedDate) => {
  try {
    // Визначаємо: кирилиця чи латиниця
    const isCyrillic = /[а-яА-ЯіїєґІЇЄҐ]/.test(cityInput);
    const lang = isCyrillic ? "uk" : "en";

    const geoRes = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&language=${lang}`
    );
    const geoData = geoRes.data;

    if (!geoData.results || geoData.results.length === 0) {
      console.error("Місто не знайдено");
      setWeather(null);
      return;
    }

    const { latitude, longitude } = geoData.results[0];

    const res = await axios.get(`https://api.open-meteo.com/v1/gfs`, {
      params: {
        latitude,
        longitude,
        hourly: 'temperature_2m,relativehumidity_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,cloudcover',
        start_date: selectedDate,
        end_date: selectedDate,
        timezone: 'auto'
      }
    });

    setWeather(res.data.hourly);
  } catch (error) {
    console.error("Помилка при отриманні погоди:", error);
    setWeather(null);
  }
};

  useEffect(() => {
  if (debouncedCity) {
    fetchWeather(debouncedCity, date);
  }
}, [debouncedCity, date]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const currentIndex = weather?.time.indexOf(`${date}T${time}`) ?? 0;
  const temperature = weather?.temperature_2m[currentIndex];
  const humidity = weather?.relativehumidity_2m[currentIndex];
  const windSpeed = weather?.wind_speed_10m[currentIndex];
  const windDir = weather?.wind_direction_10m[currentIndex];
  const precipitation = weather?.precipitation_probability[currentIndex] ?? 0;
  const cloudcover = weather?.cloudcover[currentIndex] ?? 0;

  const getWeatherIcon = () => {
    if (precipitation > 50) return <WiRain className="text-4xl text-blue-500" />;
    if (cloudcover > 50) return <WiDayCloudy className="text-4xl text-gray-400" />;
    if (temperature > 25) return <WiDaySunny className="text-4xl text-yellow-400" />;
    if (precipitation > 20) return <WiThunderstorm className="text-4xl text-purple-500" />;
    return <WiDaySunny className="text-4xl text-yellow-300" />;
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-center p-2 bg-white text-gray-700 rounded-full shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 border border-gray-200"
        title="Погода"
      >
        <FaCloudRain className="text-3xl" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-[#F0F4F8] rounded-lg shadow-lg p-4 w-[300px] z-50 flex flex-col gap-4"
          >
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Введіть місто"
              className="w-full p-2 border border-gray-300 rounded-md text-[#1E2939] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-[#1E2939] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-[#1E2939] focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}

            {weather && (
              <div className="flex flex-col gap-2 mt-2 text-[#1E2939]">
                <div className="flex items-center gap-2 justify-center">
                  {getWeatherIcon()}
                  <span className="text-xl font-semibold">{temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <WiHumidity className="text-2xl text-blue-500" />
                  <span>{humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <WiWindy className="text-2xl text-purple-500" />
                  <span>{windSpeed} м/с, {windDir}°</span>
                </div>
              </div>
            )}
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}
