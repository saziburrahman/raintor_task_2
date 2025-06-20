import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

interface LocationPayload {
  userName: string;
  lat: number;
  lon: number;
}

export function useSignalR(userName: string) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [locations, setLocations] = useState<LocationPayload[]>([]);

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://tech-test.raintor.com/Hub")
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.error("SignalR Connection Error:", err));

    hubConnection.on("ReceiveLatLon", (payload: LocationPayload) => {
      setLocations((prev) => {
        const others = prev.filter((loc) => loc.userName !== payload.userName);
        return [...others, payload];
      });
    });

    setConnection(hubConnection);

    return () => {
      hubConnection.stop();
    };
  }, []);

  // Send location method
  const sendLocation = (lat: number, lon: number) => {
    if (!connection) return;
    connection.invoke("SendLatLon", lat, lon, userName).catch(console.error);
  };

  return { locations, sendLocation };
}
