/* https://www.geeksforgeeks.org/reactjs/how-to-create-a-table-in-reactjs/ */
import { useEffect, useState } from "react";
import "./HabitsTable.css";

const HabitsTable = () => {
  const [habits, setHabits] = useState(
    []
  ); /* Use an array to acces its functions, e.g., map. So we can render the inside later */
  const [dates, setDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST_TEST}/habits`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setHabits(data.habits); /* data is an object, {habits: Array(n)} */
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST_TEST}/dates`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setDates(data.dates); /* data is an object, {dates: Array(n)} */
      });
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const habitsPerPage = 10;
  const indexOfLastHabit = currentPage * habitsPerPage;
  const indexOfFirstHabit = indexOfLastHabit - habitsPerPage;
  const currentHabits = habits.slice(indexOfFirstHabit, indexOfLastHabit);

  const date = new Date();
  var dateObjToString = dates.map((date) => date["date"]);

  if (!dateObjToString.includes(date)) {
    dateObjToString.push(date.toDateString());
  }

  console.log("dates: ", dates);
  console.log("dateObjToString: ", dateObjToString);
  console.log("currentPage: ", currentPage);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Habit</th>
            <th>Completion date: {dateObjToString[currentPage - 1]}</th>
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
      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(habits.length / habitsPerPage)}
        >
          Next
        </button>
        <div>
          Page {currentPage} of {Math.ceil(habits.length / habitsPerPage)}
        </div>
      </div>
    </div>
  );
};

export default HabitsTable;
