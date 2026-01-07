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
import { useState } from "react";
import { Radar } from "react-chartjs-2";

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
  const dates = ["2025-12", "2026-01"];
  const [date, setDate] = useState(dates[0]);
  const handleDropdown = (event) => {
    setDate(event.target.value);
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
    "2025-12": [1, 30, 15, 31, 20, 10, 5, 28, 30, 15],
    "2026-01": [20, 10, 5, 15, 30, 25, 10, 12, 10, 20],
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
        data: habitsData[date],
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
      <label for="date-select"></label>
      <select
        name="date"
        id="date-select"
        value={date}
        onChange={handleDropdown}
      >
        {dates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      <Radar data={data} options={options} />
    </div>
  );
};
export default Insights;
