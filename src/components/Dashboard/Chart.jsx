import { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../contexts/ThemeContext";

const Chart = ({ data }) => {
  const { darkMode } = useContext(ThemeContext);

  const defaultData = [
    { name: "Projects", count: 5, color: "#2563eb" },
    { name: "Students", count: 20, color: "#10b981" },
    { name: "Tasks", count: 10, color: "#f97316" },
    { name: "Finished Projects", count: 2, color: "#8b5cf6" },
  ];

  const chartData = data || defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`${
            darkMode
              ? "bg-dark-elevated border-darkBorder"
              : "bg-white border-gray-200"
          } px-4 py-3 rounded-xl shadow-xl border backdrop-blur-sm`}
        >
          <p
            className={`font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {label}
          </p>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-primary-blue" : "text-primary-dark"
            }`}
          >
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`${
        darkMode ? "bg-dark-card" : "bg-white"
      } rounded-2xl p-6 shadow-soft border ${
        darkMode ? "border-darkBorder/30" : "border-gray-200"
      } h-96`}
    >
      <div className="mb-6">
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Dashboard Overview
        </h3>
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-text-muted" : "text-gray-500"
          }`}
        >
          System statistics at a glance
        </p>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorFinished" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? "#262626" : "#e5e7eb"}
            opacity={0.5}
          />
          <XAxis
            dataKey="name"
            stroke={darkMode ? "#9ca3af" : "#6b7280"}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: darkMode ? "#262626" : "#e5e7eb" }}
          />
          <YAxis
            stroke={darkMode ? "#9ca3af" : "#6b7280"}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: darkMode ? "#262626" : "#e5e7eb" }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="url(#colorProjects)">
            {chartData.map((entry, index) => {
              const gradientId = [
                "colorProjects",
                "colorStudents",
                "colorTasks",
                "colorFinished",
              ][index];
              return <Bar key={`cell-${index}`} fill={`url(#${gradientId})`} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
