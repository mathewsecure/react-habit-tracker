import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Habits from "../components/Habits/Habits";
import { apiFetch } from "../utils/apiFetch";

vi.mock("../utils/apiFetch", () => ({
  apiFetch: vi.fn(),
}));

let mockDate = new Date("2026-06-21T12:00:00");

vi.useFakeTimers({ shouldAdvanceTime: true });
vi.setSystemTime(mockDate);

function createMockData(habitCount) {
  const habits = Array.from({ length: habitCount }, (_, i) => ({
    id: i + 1,
    habit: `Habit ${i + 1}`,
    completed: 0,
    date: "2026-04-07T05:20:07.000Z",
    user_id: 1,
  }));

  const todayChecks = habits.map((h, i) => ({
    id: i + 1,
    habit_id: h.id,
    completion_check: 0,
  }));

  return { habits, todayChecks };
}

describe("Habits component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the daily checklist title", async () => {
    const { habits, todayChecks } = createMockData(10);

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates") return Promise.resolve({ dates: [] });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({ completion_checks: todayChecks });
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    await waitFor(() => {
      expect(screen.getByText("Daily checklist")).toBeDefined();
    });
  });

  it("shows today's date in the table header", async () => {
    const { habits, todayChecks } = createMockData(10);

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates") return Promise.resolve({ dates: [] });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({ completion_checks: todayChecks });
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    await waitFor(() => {
      expect(screen.getByText(/2026-06-21/)).toBeDefined();
    });
  });

  it("displays 10 habits with unchecked checkboxes", async () => {
    const { habits, todayChecks } = createMockData(10);

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates") return Promise.resolve({ dates: [] });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({ completion_checks: todayChecks });
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    await waitFor(() => {
      expect(screen.getByText("Habit 1")).toBeDefined();
      expect(screen.getByText("Habit 10")).toBeDefined();
    });

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(10);
    checkboxes.forEach((cb) => {
      expect(cb.checked).toBe(false);
    });
  });

  it("changes checkbox state on toggle", async () => {
    const { habits, todayChecks } = createMockData(10);

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates") return Promise.resolve({ dates: [] });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({ completion_checks: todayChecks });
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    let checkboxes;
    await waitFor(() => {
      checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(10);
    });

    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      const updated = screen.getAllByRole("checkbox");
      expect(updated[0].checked).toBe(true);
    });
  });

  it('shows "1 of 1" when there are exactly 10 habits', async () => {
    const { habits, todayChecks } = createMockData(10);

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates") return Promise.resolve({ dates: [] });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({ completion_checks: todayChecks });
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    await waitFor(() => {
      expect(screen.getByText(/1 of 1/)).toBeDefined();
    });

    expect(screen.getByText("Prev").disabled).toBe(true);
    expect(screen.getByText("Next").disabled).toBe(true);
  });

  it("shows new habit input when fewer than 10 habits exist", async () => {
    const { habits, todayChecks } = createMockData(9);

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates") return Promise.resolve({ dates: [] });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({ completion_checks: todayChecks });
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    await waitFor(() => {
      expect(screen.getByLabelText("Enter habit name")).toBeDefined();
    });
  });

  it("creates a new habit via the input field", async () => {
    let currentCount = 9;

    apiFetch.mockImplementation((endpoint, method, body) => {
      if (endpoint === "habits" && method === "GET") {
        const { habits } = createMockData(currentCount);
        return Promise.resolve({ habits });
      }
      if (endpoint === "dates") return Promise.resolve({ dates: [] });
      if (endpoint === "habits-history" && method === "GET") {
        const { todayChecks } = createMockData(currentCount);
        return Promise.resolve({ completion_checks: todayChecks });
      }
      if (endpoint === "habits" && method === "POST") {
        currentCount = 10;
        return Promise.resolve({ affectedRows: 1 });
      }
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    await waitFor(() => {
      expect(screen.getByLabelText("Enter habit name")).toBeDefined();
    });

    const input = screen.getByLabelText("Enter habit name");
    fireEvent.change(input, { target: { value: "New Habit" } });
    fireEvent.submit(input.closest("form"));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "habits",
        "POST",
        expect.objectContaining({ habit: "New Habit" })
      );
    });
  });

  it("shows same 10 habits on day 1 and day 2 with all unchecked", async () => {
    const habits = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      habit: `Habit ${i + 1}`,
      completed: 0,
      date: "2026-04-07T05:20:07.000Z",
      user_id: 1,
    }));

    const day1Checks = habits.map((h, i) => ({
      id: i + 1,
      habit_id: h.id,
      completion_check: 0,
    }));

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates")
        return Promise.resolve({ dates: [{ date: "2026-06-21" }] });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({ completion_checks: day1Checks });
      return Promise.resolve({ affectedRows: 1 });
    });

    const { unmount } = render(<Habits />);

    await waitFor(() => {
      expect(screen.getAllByRole("checkbox")).toHaveLength(10);
    });

    let checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) => {
      expect(cb.checked).toBe(false);
    });

    unmount();

    vi.setSystemTime(new Date("2026-06-22T12:00:00"));

    const day2Checks = habits.map((h, i) => ({
      id: i + 11,
      habit_id: h.id,
      completion_check: 0,
    }));

    apiFetch.mockImplementation((endpoint, method) => {
      if (endpoint === "habits") return Promise.resolve({ habits });
      if (endpoint === "dates")
        return Promise.resolve({
          dates: [{ date: "2026-06-21" }, { date: "2026-06-22" }],
        });
      if (endpoint === "habits-history" && method === "GET")
        return Promise.resolve({
          completion_checks: [...day1Checks, ...day2Checks],
        });
      return Promise.resolve({ affectedRows: 1 });
    });

    render(<Habits />);

    await waitFor(() => {
      const cbs = screen.getAllByRole("checkbox");
      expect(cbs.length).toBe(10);
    });

    expect(screen.getByText(/2026-06-22/)).toBeDefined();

    const allCbs = screen.getAllByRole("checkbox");
    allCbs.forEach((cb) => {
      expect(cb.checked).toBe(false);
    });

    habits.forEach((h) => {
      expect(screen.getByText(h.habit)).toBeDefined();
    });
  });
});
