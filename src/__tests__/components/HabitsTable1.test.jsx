/**
 *
 * updater function (pass a function not the result of calling it)
 * https://react.dev/learn/queueing-a-series-of-state-updates#what-happens-if-you-update-state-after-replacing-it
 *
 */

import { useEffect, useState } from "react";
import "../../components/HabitsTable.css";

const HabitsTable2 = () => {
  const [habits, setHabits] = useState([]); // Use an array to acces its functions, e.g., map. So we can render the inside later
  const [dates, setDates] = useState([]);
  const [completionChecks, setCompletionChecks] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = useState(true);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);

  const [date, setDate] = useState({ date: "" });

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

  useEffect(() => {
    //todo: add an object with a property date (to be able to then add it to dates state)
    const newDate = new Date();
    let dateToISOString = newDate.toISOString().substring(0, 10); //fix use user timezone for that 1 day
    setDate({ date: dateToISOString });
    console.log("date state", date.date);
  }, []);

  var dateObjToString = dates.map((date) => date["date"]); //todo: change everything that uses dateObjToString into dates state

  var totalPages = Math.ceil(completionChecks.length / 10);
  const habitsPerPage = 10;

  //todo: fix only add one date at a time (also for the fetch below) (use useState)
  useEffect(() => {
    if (!dates.some((object) => object.date === date.date)) {
      setDates([...dates, date.date]); // https://react.dev/learn/updating-arrays-in-state
      fetch(`${import.meta.env.VITE_API_HOST_TEST}/dates/${date}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
        },
      });

      fetch(`${import.meta.env.VITE_API_HOST_TEST}/habits-history/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
        },
        body: JSON.stringify({ date: date }),
      });
    }
  }, [date]);

  function handlePageChange(page, start, end) {
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
  }

  function toggleCheck(inputId, inputDate) {
    fetch(`${import.meta.env.VITE_API_HOST_TEST}/habits-history/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
      },
      body: JSON.stringify({ id: inputId, date: inputDate }),
    });
  }

  console.log("[fetch] habits", habits);
  console.log("[fetch] dates: ", dates);
  console.log("[fetch] completionChecks", completionChecks);
  console.log("currentPage: ", currentPage);
  console.log("dateObjToString: ", dateObjToString);
  console.log("dateToISOString", date);

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
          {completionChecks.slice(start, end).map((check) => {
            // todo: need to update selectAllCompletionChecks endpoint to get habit_id in desc order
            const habitEqualsCheck = habits.find(
              (habit) => habit.id == check.habit_id
            ); // store name of habit, to later show it
            return (
              <tr key={check.id}>
                <td>{habitEqualsCheck.habit}</td>
                <td>
                  {check.completion_check}
                  <input
                    type="checkbox"
                    checked={!!check.completion_check}
                    onChange={() =>
                      toggleCheck(check.id, dateObjToString[currentPage - 1])
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button
          onClick={() =>
            handlePageChange(
              currentPage - 1,
              start - habitsPerPage,
              end - habitsPerPage
            )
          }
          disabled={isPrevButtonDisabled}
        >
          Previous
        </button>
        <button
          onClick={() =>
            handlePageChange(
              currentPage + 1,
              start + habitsPerPage,
              end + habitsPerPage
            )
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

export default HabitsTable2;
