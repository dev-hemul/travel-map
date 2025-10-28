import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaCloudRain } from 'react-icons/fa';
import { WiHumidity, WiWindy, WiRain, WiDaySunny, WiDayCloudy, WiThunderstorm } from 'react-icons/wi';
import { useDebounce } from "use-debounce";

export default function WeatherWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState("Kyiv");
  const [suggestions, setSuggestions] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("12:00");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debouncedCity] = useDebounce(city, 600);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Пошук міст 
  const fetchCitySuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:4000/cities`, { params: { query } });
      if (res.data.status === "OK") {
        setSuggestions(res.data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Помилка при пошуку міст:", err);
      setSuggestions([]);
    }
  };

  // Отримання погоди 
  const fetchWeather = async (cityInput, selectedDate) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/weather`, {
        params: { city: cityInput, date: selectedDate }
      });
      setWeather(res.data);
    } catch (error) {
      console.error("Помилка при отриманні погоди:", error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitySuggestions(debouncedCity);
  }, [debouncedCity]);

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

  const currentIndex = weather?.time?.indexOf(`${date}T${time}`) ?? 0;
  const temperature = weather?.temperature_2m?.[currentIndex];
  const humidity = weather?.relativehumidity_2m?.[currentIndex];
  const windSpeed = weather?.wind_speed_10m?.[currentIndex];
  const windDir = weather?.wind_direction_10m?.[currentIndex];
  const precipitation = weather?.precipitation_probability?.[currentIndex] ?? 0;
  const cloudcover = weather?.cloudcover?.[currentIndex] ?? 0;

  const getWeatherIcon = () => {
    if (precipitation > 50) return <WiRain className="text-4xl text-blue-500" />;
    if (cloudcover > 50) return <WiDayCloudy className="text-4xl text-gray-400" />;
    if (temperature > 25) return <WiDaySunny className="text-4xl text-yellow-400" />;
    if (precipitation > 20) return <WiThunderstorm className="text-4xl text-purple-500" />;
    return <WiDaySunny className="text-4xl text-yellow-300" />;
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
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
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Введіть місто"
                className="w-full p-2 border border-gray-300 rounded-md text-[#1E2939] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto z-50"
                  >
                    {suggestions.map((s) => (
                      <li
                        key={s.place_id}
                        onClick={() => {
                          setCity(s.description);
                          setSuggestions([]);
                          fetchWeather(s.description, date);
                        }}
                        className="p-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700"
                      >
                        {s.description}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, "0");
                return (
                  <option key={hour} value={`${hour}:00`}>
                    {hour}:00
                  </option>
                );
              })}
            </select>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <motion.div
                    className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  <p className="mt-3 text-sm text-gray-500">Завантаження...</p>
                </motion.div>
              ) : weather ? (
                <motion.div
                  key="weather"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2 mt-2 text-[#1E2939]"
                >
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
                    <span>
                      {windSpeed} м/с, {windDir}°
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
