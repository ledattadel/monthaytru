import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function getDate(string) {
  const date = string?.split('T')[0]?.split('-');
  const dateReturn = `${date[2]}/${date[1]}/${date[0]}`;
  return dateReturn;
}

function BarChart({ data, startDate, endDate }) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let createDay;

  const filterData = (data) => {
    const newData = data?.filter((item) => {
      createDay = new Date(item?.createAt);
      return createDay >= start && createDay <= end;
    });
    return newData.map((value) => getDate(value?.createAt));
  };

  const [userData, setUserData] = useState({
    labels: filterData(data),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map((data) => data?.cart?.[0]?.totalPrice),
        backgroundColor: ['rgba(75, 192, 192, 1)', '#ecf0f1', '#50AF95', '#f3ba2f', '#2a71d0'],
      },
    ],
  });

  useEffect(() => {
    setUserData({
      labels: filterData(data),
      datasets: [
        {
          label: 'Doanh thu',
          data: data.map((data) => data?.cart?.[0]?.totalPrice),
          backgroundColor: ['rgba(75, 192, 192, 1)', '#ecf0f1', '#50AF95', '#f3ba2f', '#2a71d0'],
        },
      ],
    });
  }, [data, startDate, endDate]);

  return <Bar data={userData} />;
}

export default BarChart;
