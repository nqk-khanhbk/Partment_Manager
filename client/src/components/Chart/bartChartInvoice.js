import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { totalAmount } from "../../service/invoices.service";

const BartChartInvoice = () => {
  const [option, setOption] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await totalAmount();
        const data = res?.data || [];

        const categories = data.map((item) => item.name);
        const totalAmounts = data.map((item) => item.totalAmount);
        const paidAmounts = data.map((item) => item.paidAmount);
        const contributionAmounts = data.map((item) => item.contributionAmount);

        setOption({
          title: {
            text: "Biểu đồ thu các loại phí căn hộ",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            data: ["Tổng phí", "Đã thanh toán", "Đóng góp"],
            bottom: 0,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: categories,
            axisLabel: {
              interval: 0,
              rotate: 20,
            },
          },
          yAxis: {
            type: "value",
            name: "Số tiền (VNĐ)",
          },
          series: [
            {
              name: "Tổng phí",
              type: "bar",
              data: totalAmounts,
              itemStyle: {
                color: "#5470C6",
              },
            },
            {
              name: "Đã thanh toán",
              type: "bar",
              data: paidAmounts,
              itemStyle: {
                color: "#91CC75",
              },
            },
            {
              name: "Đóng góp",
              type: "bar",
              data: contributionAmounts,
              itemStyle: {
                color: "#FAC858",
              },
            },
          ],
        });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu hóa đơn:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ReactECharts option={option} style={{ height: 500 }} />
    </div>
  );
};

export default BartChartInvoice;
