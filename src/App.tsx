import { LocationReceiver } from "./components/Reciever";
import { LocationSender } from "./components/Sender";

export default function App() {
  return (
    <div>
      <h1>Real-Time Location Sharing Demo</h1>
      <div style={{ display: "flex", gap: "2rem" }}>
        <LocationSender />
        <LocationReceiver />
      </div>
    </div>
  );
}
