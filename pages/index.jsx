import React, { useState, useEffect } from "react";
import Sidenavbar from "./navbar/Sidenavbar";
import Navbar from "./navbar/Navbar";
import millify from "millify";
import {
  Button,
  Col,
  Divider,
  Row,
  Skeleton,
  Statistic,
  Table,
  Tag,
  Tooltip,
  notification,
} from "antd";
import CountUp from "react-countup";
import { EyeOutlined, CaretRightOutlined } from "@ant-design/icons";
import { getAllBills, getAllCounts } from "@/utilities/apiHelper";
import { get, uniq, groupBy } from "lodash";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
ChartJS.register(...registerables);

const Home = () => {
  const [allCounts, setAllCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billDatas, setBillDatas] = useState([]);

  const router = useRouter();

  const formatter = (value) => <CountUp end={value} separator="," />;

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllCounts();
      const allBills = await getAllBills();
      setBillDatas(get(allBills, "data.data", []));
      setAllCounts(get(result, "data.data", []));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      notification.error({ message: "something went wrong" });
    }
  };

  useEffect(() => {
    if (!Cookies.get("__utief_")) {
      router.push("/authentication");
    }
    fetchData();
  }, []);

  const columns = [
    {
      title: "Invoice No",
      dataIndex: "invoice_number",
      render: (value) => {
        return <div className="font-bold">{value}</div>;
      },
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      title: "Customer Name",
      dataIndex: "company_name",
    },

    {
      title: "Total Amount",
      render: (res) => {
        return (
          <Tooltip
            title={
              Number(
                _.sum(
                  res.items?.map((data) => {
                    return data.rate * data.quantity;
                  })
                ) / 100
              ) *
                2.5 *
                2 +
              _.sum(
                res.items?.map((data) => {
                  return data.rate * data.quantity;
                })
              )
            }
          >
            <div className="font-bold">
              {millify(
                Number(
                  _.sum(
                    res.items?.map((data) => {
                      return data.rate * data.quantity;
                    })
                  ) / 100
                ) *
                  2.5 *
                  2 +
                  _.sum(
                    res.items?.map((data) => {
                      return data.rate * data.quantity;
                    })
                  )
              )}
            </div>
          </Tooltip>
        );
      },
    },
  ];

  // Counts Bar Chart Data

  const data = {
    labels: allCounts.map((res) => {
      return res.name;
    }),
    datasets: [
      {
        label: "Counts",
        backgroundColor: "#ff9c38",
        borderColor: "#ff5f1f",
        borderWidth: 1,
        hoverBackgroundColor: "#ffdbb7",
        hoverBorderColor: "#ff5f1f",
        data: allCounts.map((res) => {
          return res.count;
        }),
      },
    ],
  };

  let raw = billDatas.map((res) => {
    return {
      total:
        (_.sum(
          res.items?.map((data) => {
            return data.rate * data.quantity;
          })
        ) /
          100) *
          2.5 *
          2 +
        _.sum(
          res.items?.map((data) => {
            return data.rate * data.quantity;
          })
        ),
      date: res.invoice_date,
    };
  });

  let ans = [];

  uniq(
    billDatas.map((res) => {
      return res.invoice_date;
    })
  ).map((res, index) => {
    let total = 0;
    raw.map((res2) => {
      if (res === res2.date) {
        total += Number(res2.total);
      }
    });
    ans[index] = total;
  });

  const datas = {
    labels: uniq(
      billDatas.map((res) => {
        return res.invoice_date;
      })
    ),
    datasets: [
      {
        label: "revenue",
        backgroundColor: "#ff9c38",
        // borderColor: "#ff5f1f",
        // borderWidth: 1,
        hoverBackgroundColor: "#ffdbb7",
        hoverBorderColor: "#ff5f1f",
        data: ans,
      },
    ],
  };

  return (
    <div className="w-[95vw] h-[90vh] flex-col bg-[#f5f7f6]   overflow-y-scroll">
      <div className="p-4 flex flex-col gap-5">
        {/* <div className="font-bold text-2xl text-primary  p-2">Dashboard</div> */}
        <div className="flex gap-5">
          {/* left */}
          <div className="w-[50vw] bg-white rounded-2xl shadow-lg p-10">
            <h1 className="font-bold pb-4">Revenue Chart</h1>
            <div className="  flex flex-wrap gap-10">
              <Line data={datas} width={100} height={50} />
            </div>
          </div>
          {/* right */}
          <div className="w-[50vw] bg-white rounded-2xl shadow-lg p-10">
            <h1 className="font-bold pb-10 pl-2">All Data Counts</h1>
            <div className="  flex flex-wrap gap-10">
              <Bar data={data} width={100} height={50} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <div className="w-[50vw] min-h-[500px] bg-white rounded-2xl shadow-lg p-10">
            <h1 className="font-bold">Recent Five Bills</h1>
            <Table
              loading={loading}
              dataSource={billDatas}
              columns={columns}
              pagination={{ pageSize: 5, position: ["topRight"] }}
              size="middle"
            />
          </div>
          <div className="w-[50vw] min-h-[500px] bg-white rounded-2xl shadow-lg p-10">
            <h1 className="font-bold">Recent Five Customers</h1>
            <Table
              loading={loading}
              dataSource={billDatas}
              columns={columns}
              pagination={{ pageSize: 5, position: ["topRight"] }}
              size="middle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
