'use client';

import { useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

const LocationComponent = () => {
  const [location, setLocation] = useState<{ latitude: number, longitude: number, accuracy: number } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError("");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      // Error callback
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permission to access location was denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Request to get location timed out');
            break;
          default:
            setError('An unknown error occurred');
        }
        setLoading(false);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <button
        onClick={getLocation}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <MapPin size={20} />
        )}
        {loading ? 'Getting Location...' : 'Get My Location'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {location && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>
          <p><strong>Accuracy:</strong> {location.accuracy} meters</p>
        </div>
      )}
    </div>
  );
};

export default LocationComponent;