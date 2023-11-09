import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'chartjs-plugin-datalabels';
import 'chartjs-adapter-moment';
import { Bar } from 'react-chartjs-2';

function BarChart({ data, monthInChart }) {
  const year = monthInChart?.substring(0, 4);
  const month = monthInChart?.substring(5, 7);

  const lastDay = (y, m) => {
    return new Date(y, m, 0).getDate();
  };

  const startDate = `${monthInChart}-01`;
  const endDate = `${monthInChart}-${lastDay(year, month)}`;
  const createDay = useRef();

  const filterData = useCallback(
    (data) => {
      const newData = data?.filter((item) => {
        createDay.current = (item?.createTime.split('T'))[0];
        return createDay.current >= startDate && createDay.current <= endDate;
      });
      return newData?.map((value) => (value?.createTime.split('T'))[0]);
    },
    [endDate, startDate]
  );

  //console.log('data?.map((value) => value?.totalPrice)', data.reduce((total, current) => total += current?.totalPrice, 0))
  [...new Set(filterData(data))]?.map((value) => {
    const totalPrice = data?.reduce((total, cur) => {
      if (value === (cur?.createTime.split('T'))[0]) {
        return (total += cur.totalPrice);
      }
      return total;
    }, 0);
    return totalPrice;
  });

  const [userData, setUserData] = useState({
    //labels: filterData(data),
    labels: [...new Set(filterData(data))],
    datasets: [
      {
        label: 'Doanh thu',
        //data: data?.map((value) => value?.totalPrice),
        data: [...new Set(filterData(data))]?.map((value) => {
          const totalPrice = data?.reduce((total, cur) => {
            if (value === (cur?.createTime.split('T'))[0]) {
              return (total += cur.totalPrice);
            }
            return total;
          }, 0);
          return totalPrice;
        }),
        backgroundColor: ['rgba(75, 192, 192, 1)', '#ecf0f1', '#50AF95', '#f3ba2f', '#2a71d0'],
      },
    ],
  });

  useEffect(() => {
    setUserData({
      //labels: filterData(data),
      labels: [...new Set(filterData(data))],
      datasets: [
        {
          label: 'Doanh thu',
          data: [...new Set(filterData(data))]?.map((value) => {
            const totalPrice = data?.reduce((total, cur) => {
              if (value === (cur?.createTime.split('T'))[0]) {
                return (total += cur.totalPrice);
              }
              return total;
            }, 0);
            return totalPrice;
          }),
          backgroundColor: ['rgba(75, 192, 192, 1)', '#ecf0f1', '#50AF95', '#f3ba2f', '#2a71d0'],
        },
      ],
    });
  }, [data, startDate, endDate, filterData]);

  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: 'white',
      },
    },
    scales: {
      x: {
        min: startDate,
        max: endDate,
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        begenAtZero: true,
      },
    },
  };

  return <Bar options={options} data={userData} />;
}

export default BarChart;
