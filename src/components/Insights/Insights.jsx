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
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Habits completed in a month",
        font: { size: 18 },
      },
    },
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
    labels: [
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
    ],
    datasets: [
      {
        label: "Jan 2026",
        data: [28, 30, 15, 31, 20, 10, 5, 28, 30, 15],
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
    <div style={{ width: "500px", margin: "0 auto" }}>
      <Radar data={data} options={options} />
    </div>
  );
};
export default Insights;
