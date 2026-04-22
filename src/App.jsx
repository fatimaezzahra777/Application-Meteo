import { useEffect, useState } from 'react'
import './App.css'

const WEATHER_CODES = {
  0: { label: 'Ensoleille', icon: '☀️' },
  1: { label: 'Peu nuageux', icon: '🌤️' },
  2: { label: 'Partiellement nuageux', icon: '⛅' },
  3: { label: 'Couvert', icon: '☁️' },
  45: { label: 'Brouillard', icon: '🌫️' },
  48: { label: 'Brouillard givrant', icon: '🌫️' },
  51: { label: 'Bruine legere', icon: '🌦️' },
  53: { label: 'Bruine moderee', icon: '🌦️' },
  55: { label: 'Bruine dense', icon: '🌧️' },
  56: { label: 'Bruine verglacante legere', icon: '🌧️' },
  57: { label: 'Bruine verglacante dense', icon: '🌧️' },
  61: { label: 'Pluie legere', icon: '🌦️' },
  63: { label: 'Pluie moderee', icon: '🌧️' },
  65: { label: 'Forte pluie', icon: '⛈️' },
  66: { label: 'Pluie verglacante legere', icon: '🌧️' },
  67: { label: 'Pluie verglacante forte', icon: '🌧️' },
  71: { label: 'Neige legere', icon: '🌨️' },
  73: { label: 'Neige moderee', icon: '🌨️' },
  75: { label: 'Forte neige', icon: '❄️' },
  77: { label: 'Grains de neige', icon: '🌨️' },
  80: { label: 'Averses legeres', icon: '🌦️' },
  81: { label: 'Averses moderees', icon: '🌧️' },
  82: { label: 'Averses violentes', icon: '⛈️' },
  85: { label: 'Averses de neige legeres', icon: '🌨️' },
  86: { label: 'Averses de neige fortes', icon: '❄️' },
  95: { label: 'Orage', icon: '⛈️' },
  96: { label: 'Orage avec grele legere', icon: '⛈️' },
  99: { label: 'Orage avec grele forte', icon: '⛈️' },
}

const CURRENT_WEATHER_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'wind_speed_10m',
  'weather_code',
  'apparent_temperature',
]

const DAILY_FIELDS = ['weather_code', 'temperature_2m_max', 'temperature_2m_min']
const DEFAULT_CITY = 'Casablanca'

function getWeatherInfo(code) {
  return WEATHER_CODES[code] ?? { label: 'Conditions variables', icon: '🌍' }
}

function formatDay(dateString) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateString))
}

function buildForecast(daily) {
  if (!daily) {
    return []
  }

  return daily.time.map((date, index) => ({
    date,
    min: Math.round(daily.temperature_2m_min[index]),
    max: Math.round(daily.temperature_2m_max[index]),
    weatherCode: daily.weather_code[index],
  }))
 } 

async function fetchWeatherByCity(city) {
  const geocodeResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`,
  )

  if (!geocodeResponse.ok) {
    throw new Error('service-unavailable')
  }

  const geocodeData = await geocodeResponse.json()
  const location = geocodeData.results?.[0]

  if (!location) {
    throw new Error('city-not-found')
  }

  const forecastResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=${CURRENT_WEATHER_FIELDS.join(',')}&daily=${DAILY_FIELDS.join(',')}&forecast_days=5&timezone=auto`,
  )

  if (!forecastResponse.ok) {
    throw new Error('service-unavailable')
  }

  const forecastData = await forecastResponse.json()

  return {
    location,
    forecastData,
  }
}

function App() {
  const [query, setQuery] = useState(DEFAULT_CITY)
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function loadWeather(city) {
    setStatus('loading')
    setError('')

    try {
      const { location, forecastData } = await fetchWeatherByCity(city)
      const current = forecastData.current
      const currentWeather = getWeatherInfo(current.weather_code)

      setWeather({
        city: location.name,
        country: location.country,
        admin1: location.admin1,
        timezone: forecastData.timezone,
        current: {
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          apparentTemperature: Math.round(current.apparent_temperature),
          description: currentWeather.label,
          icon: currentWeather.icon,
        },
        forecast: buildForecast(forecastData.daily),
      })
      setQuery(location.name)
      setStatus('success')
    } catch (requestError) {
      setStatus('error')
      setWeather(null)

      if (requestError instanceof Error && requestError.message === 'city-not-found') {
        setError('Ville introuvable. Verifiez l orthographe puis relancez la recherche.')
        return
      }

      setError('Le service meteo est momentanement indisponible. Merci de reessayer.')
    }
  }

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      loadWeather(DEFAULT_CITY)
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setError('Veuillez saisir une ville.')
      setStatus('error')
      setWeather(null)
      return
    }

    loadWeather(trimmedQuery)
  }

  const todayWeather = weather?.current

  return (
    <main className="weather-app">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Application meteo en temps reel</p>
          <h1>Consultez la meteo d une ville en quelques secondes.</h1>
          <p className="hero-text">
            Recherchez une ville et visualisez les conditions actuelles ainsi que
            les previsions des prochains jours dans une interface simple,
            rapide et responsive.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="city-search">
              Rechercher une ville
            </label>
            <input
              id="city-search"
              name="city"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Exemple : Casablanca, Paris, Tokyo"
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>

          {error ? <p className="feedback error">{error}</p> : null}
          {!error && status === 'loading' ? (
            <p className="feedback">Chargement des donnees meteo...</p>
          ) : null}
        </div>

        <div className="hero-card">
          <div className="hero-card__header">
            <p className="hero-card__label">Conditions actuelles</p>
            {weather ? (
              <p className="hero-card__place">
                {weather.city}
                {weather.admin1 ? `, ${weather.admin1}` : ''}, {weather.country}
              </p>
            ) : (
              <p className="hero-card__place">En attente de donnees</p>
            )}
          </div>

          <div className="hero-card__body">
            <span className="hero-card__icon" aria-hidden="true">
              {todayWeather?.icon ?? '⛅'}
            </span>
            <div>
              <strong className="hero-card__temp">
                {todayWeather ? `${todayWeather.temperature}°C` : '--'}
              </strong>
              <p className="hero-card__desc">
                {todayWeather?.description ?? 'Aucune ville selectionnee'}
              </p>
            </div>
          </div>

          <div className="hero-card__meta">
            <div>
              <span>Ressenti</span>
              <strong>{todayWeather ? `${todayWeather.apparentTemperature}°C` : '--'}</strong>
            </div>
            <div>
              <span>Humidite</span>
              <strong>{todayWeather ? `${todayWeather.humidity}%` : '--'}</strong>
            </div>
            <div>
              <span>Vent</span>
              <strong>{todayWeather ? `${todayWeather.windSpeed} km/h` : '--'}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard">
        <article className="panel panel-current">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Meteo actuelle</p>
              <h2>Conditions detaillees</h2>
            </div>
            <p className="timezone">{weather ? weather.timezone : 'Timezone locale'}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Temperature</span>
              <strong>{todayWeather ? `${todayWeather.temperature}°C` : '--'}</strong>
            </div>
            <div className="stat-card">
              <span>Humidite</span>
              <strong>{todayWeather ? `${todayWeather.humidity}%` : '--'}</strong>
            </div>
            <div className="stat-card">
              <span>Vent</span>
              <strong>{todayWeather ? `${todayWeather.windSpeed} km/h` : '--'}</strong>
            </div>
            <div className="stat-card">
              <span>Description</span>
              <strong>{todayWeather?.description ?? '--'}</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Previsions</p>
              <h2>5 prochains jours</h2>
            </div>
          </div>

          <div className="forecast-grid">
            {weather?.forecast?.length ? (
              weather.forecast.map((day) => {
                const info = getWeatherInfo(day.weatherCode)

                return (
                  <div className="forecast-card" key={day.date}>
                    <p className="forecast-day">{formatDay(day.date)}</p>
                    <span className="forecast-icon" aria-hidden="true">
                      {info.icon}
                    </span>
                    <p className="forecast-label">{info.label}</p>
                    <p className="forecast-temp">
                      <strong>{day.max}°</strong> / <span>{day.min}°</span>
                    </p>
                  </div>
                )
              })
            ) : (
              <p className="empty-state">
                Les previsions s afficheront ici apres une recherche valide.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
