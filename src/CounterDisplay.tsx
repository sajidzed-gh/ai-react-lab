import type React from "react";

type props = {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

export default function CounterDisplay({ count, setCount }: props) {
  return (
    <>
      <h2>Counter from Child {count}, hmmm!</h2>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment from Child +
      </button>
    </>
  );
}
