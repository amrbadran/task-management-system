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

const Chart = ({ data }) => {
  // Default data if none provided
  const defaultData = [
    { name: "Projects", count: 5, color: "#4B5F65" },
    { name: "Students", count: 20, color: "#1E5B8D" },
    { name: "Tasks", count: 10, color: "#6B532B" },
    { name: "Finished Projects", count: 2, color: "#473C70" },
  ];

  const chartData = data || defaultData;

  return (
    <div className="w-full h-80">
      <p className="text-center text-gray-400 mb-2">Admin Dashboard Overview</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ color: "#ccc" }} />
          <Bar dataKey="count" name="Count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
