import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineChart = ({ categories, data }) => {
  // console.log("data",data)
  const options = {
    // title: {
    //   text: "Monthly Expense Data",
    // },
    // xAxis: {
    //   categories: categories || [],
    // },
    // yAxis: {
    //   title: {
    //     text: "Sales (in USD)",
    //   },
    // },
    title: {
        text: "",
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
      yAxis: {
        title: {
          text: "Sales (in USD)",
        },
      },
    series: [
      {
        name: "Sales",
        data: data || [],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;