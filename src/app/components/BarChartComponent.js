"use client";

import { Chart } from "react-charts";

const BarChartComponent = ({ chartData }) => {
  // Define primary axis (categories)
  const primaryAxis = {
    getValue: (datum) => datum.category,
    position: "left",
    label: "Categories",
  };

  // Define secondary axis (values)
  const secondaryAxes = [
    {
      getValue: (datum) => datum.value,
      position: "bottom",
      stacked: true,
      label: "Values",
    },
  ];

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Chart
        options={{
          data: [
            {
              data: chartData,
              label: "Data",
            },
          ],
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
};

export default BarChartComponent;
