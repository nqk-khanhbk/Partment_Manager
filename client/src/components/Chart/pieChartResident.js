import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { totalResident } from "../../service/resident.service";

const PieChartResident = () => {
  const [series, setSeries] = useState([0, 0, 0]);

  const [options] = useState({
    chart: {
      type: "pie",
    },
    labels: ["Resident", "Temporary", "Absent"],
    colors: ["#00E396", "#FEB019", "#FF4560"],
    legend: {
      position: "bottom",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await totalResident();
        const result = res?.data?.result;

        if (Array.isArray(result)) {
          let countResident = 0;
          let countTemporary = 0;
          let countAbsent = 0;

          result.forEach((item) => {
            if (item.status === "Resident") countResident++;
            else if (item.status === "Temporary") countTemporary++;
            else if (item.status === "Absent") countAbsent++;
          });

          setSeries([countResident, countTemporary, countAbsent]);
        } else {
          console.warn("Không có dữ liệu hợp lệ để vẽ biểu đồ");
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu cư dân:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Chart options={options} series={series} type="pie" width="320" />
    </div>
  );
};

export default PieChartResident;
