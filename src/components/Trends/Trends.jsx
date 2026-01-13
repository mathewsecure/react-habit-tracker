import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { apiFetch } from "../../utils/apiFetch";
import { Stack, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Trends = () => {
  const [streaks, setStreaks] = useState([]);
  useEffect(() => {
    const getStreaks = async () => {
      try {
        const result = await apiFetch("habits-history/streaks", "GET", null);
        setStreaks(result);
      } catch (error) {
        console.error("Error fetching streaks:", error);
      }
    };

    getStreaks();
  }, []);
  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: streaks.map((item) => item.habit),
    datasets: [
      {
        data: streaks.map((item) => item.streak),
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgb(255, 99, 132)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Stack
      direction="column"
      spacing={8}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Likely to be an habit{" "}
      </Typography>
      <Bar data={data} options={options} />
    </Stack>
  );
};

export default Trends;
