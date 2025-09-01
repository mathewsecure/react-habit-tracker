/* https://www.geeksforgeeks.org/reactjs/how-to-create-a-table-in-reactjs/ */

/*  
    body: JSON.stringify({ username: "example" }),
    https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
*/

import { useEffect, useState } from "react";
import "../../components/HabitsTable.css";

const HabitsTable310825 = () => {
  const [habits, setHabits] = useState([]); // Use an array to acces its functions, e.g., map. So we can render the inside later
  const [dates, setDates] = useState([]);
  const [completionChecks, setCompletionChecks] = useState([]);
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

  const checksPerPage = 10;
  const indexOfLastCheck = currentPage * checksPerPage;
  const indexOfFirstCheck = indexOfLastCheck - checksPerPage;
  const currentChecks = completionChecks.slice(
    indexOfFirstCheck,
    indexOfLastCheck
  );

  const date = new Date();
  let dateNoSpaces = date.toISOString().substring(0, 10);

  var dateObjToString = dates.map((date) => date["date"]);
  if (!dateObjToString.includes(date)) {
    dateObjToString.push(date.toDateString());
  }

  console.log("habits", habits);
  console.log("currentChecks", currentChecks);
  console.log("dates: ", dates);
  console.log("dateObjToString: ", dateObjToString);
  console.log("currentPage: ", currentPage);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST_TEST}/habits-history/2025-08-25`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setCompletionChecks(
          data.completion_checks
        ); /* data is an object, {completion_checks: Array(n)} */
      });
  }, []);

  const completionChecksToInt = completionChecks.map(
    (completionCheck) => completionCheck["completion_check"]
  );

  console.log("completionChecks", completionChecks);
  console.log("completionChecksToInt", completionChecksToInt);
  console.log("dateNoSpaces", dateNoSpaces);
  /* test */

  /* test */
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
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td>{habit.habit}</td>
              <td>
                <input type="checkbox" id={habit.id} />
              </td>
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
          disabled={currentPage === Math.ceil(habits.length / checksPerPage)}
        >
          Next
        </button>
        <div>
          Page {currentPage} of {Math.ceil(habits.length / checksPerPage)}
        </div>
      </div>
    </div>
  );
};

export default HabitsTable310825;
