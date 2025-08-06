import { useEffect, useState } from "react";

export const HabitsTable = () => {
  const [habits, setHabits] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST_TEST}/habits`, {
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setHabits(data);
      });
  }, []);

  return <div>{/* add habits table */}</div>;
};

export default HabitsTable;
