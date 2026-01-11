//https://react-chartjs-2.js.org/examples/radar-chart

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import { apiFetch } from "../../utils/apiFetch";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

const Insights = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [habitNames, setHabitNames] = useState([]);
  const [habitsData, setHabitsData] = useState([]);

  useEffect(() => {
    const fetchMonths = async () => {
      const response = await apiFetch("dates", "GET", null);
      const formattedMonths = response.dates.map((d) => d.date.slice(0, 7));
      const uniqueMonths = [...new Set(formattedMonths)];
      setMonths(uniqueMonths);
      if (uniqueMonths.length > 0) {
        setSelectedMonth(uniqueMonths[0]);
      }
    };
    const fetchHabitNames = async () => {
      const response = await apiFetch("habits", "GET", null);
      const names = response.habits.map((h) => h.habit);
      setHabitNames(names);
    };
    fetchMonths();
    fetchHabitNames();
  }, []);

  useEffect(() => {
    const fetchHabitsHistory = async () => {
      if (!selectedMonth) return;
      const response = await apiFetch(
        `habits-history/${selectedMonth}`,
        "GET",
        null
      );
      setHabitsData(response[selectedMonth] || []);
    };
    fetchHabitsHistory();
  }, [selectedMonth]);

  const handleDropdown = (event) => {
    setSelectedMonth(event.target.value);
  };

  const options = {
    responsive: true,
    scales: {
      //https://www.chartjs.org/docs/latest/axes/radial/
      r: {
        min: 0,
        max: 35,
        ticks: {
          stepSize: 5,
          backdropColor: "transparent",
        },
        pointLabels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const data = {
    labels: habitNames,
    datasets: [
      {
        data: habitsData,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
    ],
  };

  return (
    <div>
      <h2>Habits completed in a month</h2>
      <label for="month-select"></label>
      <select
        name="month"
        id="month-select"
        value={selectedMonth}
        onChange={handleDropdown}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <Radar data={data} options={options} />
    </div>
  );
};
export default Insights;
