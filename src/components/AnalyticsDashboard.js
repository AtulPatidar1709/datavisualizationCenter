"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Logout from "./Logout/page.js";
import BarChartComponent from "../app/components/BarChartComponent.js";
import LineChartComponent from "../app/components/LineChartComponent.js";
import Button from "./Button/page.jsx";
import Loader from "./Loader/page.jsx";

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
    const savedFilters = sessionStorage.getItem("filters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

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

  useEffect(() => {
    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  if (loading) {
    return <Loader />;
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
    <div className="flex justify-center items-center">
      <div className="w-[95%]">
        <div className="flex py-2 justify-between items-center">
          <h1 className="font-bold">Analytics Dashboard</h1>
          <Logout />
        </div>

        <div className="flex flex-wrap gap-4 py-4">
          <label className="flex flex-col text-sm font-medium">
            Gender:
            <select
              name="gender"
              onChange={handleFilterChange}
              value={filters.gender}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium">
            Age:
            <select
              name="age"
              onChange={handleFilterChange}
              value={filters.age}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56+">56+</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium">
            Start Date:
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>

          <label className="flex flex-col text-sm font-medium">
            End Date:
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <Button filters={filters} />
        </div>

        {/* Adding gap and fixed height for the charts */}
        <div style={{ marginTop: "20px", height: "400px" }}>
          <BarChartComponent chartData={chartData} />
        </div>

        <div style={{ marginTop: "20px", height: "400px" }}>
          <LineChartComponent chartData={chartData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
