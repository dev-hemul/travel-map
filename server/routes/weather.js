import axios from 'axios';
import express from 'express';

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/cities', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input: query,
          types: '(cities)',
          language: 'uk',
          key: GOOGLE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/weather', async (req, res) => {
  const { city, date } = req.query;
  try {
    // Спочатку координати
    const geoRes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: { address: city, key: GOOGLE_API_KEY },
    });

    if (!geoRes.data.results.length) return res.status(404).json({ error: 'Місто не знайдено' });

    const { lat, lng } = geoRes.data.results[0].geometry.location;

    // Погода
    const weatherRes = await axios.get(`https://api.open-meteo.com/v1/gfs`, {
      params: {
        latitude: lat,
        longitude: lng,
        hourly:
          'temperature_2m,relativehumidity_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,cloudcover',
        start_date: date,
        end_date: date,
        timezone: 'auto',
      },
    });

    res.json(weatherRes.data.hourly);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
