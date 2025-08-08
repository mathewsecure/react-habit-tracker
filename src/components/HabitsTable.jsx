import { useEffect, useState } from "react";

const HabitsTable = () => {
  const [habits, setHabits] = useState(
    []
  ); /* Use an array to acces its functions, e.g., map. So we can render the inside later */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST_TEST}/habits`, {
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setHabits(data.habits); /* data is an object, {habits: Array(n)} */
      });
  }, []);

  return (
    <div>
      <div>Calendar Table</div>
      <ul>
        {habits.map((habit) => {
          return (
            <li key={habit.id}>
              <div>{habit.habit}</div>
              <div>{habit.completed}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HabitsTable;
