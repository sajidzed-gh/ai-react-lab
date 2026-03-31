import { useState, useEffect } from "react";
import CounterDisplay from "./CounterDisplay";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [autoSaveToggle, setAutoSaveToggle] = useState(false);

  useEffect(() => {
    if (!autoSaveToggle) return;

    setLastSavedTime(new Date());
  }, [count, autoSaveToggle]);

  return (
    <div>
      <h2>{count}</h2>
      <button
        onClick={() => {
          setCount((prevCount) => prevCount + 1);
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          setCount((prevCount) => prevCount - 1);
        }}
      >
        -
      </button>
      <button
        onClick={() => {
          setCount(0);
        }}
      >
        Reset
      </button>
      <input
        type="text"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
      />
      <button
        onClick={() => {
          setCount(Number(prompt("Enter a new value:") || 0));
        }}
      >
        Set Value
      </button>
      Last Saved time{" "}
      {lastSavedTime ? lastSavedTime.toLocaleTimeString() : "N/A"}
      <button onClick={() => setAutoSaveToggle(!autoSaveToggle)}>
        Auto Save {autoSaveToggle ? "ON" : "OFF"}{" "}
      </button>
      <CounterDisplay count={count} setCount={setCount}></CounterDisplay>
    </div>
  );
}
