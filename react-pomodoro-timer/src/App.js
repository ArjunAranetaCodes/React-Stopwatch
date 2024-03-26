import './App.css';
import Timer from "./Timer";
import Settings from "./Settings";
import {useState} from "react";
import SettingsContext from "./SettingsContext";

function App() {
  const DEFAULT_WORK_MINUTES_VALUE = 45;
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(() => {
    const storedTimeSetting = localStorage.getItem('workMinutes');
    return storedTimeSetting ? JSON.parse(storedTimeSetting) : DEFAULT_WORK_MINUTES_VALUE;
  });
  const [breakMinutes, setBreakMinutes] = useState(15);

  return (
    <main>
      <SettingsContext.Provider value={{
        showSettings,
        setShowSettings,
        workMinutes,
        breakMinutes,
        setWorkMinutes,
        setBreakMinutes,
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}

export default App;
