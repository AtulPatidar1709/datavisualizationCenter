"use client";

import { BarChart } from "@mui/x-charts";
import axios from "axios";
import { useEffect, useState } from "react";

const AnalyticsDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: "",
    age: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await axios.get(`/api/data?${params}`);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sumData = data.reduce(
    (acc, entry) => {
      acc.A += Number(entry.A) || 0;
      acc.B += Number(entry.B) || 0;
      acc.C += Number(entry.C) || 0;
      acc.D += Number(entry.D) || 0;
      acc.E += Number(entry.E) || 0;
      acc.F += Number(entry.F) || 0;
      return acc;
    },
    { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
  );

  const chartData = [
    { category: "A", value: sumData.A },
    { category: "B", value: sumData.B },
    { category: "C", value: sumData.C },
    { category: "D", value: sumData.D },
    { category: "E", value: sumData.E },
    { category: "F", value: sumData.F },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div style={{ height: "400px", width: "90%" }}>
      <h1>Analytics Dashboard</h1>

      <div>
        <label>
          Gender:
          <select name="gender" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          Age:
          <select name="age" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46-55">46-55</option>
            <option value="56+">56+</option>
          </select>
        </label>

        <label>
          Date Range:
          <input type="date" name="startDate" onChange={handleFilterChange} />
          to
          <input type="date" name="endDate" onChange={handleFilterChange} />
        </label>
      </div>
      <BarChart
        dataset={chartData}
        yAxis={[
          {
            data: ["A", "B", "C", "D", "E", "F"],
            dataKey: "category",
            scaleType: "band",
          },
        ]}
        xAxis={[
          {
            id: "barValues",
            dataKey: "value",
            scaleType: "linear",
          },
        ]}
        series={[{ dataKey: "value", label: "Total" }]}
        layout="horizontal"
      />
    </div>
  );
};

export default AnalyticsDashboard;
