import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { totalApartMent } from "../../service/apartment.service";

const PieChartApartment = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await totalApartMent();
      if (response?.data?.result) {
        const result = response.data.result;

        // Đếm số lượng theo status
        const statusCount = {
          Residential: 0,
          Business: 0,
          Vacant: 0,
        };

        result.forEach((apartment) => {
          const status = apartment.status;
          if (statusCount.hasOwnProperty(status)) {
            statusCount[status]++;
          } else {
            statusCount[status] = 1; // Nếu có loại mới
          }
        });

        const labels = Object.keys(statusCount);
        const series = Object.values(statusCount);

        const options = {
          labels: labels,
          colors: ["#33B5E5", "#FFBB33", "#FF4444", "#AA66CC"], // màu tùy ý
          chart: { type: "donut" },
          legend: {
            position: "bottom",
            labels: {
              colors: "#333", // màu chữ
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: { show: true },
                  value: { show: true },
                },
              },
            },
          },
        };

        setChartData({ series, options });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {chartData.series.length > 0 ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          height={270}
        />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default PieChartApartment;
