import React, { useState, useEffect } from "react";
import Sidenavbar from "../navbar/Sidenavbar";
import Navbar from "../navbar/Navbar";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Input,
  Spin,
  Table,
  Tooltip,
  notification,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  AlibabaOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  createCustomer,
  getAllCustomer,
  deleteCustomer,
  updateCustomer,
} from "@/utilities/apiHelper";
import { get, isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";

const Customer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateID, setUpdateID] = useState();

  const { TextArea } = Input;
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const allCustomerData = await getAllCustomer();
      setCustomerData(get(allCustomerData, "data.data", []));
      setSearchData(get(allCustomerData, "data.data", []));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFinish = async (value) => {
    try {
      if (updateID) {
        setLoading(true);
        const formData = {
          value,
          id: updateID,
        };
        await updateCustomer(formData);
        notification.success({ message: "customer updated successfully" });
        setOpenDrawer(false);
        form.resetFields();
        fetchData();
        setLoading(false);
        setUpdateID();
      } else {
        setLoading(true);
        await createCustomer(value);
        toast.success("customer created successfully");
        setOpenDrawer(false);
        form.resetFields();
        fetchData();
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteCustomer(id);
      toast.success("customer deleted successfully");
      fetchData();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    setOpenDrawer(false);
    setUpdateID();
    form.resetFields();
  };

  const handleUpdate = (values) => {
    setOpenDrawer(true);
    setUpdateID(get(values, "_id", ""));
    form.setFieldsValue(values);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "_id",
    },

    {
      title: "Customer Phone Number (primary)",
      dataIndex: "company_phone",
      key: "_id",
    },
    {
      title: "Gst Number",
      dataIndex: "gst_number",
      key: "_id",
    },
    {
      title: "Company Address",
      dataIndex: "company_address",
      key: "_id",
    },
    {
      title: "Phone Number(secondary)",
      dataIndex: "vechicle_number",
      key: "_id",
    },
    {
      title: "Company Email Id",
      dataIndex: "company_email",
      key: "_id",
    },
    {
      title: "Actions",
      width: 100,
      render: (values) => {
        return (
          <div className="flex items-center space-x-4">
            <Tooltip title="Update Customer">
              <Button
                onClick={() => handleUpdate(values)}
                type="primary"
                className="hover:!bg-white bg-transparent !text-green-500 shadow-inner"
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="Delete Customer">
              <Button
                onClick={() => handleDelete(get(values, "_id", ""))}
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
  const handleChange = (value) => {
    try {
      let search = value.target.value;

      const result = customerData.filter((res) => {
        return (
          res.company_address
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          res.company_phone
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          res.company_name
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          res.vechicle_number
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          res.gst_number.toLowerCase().includes(search.toString().toLowerCase())
        );
      });
      setSearchData(result);
    } catch (err) {
      setSearchData(customerData);
      notification.error({ message: "something went wrong" });
    }
  };

  return (
    <div className="w-[95vw] bg-[#f5f7f6]  h-[90vh]">
      <div className="pl-[2vw] pt-[5vh]">
        <div className="flex justify-between w-[100%]">
          <div className="flex flex-col gap-y-1">
            <div className="text-xl capitalize font-bold">Customer</div>
            <div>
              <Breadcrumb
                separator=">"
                items={[
                  {
                    title: (
                      <Link href="/">
                        <h1 className="cursor-pointer ">Dashboard</h1>
                      </Link>
                    ),
                  },
                  {
                    title: <h1>Customer</h1>,
                  },
                ]}
              />
            </div>
          </div>
          <div>
            <div class="w-[20vw]">
              <div class="relative flex items-center w-full h-12 rounded-lg hover:shadow-sm shadow-lg bg-white overflow-hidden">
                <div class="grid place-items-center h-full w-12 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  onChange={handleChange}
                  class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                  type="text"
                  id="search"
                  placeholder="Search Customers"
                />
              </div>
            </div>
          </div>
          <div className="pr-11 flex space-x-4 ">
            <Tooltip title="Add Customers">
              <Button
                type="primary"
                className="hover:!bg-primary bg-transparent text-primary"
                icon={<UserAddOutlined />}
                onClick={() => setOpenDrawer(true)}
              />
            </Tooltip>
          </div>
        </div>
        {/* rest */}
        <div className="!pt-[6vh]">
          <div className="!w-[98%]  rounded-lg bg-white p-10">
            <Table
              dataSource={searchData}
              columns={columns}
              loading={{
                spinning: loading,
                indicator: (
                  <AlibabaOutlined className="animate-bounce !text-7xl !text-primary" />
                ),
              }}
              size="large"
              className=" p-1"
              pagination={{
                size: "small",
                pageSize: 8,
              }}
            />
          </div>
        </div>
      </div>

      <Drawer
        open={openDrawer}
        destroyOnClose
        width={800}
        header={false}
        title={
          <div className="!text-lg  !font-bold !uppercase flex items-center space-x-2">
            {updateID ? (
              <UsergroupDeleteOutlined className="!text-primary" />
            ) : (
              <UserAddOutlined className="!text-primary" />
            )}

            <h1 className="!text-lg  !font-bold capitalize">
              {updateID ? "Update" : "Add"} Customers Here
            </h1>
          </div>
        }
      >
        <div>
          <Form
            layout="vertical"
            size="large"
            form={form}
            onFinish={handleFinish}
          >
            <div className="flex flex-col gap-y-2">
              {/* buttons */}
              <div className="flex items-center w-[100%] justify-end space-x-5 pb-2">
                <Button
                  onClick={handleCancel}
                  loading={loading}
                  type="primary"
                  size="large"
                  className=" hover:!bg-primary !bg-transparent !text-primary !border-2  hover:!border-primary   hover:!text-white  "
                >
                  cancel
                </Button>
                <Button
                  loading={loading}
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="border-2 !bg-primary hover:!bg-transparent hover:!text-primary hover:!border-2 hover:!border-primary   text-white  !hover:bg-red-700"
                >
                  {updateID ? "Update" : "Save"}
                </Button>
              </div>
              <div className="flex  gap-x-10">
                {/* left */}
                <div className="!w-[47vw]">
                  <Form.Item
                    className="!w-[100%]"
                    label={<div className="!font-bold">Company Name</div>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter a company name",
                      },
                    ]}
                    name="company_name"
                  >
                    <Input
                      placeholder="Company Name"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2"
                    />
                  </Form.Item>
                  <Form.Item
                    className="!w-[100%]"
                    label={
                      <div className="!font-bold">Customer Phone (primary)</div>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please enter a customer phone number",
                      },
                    ]}
                    name="company_phone"
                  >
                    <Input
                      placeholder="Customer Phone (primary)"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2"
                    />
                  </Form.Item>

                  <Form.Item
                    className="!w-[100%]"
                    label={<div className="!font-bold">GST Number</div>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter a GST number",
                      },
                    ]}
                    name="gst_number"
                  >
                    <Input
                      placeholder="GST Number"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2 "
                    />
                  </Form.Item>
                  <Form.Item
                    className="!w-[100%]"
                    label={
                      <div className="!font-bold">Phone Number (secondary)</div>
                    }
                    name="vechicle_number"
                  >
                    <Input
                      placeholder="Phone Number(secondary)"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2 "
                    />
                  </Form.Item>
                  <Form.Item
                    className="!w-[100%]"
                    label={<div className="!font-bold">Customer Email Id</div>}
                    name="company_email"
                  >
                    <Input
                      placeholder="Customer Email Id"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2 "
                    />
                  </Form.Item>
                </div>
                {/* right */}
                <div className="!w-[47vw]">
                  <Form.Item
                    className="!w-[100%]"
                    label={<div className="!font-bold">Company Address</div>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter company address",
                      },
                    ]}
                    name="company_address"
                  >
                    <TextArea
                      rows={6}
                      placeholder="Company Address"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2 "
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
    </div>
  );
};

export default Customer;
