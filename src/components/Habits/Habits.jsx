import { useEffect, useRef, useState } from "react";
import "./Habits.css";
import { apiFetch } from "../../utils/apiFetch";
import { TextField, Stack, Typography, Container } from "@mui/material";

const habitsPerPage = 10;

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [completionChecks, setCompletionChecks] = useState([]);
  const [todaysDate, setTodaysDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newHabit, setNewHabit] = useState("");

  const isLoaded = useRef(false);
  const isToggling = useRef(false);

  const todayChecks = completionChecks.slice(-habits.length);
  const totalPages = Math.ceil(todayChecks.length / habitsPerPage);
  const start = (currentPage - 1) * habitsPerPage;
  const end = start + habitsPerPage;
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages || totalPages === 0;

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    const dataLoader = async () => {
      try {
        const [habitsData, datesData] = await Promise.all([
          apiFetch("habits", "GET", null),
          apiFetch("dates", "GET", null),
        ]);

        const todayISO = new Intl.DateTimeFormat("sv-SE").format(new Date());
        const dateExists = datesData.dates.some((obj) => obj.date === todayISO);

        if (!dateExists) {
          await apiFetch(`dates/${todayISO}`, "POST", null);
          await apiFetch("habits-history", "POST", { date: todayISO });
          setDates([...datesData.dates, { date: todayISO }]);
        } else {
          setDates(datesData.dates);
        }

        const historyData = await apiFetch("habits-history", "GET", null);

        setHabits(habitsData.habits);
        setCompletionChecks(historyData.completion_checks);
        setTodaysDate(todayISO);
      } catch (error) {
        console.error(error);
      }
    };

    dataLoader();
  }, []);

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  async function toggleCheck(id, date) {
    if (isToggling.current) return;
    isToggling.current = true;

    const idx = completionChecks.findIndex((c) => c.id === id);
    if (idx === -1) {
      isToggling.current = false;
      return;
    }

    const previousValue = completionChecks[idx].completion_check;
    const updated = [...completionChecks];
    updated[idx] = { ...updated[idx], completion_check: previousValue ? 0 : 1 };
    setCompletionChecks(updated);

    try {
      await apiFetch("habits-history", "PUT", { id, date });
    } catch (error) {
      const reverted = [...completionChecks];
      reverted[idx] = { ...reverted[idx], completion_check: previousValue };
      setCompletionChecks(reverted);
      console.error("Error at updating check", error);
    } finally {
      isToggling.current = false;
    }
  }

  async function handleNewHabitSubmit(e) {
    e.preventDefault();
    if (!newHabit.trim()) return;

    try {
      await apiFetch("habits", "POST", {
        habit: newHabit.trim(),
        completed: "0",
      });
      setNewHabit("");
      const habitsData = await apiFetch("habits", "GET", null);
      setHabits(habitsData.habits);
    } catch (error) {
      console.error("Error creating habit", error);
    }
  }

  return (
    <div>
      <Stack
        direction="column"
        spacing={5}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm" />

        <Typography variant="h5" gutterBottom>
          Daily checklist
        </Typography>

        {habits.length < 10 && (
          <form onSubmit={handleNewHabitSubmit}>
            <TextField
              id="new-habit"
              label="Enter habit name"
              variant="filled"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              slotProps={{ htmlInput: { "data-testid": "new-habit-input" } }}
            />
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Habit</th>
              <th>Completion date: {todaysDate}</th>
            </tr>
          </thead>
          <tbody>
            {todayChecks.slice(start, end).map((check) => {
              const habit = habits.find((h) => h.id === check.habit_id);
              return (
                <tr key={check.id}>
                  <td>{habit?.habit || "Unknown"}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!check.completion_check}
                      onChange={() => toggleCheck(check.id, todaysDate)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "flex-end",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div>
            {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isPrevDisabled}
          >
            Prev
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isNextDisabled}
          >
            Next
          </button>
        </Stack>
      </Stack>
    </div>
  );
};

export default Habits;
