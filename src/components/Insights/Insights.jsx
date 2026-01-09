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
    fetchMonths();
  }, []);
  const handleDropdown = (event) => {
    setSelectedMonth(event.target.value);
  };
  function habitNames() {
    //never changes
    return [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running",
      "Guitar",
      "Saying hello",
      "Karate",
    ];
  }

  const habitsData = {
    "2026-01": [1, 30, 15, 31, 20, 10, 5, 28, 30, 15],
    "2026-02": [20, 10, 5, 15, 30, 25, 10, 12, 10, 20],
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
    labels: habitNames(),
    datasets: [
      {
        data: habitsData[selectedMonth],
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
