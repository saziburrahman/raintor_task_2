import { useEffect, useState } from "react";
import { useSignalR } from "../hooks/useSignalR";

export function LocationSender() {
  const userName = "rahmansazib72@gmail.com";
  const { sendLocation } = useSignalR(userName);

  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition({ lat, lon });
        sendLocation(lat, lon);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [sendLocation]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!position) {
    return <div>Getting your location...</div>;
  }

  return (
    <div>
      <h2>User A - Sending Real Location</h2>
      <p>Latitude: {position.lat.toFixed(6)}</p>
      <p>Longitude: {position.lon.toFixed(6)}</p>
      <p>Sending updates in real-time...</p>
    </div>
  );
}
