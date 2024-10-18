"use client";

import { LineChart } from "@mui/x-charts";

const LineChartComponent = ({ chartData }) => {
  return (
    <LineChart
      dataset={chartData}
      xAxis={[
        {
          dataKey: "category",
          scaleType: "band",
          label: "Category",
        },
      ]}
      yAxis={[
        {
          dataKey: "value",
          scaleType: "linear",
          label: "Total",
        },
      ]}
      series={[{ dataKey: "value", type: "line" }]}
    />
  );
};

export default LineChartComponent;
