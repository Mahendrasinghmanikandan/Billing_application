/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from "react";
import Sidenavbar from "../navbar/Sidenavbar";
import Navbar from "../navbar/Navbar";
import { useReactToPrint } from "react-to-print";
import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Select,
  Skeleton,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  notification,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  AlibabaOutlined,
  UsergroupDeleteOutlined,
  PrinterOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  createProduct,
  getAllProduct,
  deleteProduct,
  deleteBills,
  getAllBills,
} from "@/utilities/apiHelper";
import { get, isEmpty } from "lodash";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import _ from "lodash";
import PrintBills from "./PrintedBills";
import { useRouter } from "next/router";
import moment from "moment";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import { getAllCustomer } from "@/utilities/apiHelper";
import { useDownloadExcel } from "react-export-table-to-excel";
// import Pdf from "react-to-pdf";

const Bills = () => {
  const [loading, setLoading] = useState(false);
  const [totalBillsData, setTotalBillsData] = useState([]);
  const [searchedBillsData, setSearchedBillsData] = useState([]);
  const [viewBill, setViewBill] = useState(false);
  const [filterActive, setFilterActiveStatus] = useState(false);

  const [data, setData] = useState();
  const [customers, setCustomers] = useState([]);
  const [dateData, setFilterData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const router = useRouter();
  const tableRef = useRef(null);
  const ref = React.createRef();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllBills();
      const customers = await getAllCustomer();
      setTotalBillsData(get(result, "data.data", []));
      setSearchedBillsData(get(result, "data.data", []));
      setCustomers(get(customers, "data.data", []));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      notification.error({ message: "something went wrong" });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (values) => {
    try {
      setLoading(true);
      await deleteBills(values._id);
      toast.success("Bill deleted successfully");
      fetchData();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const handleUpdateClick = async (value) => {
    try {
      router.push({
        pathname: "/generate-bill",
        query: { id: value._id },
      });
    } catch (err) {
      notification.error({ message: "something went wrong" });
    }
  };

  const columns = [
    {
      width: 70,
      ellipsis: true,
      title: "View",
      fixed: "left",
      align: "center",
      render: (values) => {
        return (
          <Tooltip title="view bill">
            <Button
              onClick={() => {
                setViewBill(true), setData(values);
              }}
              type="primary"
              size={"large"}
              className=" hover:!bg-primary !bg-transparent !text-primary !border-2
        hover:!border-primary hover:!text-white flex  items-center gap-x-1 !shadow-inner"
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
        );
      },
    },
    {
      width: 70,
      title: "S.No.",
      fixed: "left",
      align: "center",
      dataIndex: "invoice_number",
      render: (value, items, n) => {
        return <div className="font-semibold">{n + 1}</div>;
      },
    },

    {
      width: 100,
      title: "Invoice No",
      fixed: "left",
      dataIndex: "invoice_number",
      align: "center",
      render: (value) => {
        return <div className="font-bold">{value}</div>;
      },
    },
    {
      width: 100,
      ellipsis: true,
      title: "Invoice Date",
      fixed: "left",
      dataIndex: "invoice_date",
      align: "center",
      render: (value) => {
        return <div className="font-bold">{value}</div>;
      },
    },
    {
      width: 200,
      align: "left",
      ellipsis: true,
      title: "Company Name",
      dataIndex: "company_name",
    },
    {
      width: 150,
      ellipsis: true,
      title: "Vehicle Numbers",
      dataIndex: "dispatch",
    },
    {
      width: 100,
      ellipsis: true,
      title: "Destination",
      dataIndex: "destination",
    },
    {
      width: 150,
      // ellipsis: true,
      title: "GSTIN",
      dataIndex: "gstin",
    },
    {
      width: 150,
      ellipsis: true,
      title: "Products",
      dataIndex: "items",
      render: (res) => {
        return (
          <div className="grid grid-cols-2 gap-1">
            {res.map((res) => {
              return <Tag color="#ff7400">{res.product}</Tag>;
            })}
          </div>
        );
      },
    },
    {
      width: 100,
      ellipsis: true,
      title: "Units",
      dataIndex: "items",
      render: (res) => {
        return (
          <div className="grid grid-cols-2 gap-1">
            {res.map((res) => {
              return <Tag color="#ff9a00">{res.quantity}</Tag>;
            })}
          </div>
        );
      },
    },
    {
      width: 100,
      ellipsis: true,
      title: "Amount",
      dataIndex: "items",
      render: (res) => {
        return parseFloat(
          _.sum(
            res.map((res) => {
              return res.quantity * res.rate;
            })
          )
        ).toFixed(2);
      },
    },
    {
      width: 100,
      ellipsis: true,
      title: "GST",
      dataIndex: "items",
      render: (res) => {
        return parseFloat(
          (_.sum(
            res.map((res) => {
              return res.quantity * res.rate;
            })
          ) /
            100) *
            2.5 *
            2
        ).toFixed(2);
      },
    },
    {
      width: 100,
      ellipsis: true,
      title: "Total Amount",
      render: (res) => {
        return (
          <div className="font-bold">
            {parseFloat(
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
                )
            ).toFixed(2)}
          </div>
        );
      },
    },
    {
      title: "Actions",
      fixed: "right",

      width: 100,
      render: (values) => {
        return (
          <div className="flex items-center space-x-4">
            <Tooltip title="Update Customer">
              <Button
                onClick={() => handleUpdateClick(values)}
                type="primary"
                className="hover:!bg-white bg-transparent !text-green-500 shadow-inner"
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="Delete Customer">
              <Button
                onClick={() => handleDelete(values)}
                type="primary"
                className="hover:!bg-white  bg-transparent !text-red-500  shadow-inner"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleFilter = () => {
    try {
      if (!isEmpty(get(dateData, "[0]", "")) && searchData) {
        const result = totalBillsData.filter((res) => {
          return (
            res.invoice_date
              .split("-")
              .reverse()
              .join("") >=
              get(dateData, "[0]", "")
                .split("-")
                .reverse()
                .join("") &&
            res.invoice_date
              .split("-")
              .reverse()
              .join("") <=
              get(dateData, "[1]", "")
                .split("-")
                .reverse()
                .join("") &&
            res.company_name === searchData
          );
        });
        setSearchedBillsData(result);
      } else if (!isEmpty(get(dateData, "[0]", ""))) {
        const result = totalBillsData.filter((res) => {
          return (
            res.invoice_date
              .split("-")
              .reverse()
              .join("") >=
              get(dateData, "[0]", "")
                .split("-")
                .reverse()
                .join("") &&
            res.invoice_date
              .split("-")
              .reverse()
              .join("") <=
              get(dateData, "[1]", "")
                .split("-")
                .reverse()
                .join("")
          );
        });
        setSearchedBillsData(result);
      } else if (searchData) {
        const result = totalBillsData.filter((res) => {
          return res.company_name === searchData;
        });
        setSearchedBillsData(result);
      } else {
        setSearchedBillsData(totalBillsData);
      }
    } catch (err) {
      notification.error({ message: "something went wrong" });
    }
  };
  useEffect(() => {
    handleFilter();
  }, [searchData, dateData]);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `MSM BILLS BILLS ${
      !isEmpty(get(dateData, "[0]", "")) && searchData
        ? `[${get(dateData, "[0]", "")} to ${get(
            dateData,
            "[1]",
            ""
          )}] ${searchData}`
        : !isEmpty(get(dateData, "[0]", ""))
        ? `[${get(dateData, "[0]", "")} to ${get(dateData, "[1]", "")}]`
        : searchData
    }`,
    sheet: searchedBillsData?.length,
  });

  const handleDatechange = (date, dateStings) => {
    setFilterData(dateStings);
  };

  return (
    <div className="w-[95vw] bg-[#f5f7f6]  h-[90vh] overflow-y-scroll">
      <div className="pl-[2vw] pt-[5vh]">
        <div className="flex justify-between w-[100%]">
          <div className="flex flex-col gap-y-1">
            <div className="text-xl capitalize font-bold">Bills History</div>
            <div>
              <Breadcrumb
                separator=">"
                items={[
                  {
                    title: (
                      <Link href="/">
                        <h1 className="cursor-pointer !text-sm ">Dashboard</h1>
                      </Link>
                    ),
                  },
                  {
                    title: <h1 className="!text-sm">Bills History</h1>,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        {/* rest */}
        <div className="pt-5 gap-1 flex flex-col">
          <div className="bg-white !w-[98%] h-[70px] flex items-center justify-between shadow-lg rounded-lg px-5 ">
            <div className="flex gap-4 pt-2">
              <RangePicker
                format={"DD-MM-YYYY"}
                onChange={handleDatechange}
                className="bg-white font-bold !h-[40px] !w-[25vw] "
              />
              <Select
                showSearch
                allowClear
                placeholder="Select a Company"
                optionFilterProp="children"
                onChange={(e) => setSearchData(e)}
                filterOption={(input, option) =>
                  (option?.value ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                size="large"
                className="!bg-white !h-[50px] !placeholder:font-bold  !w-[20vw] "
              >
                {customers.map((res) => {
                  return (
                    <Select.Option value={res.company_name}>
                      <span className="font-semibold">{res.company_name}</span>
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
            <div className="flex gap-1">
              <div
                onClick={() => {
                  setDownloadStatus(true);
                  setLoading(true);
                  setTimeout(() => {
                    onDownload();
                    setDownloadStatus(false);
                    setLoading(false);
                  }, [1000]);
                }}
              >
                <div
                  type="primary"
                  className="!flex !cursor-pointer disabled  bg-transparent text-primary  justify-center items-center !rounded-lg shadow-2xl"
                >
                  <Image
                    width={100}
                    height={100}
                    src="/images/excel.png"
                    alt="excel"
                    className="w-[50%]"
                  />
                </div>
              </div>
              <div
                onClick={() => {
                  setDownloadStatus(true);
                  setLoading(true);
                  setTimeout(() => {
                    // onDownload();
                    setDownloadStatus(false);
                    setLoading(false);
                  }, [1000]);
                }}
              >
                <div
                  type="primary"
                  className="!flex !cursor-pointer disabled  bg-transparent text-primary  justify-center items-center !rounded-lg shadow-2xl"
                >
                  {/* <Pdf targetRef={ref} filename="code-example.pdf">
                    {({ toPdf }) => ( */}
                  <Image
                    // onClick={toPdf}
                    width={100}
                    height={100}
                    src="/images/pdf.png"
                    alt="excel"
                    className="w-[75%]"
                    hidden
                  />
                  {/* )}
                  </Pdf> */}
                </div>
              </div>
            </div>
          </div>
          <div className="!w-[98%] rounded-lg bg-white shadow-lg" ref={ref}>
            <Table
              className="!p-5"
              ref={tableRef}
              loading={loading}
              dataSource={searchedBillsData}
              columns={
                downloadStatus
                  ? columns.filter((res) => {
                      return !["Actions", "View Bill"].includes(res.title);
                    })
                  : columns
              }
              scroll={{ x: 700 }}
              pagination={
                downloadStatus
                  ? false
                  : { pageSize: 5, position: ["bottomCenter"] }
              }
              size="small"
            />
          </div>
        </div>
      </div>
      {console.log(data, "jgiug")}
      <Modal open={viewBill} footer={false} className="!w-fit" destroyOnClose>
        <PrintBills setViewBill={setViewBill} datas={data} />
      </Modal>
    </div>
  );
};

export default Bills;
