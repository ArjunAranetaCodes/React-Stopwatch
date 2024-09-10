import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import SettingsButton from "./SettingsButton";
import { useContext, useState, useEffect, useRef } from "react";
import SettingsContext from "./SettingsContext";
import createAndSaveDailyTotal from "./createAndSaveDailyTotal";

const red = "#f54e4e";
const green = "#4aec8c";

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work"); // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(0);
  //for getting the totals of daily work
  const [dailyTotals, setDailyTotals] = useState(() => {
    const storedTotals = localStorage.getItem("dailyTotals");
    return storedTotals ? parseInt(storedTotals) : 0;
  });

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    secondsLeftRef.current--;
    localStorage.setItem("localNextSeconds", secondsLeftRef.current);
    setSecondsLeft(secondsLeftRef.current);
    console.log(localStorage.getItem("localNextSeconds"));
  }

  useEffect(() => {
    function switchMode() {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds =
        (nextMode === "work"
          ? settingsInfo.workMinutes
          : settingsInfo.breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = getSecondsFromLocalAndNext();
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        //console.log("isPausedRef.current");
        return;
      }
      if (secondsLeftRef.current === 0) {
        //console.log("secondsLeftRef.current");
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  // Update the daily totals and save them to local storage
  useEffect(() => {
    if (secondsLeft === 0) {
      createAndSaveDailyTotal();
      setDailyTotals(
        (prevTotals) => prevTotals + settingsInfo.workMinutes * 60
      );
      localStorage.setItem("dailyTotals", dailyTotals.toString());
      console.log("dailyTotals", localStorage.getItem("dailyTotals"));
    }
  }, [secondsLeft]);

  function getSecondsFromLocalAndNext() {
    if (
      localStorage.getItem("localNextSeconds") <
        settingsInfo.workMinutes * 60 &&
      localStorage.getItem("localNextSeconds") > 0
    ) {
      return localStorage.getItem("localNextSeconds");
    } else {
      return settingsInfo.workMinutes * 60;
    }
  }

  useEffect(() => {
    //localStorage Seconds and nextSeconds
    setSecondsLeft(getSecondsFromLocalAndNext());
    console.log(localStorage.getItem("localNextSeconds"));
  }, []);

  const totalSeconds =
    mode === "work" ? secondsLeft : settingsInfo.breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  console.log(seconds);

  if (seconds < 10) seconds = "0" + seconds;

  return (
    <div className="relative">
      <CircularProgressbar
        value={percentage}
        text={minutes + ":" + seconds}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: mode === "work" ? red : green,
          tailColor: "rgba(255,255,255,.2)",
        })}
      />
      <div className="absolute inset-0 flex items-center justify-center mt-[150px] ml-[20px]">
        {isPaused ? (
          <PlayButton
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
      </div>
      <div className="absolute flex items-center justify-center mt-[50px]">
        <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
      </div>
    </div>
  );
}

export default Timer;
