import { useEffect, useState } from "react";
import "../../components/HabitsTable.css";

const HabitsTableTests = () => {
  const [habits, setHabits] = useState([]); // Use an array to acces its functions, e.g., map. So we can render the inside later
  const [dates, setDates] = useState([]);
  const [completionChecks, setCompletionChecks] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = useState(true);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST_TEST}/habits-history`, {
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

  var totalPages = Math.ceil(completionChecks.length / 10);

  const handlePageChange = (page, start, end) => {
    setCurrentPage(page);
    setEnd(end);
    setStart(start);

    if (page === totalPages) {
      setIsNextButtonDisabled(true);
    } else {
      setIsNextButtonDisabled(false);
    }
    if (page === 1) {
      setIsPrevButtonDisabled(true);
    } else {
      setIsPrevButtonDisabled(false);
    }
  };

  const date = new Date();
  let dateNoSpaces = date.toISOString().substring(0, 10);

  var dateObjToString = dates.map((date) => date["date"]);
  if (!dateObjToString.includes(date)) {
    dateObjToString.push(dateNoSpaces);
  }

  console.log("[fetch] habits", habits);
  console.log("[fetch] dates: ", dates);
  console.log("[fetch] completionChecks", completionChecks);

  console.log("currentPage: ", currentPage);

  console.log("dateObjToString: ", dateObjToString);
  console.log("dateNoSpaces", dateNoSpaces);

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
          {completionChecks.slice(start, end).map((check) => (
            <tr key={check}>
              <td></td>
              <td>
                {check.completion_check}
                <input type="checkbox" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() =>
            handlePageChange(currentPage - 1, start - 10, end - 10)
          }
          disabled={isPrevButtonDisabled}
        >
          Previous
        </button>
        <button
          onClick={() =>
            handlePageChange(currentPage + 1, start + 10, end + 10)
          }
          disabled={isNextButtonDisabled}
        >
          Next
        </button>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default HabitsTableTests;
