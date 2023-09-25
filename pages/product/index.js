/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import Sidenavbar from "../navbar/Sidenavbar";
import Navbar from "../navbar/Navbar";
import {
  Breadcrumb,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Skeleton,
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
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
} from "@/utilities/apiHelper";
import { get, isEmpty } from "lodash";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const Product = () => {
  const [openModal, setOpenModal] = useState(false);
  const [productData, setProductData] = useState([]);
  const [searchProductData, setSearchProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateID, setUpdateID] = useState();

  const [form] = Form.useForm();
  const { Meta } = Card;

  const fetchData = async () => {
    try {
      setLoading(true);
      const allProductData = await getAllProduct();
      setProductData(get(allProductData, "data.data", []));
      setSearchProductData(get(allProductData, "data.data", []));
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
        await updateProduct(formData);
        notification.success({ message: "product updated successfully" });
        setOpenModal(false);
        form.resetFields();
        fetchData();
        setLoading(false);
        setUpdateID();
      } else {
        setLoading(true);
        await createProduct(value);
        toast.success("product created successfully");
        setOpenModal(false);
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
      await deleteProduct(id);
      toast.success("product deleted successfully");
      fetchData();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setUpdateID();
    form.resetFields();
  };

  const handleUpdate = (values) => {
    setOpenModal(true);
    setUpdateID(get(values, "_id", ""));
    form.setFieldsValue(values);
  };

  const handleChange = (value) => {
    setLoading(true);
    const search = value.target.value;
    try {
      setSearchProductData(
        productData.filter((res) => {
          return res.product_name
            .toLowerCase()
            .includes(search.toString().toLowerCase());
        })
      );
    } catch (err) {
      setSearchProductData(productData);
      setLoading(false);
      notification.error({ message: "something went wrong" });
    }
    setLoading(false);
  };

  return (
    <div className="w-[95vw] bg-[#f5f7f6]  h-[90vh] overflow-y-scroll">
      <div className="pl-[2vw] pt-[5vh]">
        <div className="flex justify-between w-[90vw]">
          <div className="flex flex-col gap-y-1">
            <div className="text-xl capitalize font-bold">Products</div>
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
                    title: <h1>Products</h1>,
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
                  placeholder="Search Products"
                />
              </div>
            </div>
          </div>
          <div className="pr-11 flex space-x-4 ">
            <Tooltip title="Add Products">
              <Button
                type="primary"
                className="hover:!bg-primary bg-transparent text-primary"
                icon={<UserAddOutlined />}
                onClick={() => setOpenModal(true)}
              />
            </Tooltip>
          </div>
        </div>
        {/* rest */}
        <div className="pt-[5vh]  flex justify-center items-center flex-wrap gap-10">
          {searchProductData.map((res, index) => {
            return (
              <>
                <motion.div
                  key={index}
                  className="pt-[2vh]"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <Card
                    style={{
                      width: 300,
                      height: 170,
                    }}
                    className="!shadow-lg !border-none hover:!shadow-inner"
                    actions={[
                      <Tooltip title="Update Product">
                        <Button
                          onClick={() => handleUpdate(res)}
                          type="primary"
                          className="hover:!bg-white bg-transparent !text-green-500 shadow-inner"
                          icon={<EditOutlined />}
                        />
                      </Tooltip>,
                      <Tooltip title="Delete Product">
                        <Button
                          onClick={() => handleDelete(get(res, "_id", ""))}
                          type="primary"
                          className="hover:!bg-white  bg-transparent !text-red-500  shadow-inner"
                          icon={<DeleteOutlined />}
                        />
                      </Tooltip>,
                    ]}
                  >
                    <Skeleton loading={loading} active>
                      <Meta
                        title={<h1>{res.product_name}</h1>}
                        description={<h1>{res.quantity}</h1>}
                      />
                    </Skeleton>
                  </Card>
                </motion.div>
              </>
            );
          })}
        </div>
      </div>

      <Modal
        open={openModal}
        destroyOnClose
        width={500}
        footer={false}
        title={
          <div className="!text-lg  !font-bold !uppercase flex items-center space-x-2">
            {updateID ? (
              <UsergroupDeleteOutlined className="!text-primary" />
            ) : (
              <UserAddOutlined className="!text-primary" />
            )}

            <h1 className="!text-lg  !font-bold capitalize">
              {updateID ? "Update" : "Add"} Products Here
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
            <div className="flex flex-col gap-y-1">
              {/* buttons */}

              <div className="flex  gap-x-10 pt-10">
                {/* left */}
                <div className="!w-[47vw]">
                  <Form.Item
                    className="!w-[100%]"
                    label={<div className="!font-bold">Product Name</div>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter a product name",
                      },
                    ]}
                    name="product_name"
                  >
                    <Input
                      placeholder="Product Name"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2"
                    />
                  </Form.Item>
                  <Form.Item
                    className="!w-[100%]"
                    label={<div className="!font-bold">Quantity</div>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter a product quantity",
                      },
                    ]}
                    name="quantity"
                  >
                    <Input
                      placeholder="Quantity"
                      className="p-2 !outline-primary !border-2 focus:!border-primary
                hover:!border-primary hover:border-2 focus:border-2"
                    />
                  </Form.Item>
                </div>
                {/* right */}
              </div>
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
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Product;
