import React, { useEffect, useState } from "react";
import { getDashboardStatistics } from "../services/authService";

interface DashboardStatistic {
  totalUsers: number;
  activeUsersToday: number;
  avgActiveUsersLast7Days: number;
}

const DashboardStatistic: React.FC = () => {
  const [statistic, setStatistic] = useState<DashboardStatistic>({
    totalUsers: 0,
    activeUsersToday: 0,
    avgActiveUsersLast7Days: 0,
  });

  useEffect(() => {
    const fetchStatistic = async () => {
      try {
        // const response = await axios.get("/api/dashboard-statistic");
        const response = await getDashboardStatistics();
        setStatistic(response.data);
      } catch (err) {
        console.error("Error fetching dashboard statistic:", err);
      }
    };

    fetchStatistic();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">Statistic</h2>
      <div className="flex justify-between">
        <p>Total Users: {statistic.totalUsers}</p>
        <p>Active Users Today: {statistic.activeUsersToday}</p>
        <p>
          Average Active Users in Last 7 Days:{" "}
          {statistic.avgActiveUsersLast7Days}
        </p>
      </div>
    </div>
  );
};

export default DashboardStatistic;
