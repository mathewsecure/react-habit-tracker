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

  // Map latest check per habit (highest id = most recent = today's)
  const latestCheckByHabit = {};
  completionChecks.forEach((check) => {
    const existing = latestCheckByHabit[check.habit_id];
    if (!existing || check.id > existing.id) {
      latestCheckByHabit[check.habit_id] = check;
    }
  });

  // Build today's rows: every habit mapped to its latest check (or unchecked)
  const todayRows = habits.map((habit) => {
    const check = latestCheckByHabit[habit.id];
    return {
      habit,
      check: check || {
        id: `virtual-${habit.id}`,
        habit_id: habit.id,
        completion_check: 0,
      },
    };
  });

  const totalPages = Math.ceil(todayRows.length / habitsPerPage);
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

  async function toggleCheck(row) {
    if (isToggling.current) return;
    isToggling.current = true;

    const previousChecks = completionChecks;

    if (typeof row.check.id === "string" && row.check.id.startsWith("virtual-")) {
      isToggling.current = false;
      return;
    }

    setCompletionChecks((prev) =>
      prev.map((c) =>
        c.id === row.check.id
          ? { ...c, completion_check: c.completion_check ? 0 : 1 }
          : c
      )
    );

    try {
      await apiFetch("habits-history", "PUT", {
        id: row.check.id,
        date: todaysDate,
      });
    } catch (error) {
      setCompletionChecks(previousChecks);
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
            {todayRows.slice(start, end).map((row) => (
              <tr key={row.habit.id}>
                <td>{row.habit.habit}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={!!row.check.completion_check}
                    onChange={() => toggleCheck(row)}
                  />
                </td>
              </tr>
            ))}
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
