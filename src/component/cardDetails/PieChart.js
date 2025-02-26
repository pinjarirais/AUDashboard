import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = ({ pieData }) => {
    // console.log("pieData",pieData)
  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Current Month Expense",
    },
    series: [
      {
        name: "Current Month Expense",
        data: pieData || [],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
