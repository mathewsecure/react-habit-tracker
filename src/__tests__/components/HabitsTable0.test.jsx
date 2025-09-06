/* https://www.geeksforgeeks.org/reactjs/how-to-create-a-table-in-reactjs/ */
import { useEffect, useState } from "react";
import "./HabitsTable.css";
const HabitsTable0 = () => {
  const [habits, setHabits] = useState(
    []
  ); /* Use an array to acces its functions, e.g., map. So we can render the inside later */
  const [currentPage, setCurrentPage] = useState(1);

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
  const habitsPerPage = 10;
  const indexOfLastHabit = currentPage * habitsPerPage;
  const indexOfFirstHabit = indexOfLastHabit - habitsPerPage;
  const currentHabits = habits.slice(indexOfFirstHabit, indexOfLastHabit);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Habit</th>
            <th>Completion</th>
          </tr>
        </thead>
        <tbody>
          {currentHabits.map((habit) => (
            <tr key={habit.id}>
              <td>{habit.habit}</td>
              <td>{habit.completed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>Habits rendering test</div>
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

export default HabitsTable0;
