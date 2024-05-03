import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function CryptoChart() {
  const [item, setItem] = useState(JSON.parse(localStorage.getItem("single")));
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "crypto-chart",
        type: "line",
      },
      xaxis: {
        type: "datetime",
      },
    },
    series: [], // Initialize series with an empty array
  });
  console.log(item);

  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data24h, data7d, data30d, data1y] = await Promise.all([
          fetchHistoricalData(item, selectedCurrency, 1), // 24 hours
          fetchHistoricalData(item, selectedCurrency, 7), // 1 week
          fetchHistoricalData(item, selectedCurrency, 30), // 1 month
          fetchHistoricalData(item, selectedCurrency, 365), // 1 year
        ]);

        // Format data for ApexCharts
        const formattedData = {
          options: {
            chart: {
              id: "crypto-chart",
              type: "line",
            },
            xaxis: {
              type: "datetime",
            },
          },
          series: [
            { name: "24 Hours", data: data24h },
            { name: "1 Week", data: data7d },
            { name: "1 Month", data: data30d },
            { name: "1 Year", data: data1y },
          ],
        };

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [selectedCurrency]);

  async function fetchHistoricalData(coinId, vsCurrency, days) {
    try {
      const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.prices; // Extract prices array from response
    } catch (error) {
      console.error("Error fetching historical data:", error);
      return [];
    }
  }

  return (
    <div className="crypto-chart">
      <h2>ExChange for {item} </h2>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={600}
      />
    </div>
  );
}

export default CryptoChart;
