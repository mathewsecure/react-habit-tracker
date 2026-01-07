/**
 *
 * updater function (pass a function not the result of calling it)
 * https://react.dev/learn/queueing-a-series-of-state-updates#what-happens-if-you-update-state-after-replacing-it
 *
 */

import { useEffect, useRef, useState } from "react";
import "./Habits.css";
import { apiFetch } from "../../utils/apiFetch";

const Habits = () => {
  //API call states
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [completionChecks, setCompletionChecks] = useState([]);

  //Todays date state
  const [date, setDate] = useState({ date: "" });

  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = useState(true);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);

  //Constants
  const habitsPerPage = 10;
  const totalPages = Math.ceil(completionChecks.length / habitsPerPage);
  const dateObjToString = dates.map((date) => date["date"]);
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
  async function toggleCheck(inputId, inputDate) {
    try {
      await apiFetch("habits-history/", "PUT", {
        id: inputId,
        date: inputDate,
      });
    } catch (error) {
      console.error("Error at updating check", error);
    }
  }
  const isLoaded = useRef(false);
  //logsAndDateLoader logic
  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;
    const dataLoader = async () => {
      try {
        const habitsData = await apiFetch("habits", "GET", null);
        const datesData = await apiFetch("dates", "GET", null);

        const todayISO = new Date().toISOString().substring(0, 10);
        const dateExists = datesData.dates.some((obj) => obj.date === todayISO);
        //If date doesnt exists add date and habits logs (If none of the dates in the Dates array is equal to today´s date add it to the Dates array)
        if (!dateExists) {
          await apiFetch(`dates/${todayISO}`, "POST", null);
          await apiFetch("habits-history/", "POST", { date: todayISO });
          // Add todays date to the Dates array
          setDates([...datesData.dates, { date: todayISO }]); //https://react.dev/learn/updating-arrays-in-state
        } else {
          // If date already exists use the one Get got
          setDates(datesData.dates);
        }

        //Fetch history with created date (if it was created)
        const historyData = await apiFetch("habits-history", "GET", null);

        setHabits(habitsData.habits);
        setCompletionChecks(historyData.completion_checks);
        setDate({ date: todayISO });

        //Temporary solution (todo: reedo navigation button logic)
        const total = Math.ceil(
          historyData.completion_checks.length / habitsPerPage
        );
        if (total <= 1) {
          setIsNextButtonDisabled(true);
        } else {
          setIsNextButtonDisabled(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    dataLoader();
  }, []);

  console.log(date);
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
          {
            // Get the first 10 habits logs
            completionChecks.slice(start, end).map((check) => {
              // Store name of habit to later show it
              const habitEqualsCheck = habits.find(
                (habit) => habit.id == check.habit_id
              ); // todo: need to update selectAllCompletionChecks endpoint to get habit_id in desc order
              return (
                <tr key={check.id}>
                  <td>{habitEqualsCheck?.habit}</td>
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
            })
          }
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

export default Habits;
