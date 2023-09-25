/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from "react";
import Sidenavbar from "../navbar/Sidenavbar";
import Navbar from "../navbar/Navbar";
import {
  EyeOutlined,
  CaretRightOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Spin,
  notification,
  Result,
  DatePicker,
  Divider,
  Collapse,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import {
  createBill,
  createVehicleNumber,
  getAllDatas,
  getOneBill,
  updateBill,
} from "@/utilities/apiHelper";
import _, { get, isEmpty } from "lodash";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
import moment from "moment";
import { parse } from "postcss";

const Genaratebill = () => {
  const [fixedData, setFixedData] = useState({
    invoiceno: "",
    invoiceDate: "",
    paymentMode: "",
    dispatch_data: "",
    destination_data: "",
    delivery_terms: "",
    customer_data: "",
    customer_address: "",
    gstin: "",
    itc: 0,
    items: [],
    cgst: "",
  });

  // print section
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [instance, setInstance] = useState("");

  const router = useRouter();

  const [customerData, setCustomerData] = useState([]);
  const [productDatas, setProductDatas] = useState([]);
  const [destinationDatas, setDestinationDatas] = useState([]);
  const [vehicleData, setVehicleDatas] = useState([]);
  const [beforePrint, setBeforePrint] = useState(false);
  const [beforePrintDuplicate, setBeforePrintDuplicate] = useState(false);
  const [count, setCount] = useState();
  const [dummy, setDummy] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState([]);

  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  // Global Date
  const date = new Date();

  const setSomeFixedData = () => {
    try {
      setFixedData((pre) => ({
        ...pre,
        ["invoiceDate"]: moment(date).format("DD-MM-YYYY"),
      }));
    } catch (err) {
      notification.error({ message: "something went wrong" });
    }
  };

  const fetchData = async () => {
    try {
      const result = await getAllDatas();
      setCustomerData(get(result, "data.data[0].customers", ""));
      setProductDatas(get(result, "data.data[1].products", ""));
      setVehicleDatas(get(result, "data.data[2].vehicle", ""));
      setDestinationDatas(get(result, "data.data[3].destinations", ""));
      setCount(get(result, "data.data[4].bills", ""));
      const inno = `${
        get(result, "data.data[4].bills", "") === 0
          ? 1
          : get(result, "data.data[4].bills", "") + 1
      }/${date
        .getFullYear()
        .toString()
        .substr(2)}-${Number(
        date
          .getFullYear()
          .toString()
          .substr(2)
      ) + 1} `;

      if (get(router, "query.id", "") === "") {
        setFixedData((pre) => ({ ...pre, ["invoiceno"]: inno }));
        form.setFieldsValue({
          invoice_number: inno,
        });
      }
    } catch (err) {
      notification.error({ message: "something went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
    if (!get(router, "query.id", false)) {
      setSomeFixedData();
    }
  }, [get(router, "query.id", false)]);

  const getUpdatedData = async () => {
    try {
      setLoading(true);
      const result = await getOneBill(router.query.id);
      console.log(result, "ifhjb");
      form.setFieldsValue(get(result, "data.data[0]", {}));
      setFixedData((pre) => ({
        ...pre,
        ["paymentMode"]: get(result, "data.data[0].payment_mode", {}),
        ["dispatch_data"]: get(result, "data.data[0].dispatch", {}),
        ["destination_data"]: get(result, "data.data[0].destination", {}),
        ["delivery_terms"]: get(result, "data.data[0].delivery_terms", {}),
        ["customer_data"]: get(result, "data.data[0].company_name", {}),
        ["customer_address"]: get(result, "data.data[0].company_address", {}),
        ["gstin"]: get(result, "data.data[0].gstin", {}),
        ["gstin"]: get(result, "data.data[0].gstin", {}),
        ["itc"]: get(result, "data.data[0].itc", 0),
        ["invoiceno"]: get(result, "data.data[0].invoice_number", {}),
        ["invoiceDate"]: get(result, "data.data[0].invoice_date", {}),
      }));
      form.setFieldsValue({
        invoice_number: get(result, "data.data[0].invoice_number", {}),
      });
      form.setFieldsValue({
        invoice_date: get(result, "data.data[0].invoice_date", {}),
      });
      setUpdatedData(get(result, "data.data[0]", {}));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      notification.error({ message: "something went wrong" });
    }
  };

  useEffect(() => {
    if (get(router, "query.id", false)) {
      getUpdatedData();
    }
  }, [get(router, "query.id", "")]);

  const handleGrapAddress = (value) => {
    try {
      const result = customerData.filter((res) => {
        return res.company_name === value;
      });
      form.setFieldsValue({
        company_address: get(result, "[0].company_address", ""),
      });
      setFixedData((pre) => ({
        ...pre,
        ["customer_address"]: get(result, "[0].company_address", ""),
      }));
      // gstin
      form.setFieldsValue({
        gstin: get(result, "[0].gst_number", ""),
      });
      setFixedData((pre) => ({
        ...pre,
        ["gstin"]: get(result, "[0].gst_number", ""),
      }));
    } catch (err) {
      notification.error({ message: "something went wrong" });
    }
  };

  const handleFinished = async (value) => {
    try {
      setLoading(true);

      if (get(router, "query.id", false)) {
        value.itc = fixedData.itc;
        value.id = get(router, "query.id", "");
        value.invoice_date = fixedData.invoiceDate;
        console.log(value);
        await updateBill(value);
        notification.success({ message: "Bill Updated Successfully" });
        setLoading(false);
        router.push("/bills");
      } else {
        value.itc = fixedData.itc;
        value.invoice_date = fixedData.invoiceDate;
        await createBill(value);
        notification.success({ message: "Bill Saved Successfully" });
        setOpenModal(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      notification.error({ message: "something went wrong" });
    }
  };

  const handleChangeDate = (date, dateString) => {
    console.log(dateString);
    setFixedData((pre) => ({
      ...pre,
      ["invoiceDate"]: dateString,
    }));
  };

  const handleInstanceSave = async () => {
    try {
      setLoading(true);
      const fomData = {
        vehicle_number: instance,
      };
      const result = await createVehicleNumber(fomData);
      if (get(result, "data.message", "") === "already exited") {
        notification.warning({
          message: "vehicle number already exited",
        });

        setLoading(false);
      } else {
        notification.success({
          message: "vehicle number created successfully",
        });
        setInstance("");
        fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      notification.error({ message: "something went wrong" });
    }
  };
  return (
    <Spin
      spinning={loading}
      className="flex items-center  w-[85vw] flex-col justify-center h-[90vh] overflow-y-scroll"
    >
      {/* rest */}
      <div className="h-[90vh] overflow-y-scroll flex bg-[#f5f7f6]  flex-col  justify-start items-center gap-y-10  ">
        {/* bill */}
        <Collapse defaultActiveKey={[1, 2]} className="!w-[100%] !rounded-none">
          <Collapse.Panel key={2} header="Bill Form">
            {/* form */}
            <div className=" p-2">
              <Form
                layout="vertical"
                size="large"
                form={form}
                onFinish={handleFinished}
              >
                <div className="flex flex-col">
                  <div>
                    <div className="flex gap-x-10">
                      <Form.Item
                        label="Invoice No"
                        name="invoice_number"
                        className="w-[12vw]"
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item label="Invoice Date" className="!w-[12vw]">
                        <DatePicker
                          onChange={handleChangeDate}
                          value={
                            get(router, "query.id", false)
                              ? dayjs(fixedData.invoiceDate, "DD-MM-YYYY")
                              : dayjs(date)
                          }
                          format={"DD-MM-YYYY"}
                        />
                      </Form.Item>
                      {console.log(get(router, "query.id", ""))}
                      <Form.Item
                        label="Mode of Payment"
                        name="payment_mode"
                        className="w-[12vw]"
                        rules={[
                          {
                            required: true,
                            message: "Please Select a Mode of Payment",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Mode of Payment"
                          onChange={(value) => {
                            setFixedData((pre) => ({
                              ...pre,
                              ["paymentMode"]: value,
                            }));
                          }}
                        >
                          <Option value="Credit">Credit</Option>
                          <Option value="Cash">Cash</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Dispatch"
                        name="dispatch"
                        className="w-[12vw]"
                        rules={[
                          {
                            required: true,
                            message: "Please Select a Dispatch",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="select vehicle number"
                          dropdownRender={(vehicleData) => (
                            <>
                              {vehicleData}
                              <Divider
                                style={{
                                  margin: "8px 0",
                                }}
                              />
                              <div className="flex flex-col gap-y-2 !w-[100%]">
                                <input
                                  type="text"
                                  placeholder="Enter new Vehicle Number"
                                  onChange={(e) => {
                                    setInstance(e.target.value);
                                  }}
                                  value={instance}
                                  className="input input-bordered w-full max-w-xs input-md"
                                />
                                <Button
                                  onClick={handleInstanceSave}
                                  type="primary"
                                  className={`bg-primary hover:!bg-transparent !w-[100%] hover:!text-primary !border-2
        hover:!border-primary text-white flex items-center justify-center ${
          !instance ? "hidden" : "block"
        }`}
                                >
                                  <PlusOutlined />
                                  <h1>Add Vehicle</h1>
                                </Button>
                              </div>
                            </>
                          )}
                          onChange={(value) => {
                            setFixedData((pre) => ({
                              ...pre,
                              ["dispatch_data"]: value,
                            }));
                          }}
                          filterOption={(input, option) =>
                            (option?.value ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {vehicleData &&
                            vehicleData.map((res, index) => {
                              return (
                                <Option value={res.vehicle_number} key={index}>
                                  {res.vehicle_number}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Destination"
                        name="destination"
                        className="w-[12vw]"
                        rules={[
                          {
                            required: true,
                            message: "Please Select a Destination",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="select destination"
                          onChange={(value) => {
                            setFixedData((pre) => ({
                              ...pre,
                              ["destination_data"]: value,
                            }));
                          }}
                          filterOption={(input, option) =>
                            (option?.value ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {destinationDatas &&
                            destinationDatas.map((res, index) => {
                              return (
                                <Option value={res.destinations} key={index}>
                                  {res.destinations}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Terms of Delivery"
                        name="delivery_terms"
                        className="w-[12vw]"
                        initialValue=""
                        onChange={(change) =>
                          setFixedData((pre) => ({
                            ...pre,
                            ["delivery_terms"]: change.target.value,
                          }))
                        }
                      >
                        <Input placeholder="Terms of Delivery" />
                      </Form.Item>
                    </div>

                    <div className="flex gap-x-10 ">
                      <Form.Item
                        label="Customer"
                        name="company_name"
                        className="w-[12vw]"
                        rules={[
                          {
                            required: true,
                            message: "Please Select a Customer",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="select destination"
                          onChange={(value) => {
                            setFixedData((pre) => ({
                              ...pre,
                              ["customer_data"]: value,
                            }));
                            handleGrapAddress(value);
                          }}
                          filterOption={(input, option) =>
                            (option?.value ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {customerData &&
                            customerData.map((res, index) => {
                              return (
                                <Option value={res.company_name} key={index}>
                                  {res.company_name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Address"
                        name="company_address"
                        className="w-[12vw]"
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        label="GSTIN"
                        name="gstin"
                        className="w-[12vw]"
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        label={<span>Includes Transportation Charge</span>}
                        className="w-[12vw]"
                        name="itc"
                      >
                        <Input
                          type="checkbox"
                          checked={Number(fixedData?.itc)}
                          onChange={(e) => {
                            setFixedData((pre) => ({
                              ...pre,
                              ["itc"]: e.target.checked ? 1 : 0,
                            }));
                          }}
                          className="!w-fit !h-fit !bg-primary !accent-orange-700 focus:!accent-orange-500"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Form.List name="items">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <div className="flex gap-x-10" key={key}>
                                  <Form.Item
                                    label={`Product ${index + 1}`}
                                    {...restField}
                                    name={[name, `product`]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Enter product name",
                                      },
                                    ]}
                                    className="w-[12vw]"
                                  >
                                    <Select
                                      showSearch
                                      placeholder="select destination"
                                      filterOption={(input, option) =>
                                        (option?.value ?? "")
                                          .toLowerCase()
                                          .includes(input.toLowerCase())
                                      }
                                      onChange={(e) => {
                                        setDummy(!dummy);
                                      }}
                                    >
                                      {productDatas &&
                                        productDatas.map((res, index) => {
                                          return (
                                            <Option
                                              value={res.product_name}
                                              key={index}
                                            >
                                              {res.product_name}
                                            </Option>
                                          );
                                        })}
                                    </Select>
                                  </Form.Item>
                                  <Form.Item
                                    label={`HSN ${index + 1}`}
                                    {...restField}
                                    name={[name, `hsn`]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Enter HSN name",
                                      },
                                    ]}
                                    initialValue={2517}
                                    className="!w-[12vw]"
                                  >
                                    <Input
                                      placeholder="HSN"
                                      onChange={(e) => setDummy(!dummy)}
                                      disabled
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label={`Quantity ${index + 1}`}
                                    {...restField}
                                    name={[name, `quantity`]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Enter quantity name",
                                      },
                                    ]}
                                    onChange={(e) => setDummy(!dummy)}
                                    className="!w-[12vw]"
                                    initialValue={1}
                                  >
                                    <Input
                                      placeholder="quantity"
                                      type="number"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label={`Rate ${index + 1}`}
                                    {...restField}
                                    name={[name, `rate`]}
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Enter rate name or Enter Correctly",
                                      },
                                    ]}
                                    className="!w-[12vw]"
                                    onChange={(e) => setDummy(!dummy)}
                                  >
                                    <Input placeholder="Rate" type="number" />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    onClick={() => {
                                      remove(name), setDummy(!dummy);
                                    }}
                                  />
                                </div>
                              )
                            )}
                            <div className="flex justify-between">
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  className="!flex !w-fit !items-center !justify-center hover:!border-primary hover:!text-primary"
                                >
                                  <PlusOutlined className="!text-primary" />
                                  <span>Add products</span>
                                </Button>
                              </Form.Item>

                              <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className=" hover:!bg-primary !bg-transparent !w-fit !text-primary !border-2
        hover:!border-primary hover:!text-white flex  items-center gap-x-1"
                              >
                                <span>
                                  {get(router, "query.id", "")
                                    ? "update"
                                    : "Save"}
                                </span>
                              </Button>
                            </div>
                          </>
                        )}
                      </Form.List>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </Collapse.Panel>
          <Collapse.Panel key={1} header="Bill View">
            <div ref={componentRef}>
              <div className="flex flex-col  items-center ">
                {(beforePrintDuplicate ? [1, 2] : [1]).map((res, index) => {
                  return (
                    <div
                      key={index}
                      className={`p-2 ${beforePrintDuplicate &&
                        "!h-[50%] !min-h-screen "}   w-[100%]`}
                    >
                      {beforePrintDuplicate && (
                        <h1 className="text-end p-2 text-sm font-bold pr-[10vw]">
                          {index === 0 ? "original" : "duplicate"}
                        </h1>
                      )}
                      <table
                        className={`border-collapse border border-slate-400 ${
                          beforePrintDuplicate || beforePrint
                            ? "w-[100%]"
                            : "w-[100%]"
                        }`}
                      >
                        <tbody>
                          <tr>
                            <td
                              colSpan={3}
                              className="border border-slate-300 pl-4 p-2"
                            >
                              <div className="flex gap-x-4">
                                <Image
                                  src="/images/loard.png"
                                  width={50}
                                  height={40}
                                  className="w-[50px] h-[5vh] grayscale"
                                  alt="logo"
                                />
                                <div className="flex flex-col">
                                  <h1 className="uppercase font-bold text-sm">
                                    MSM BILLS
                                  </h1>
                                  <h1 className="text-[11px] font-semibold">
                                    Channai, Turkish (TK),
                                  </h1>
                                  <h1 className="text-[11px] font-semibold">
                                    Karur - 639206
                                  </h1>
                                  <h1 className="text-[11px] font-semibold">
                                    <span className="!font-bold">GSTIN</span> :
                                    33ACRFS5475748
                                  </h1>
                                </div>
                              </div>
                            </td>
                            <td
                              colSpan={3}
                              className="border border-slate-300 pl-4"
                            >
                              <div className="flex gap-x-10">
                                <div>
                                  <div className="text-sm font-bold">
                                    Invoice No
                                  </div>
                                  <div className="text-sm font-bold">
                                    Invoice Date
                                  </div>
                                </div>

                                <div className="flex gap-x-1">
                                  <div className="flex flex-col">
                                    <div className="text-sm font-semibold">
                                      :
                                    </div>
                                    <div className="text-sm font-semibold">
                                      :
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold">
                                      {fixedData.invoiceno}
                                    </div>
                                    <div className="text-sm font-semibold">
                                      {fixedData.invoiceDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={3}
                              className="border border-slate-300 pl-4 p-2"
                            >
                              <div className="flex gap-x-4 items-start">
                                <div className="w-[50px]">
                                  <div className="text-sm font-bold">
                                    Buyer&nbsp;:
                                  </div>
                                </div>
                                <div>
                                  <h1 className="uppercase font-bold text-sm">
                                    {fixedData.customer_data}
                                  </h1>
                                  <address className="uppercase  text-[11px]">
                                    {fixedData?.customer_address
                                      ?.split(",")
                                      ?.map((res, index) => {
                                        return (
                                          <p key={index}>
                                            {res}
                                            <br />
                                          </p>
                                        );
                                      })}
                                  </address>
                                  <div className="flex gap-x-2 items-center">
                                    <div className="uppercase text-[11px] font-bold">
                                      GSTIN&nbsp;:
                                    </div>
                                    <div className="uppercase text-[11px] ">
                                      {fixedData.gstin}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td
                              colSpan={3}
                              className="border border-slate-300 pl-4"
                            >
                              <div className="flex gap-x-10">
                                <div>
                                  <div className="text-sm font-bold">
                                    Dispatch
                                  </div>
                                  <div className="text-sm font-bold">
                                    Destination
                                  </div>
                                  <div className="text-sm font-bold">
                                    Mode Of Payment
                                  </div>
                                  <div className="text-sm font-bold">
                                    Terms of Delivery
                                  </div>
                                </div>

                                <div className="flex gap-x-1">
                                  <div className="flex flex-col">
                                    <div className="text-sm font-semibold">
                                      :
                                    </div>
                                    <div className="text-sm font-semibold">
                                      :
                                    </div>
                                    <div className="text-sm font-semibold">
                                      :
                                    </div>
                                    <div className="text-sm font-semibold">
                                      :
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold">
                                      {fixedData.dispatch_data}
                                    </div>
                                    <div className="text-sm font-semibold">
                                      {fixedData.destination_data}
                                    </div>
                                    <div className="text-sm font-semibold">
                                      {fixedData.paymentMode}
                                    </div>
                                    <div className="text-sm font-semibold">
                                      {fixedData.delivery_terms}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {fixedData.itc ? (
                                <div className="text-sm ">
                                  Includes Transportation Charge
                                </div>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold">S.No.</div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold text-center">
                                Description of Goods
                              </div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold">HSN</div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold">Qty</div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold">
                                Rate Per Unit
                              </div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold">Amount</div>
                            </td>
                          </tr>

                          {form.getFieldsValue()?.items?.map((res, index) => {
                            return (
                              <tr key={index}>
                                <td className="border border-slate-300 pl-4 p-1">
                                  <div className="text-sm ">{index + 1}</div>
                                </td>
                                <td className="border border-slate-300 pl-4 p-1">
                                  <div className="text-sm ">{res.product}</div>
                                </td>
                                <td className="border border-slate-300 pl-4 p-1">
                                  <div className="text-sm ">{res.hsn}</div>
                                </td>
                                <td className="border border-slate-300 pl-4 p-1">
                                  <div className="text-sm ">{res.quantity}</div>
                                </td>
                                <td className="border border-slate-300 pl-4 p-1">
                                  <div className="text-sm ">
                                    {parseFloat(res.rate).toFixed(2)}
                                  </div>
                                </td>
                                <td className="border border-slate-300 pl-4 p-1">
                                  <div className="text-sm">
                                    {res.rate !== undefined &&
                                      res.quantity !== undefined &&
                                      parseFloat(
                                        res.quantity * res.rate
                                      ).toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td
                              colSpan={3}
                              className="border border-slate-300 pl-4 p-1"
                            >
                              <div className="text-sm font-semibold text-end">
                                CGST Tax @ 2.5%
                              </div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold"></div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold"></div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm ">
                                {!form.getFieldsValue()?.items?.some((res) => {
                                  return res.rate === undefined;
                                }) &&
                                  parseFloat(
                                    (_.sum(
                                      form
                                        .getFieldsValue()
                                        ?.items?.map((data) => {
                                          return data.rate * data.quantity;
                                        })
                                    ) /
                                      100) *
                                      2.5
                                  ).toFixed(2)}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={3}
                              className="border border-slate-300 pl-4 p-1"
                            >
                              <div className="text-sm font-semibold text-end">
                                SGST Tax @ 2.5%
                              </div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold"></div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold"></div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm">
                                {!form.getFieldsValue()?.items?.some((res) => {
                                  return res.rate === undefined;
                                }) &&
                                  parseFloat(
                                    (_.sum(
                                      form
                                        .getFieldsValue()
                                        ?.items?.map((data) => {
                                          return data.rate * data.quantity;
                                        })
                                    ) /
                                      100) *
                                      2.5
                                  ).toFixed(2)}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={3}
                              className="border border-slate-300 pl-4 p-1"
                            >
                              <div className="text-sm font-bold text-end">
                                Grand Total
                              </div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold">
                                {!form.getFieldsValue()?.items?.some((res) => {
                                  return res.rate === undefined;
                                }) &&
                                  _.sum(
                                    form
                                      .getFieldsValue()
                                      ?.items?.map((data) => {
                                        return Number(data.quantity);
                                      })
                                  )}
                              </div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold"></div>
                            </td>
                            <td className="border border-slate-300 pl-4 p-1">
                              <div className="text-sm font-bold">
                                {!form.getFieldsValue()?.items?.some((res) => {
                                  return res.rate === undefined;
                                }) &&
                                  parseFloat(
                                    (_.sum(
                                      form
                                        .getFieldsValue()
                                        ?.items?.map((data) => {
                                          return data.rate * data.quantity;
                                        })
                                    ) /
                                      100) *
                                      2.5 *
                                      2 +
                                      _.sum(
                                        form
                                          .getFieldsValue()
                                          ?.items?.map((data) => {
                                            return data.rate * data.quantity;
                                          })
                                      )
                                  ).toFixed(2)}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={6}
                              className="border border-slate-300 pl-1 p-2"
                            >
                              <div className="flex justify-left pr-1 gap-x-10 ">
                                <div className="flex gap-x-20">
                                  <div>
                                    <div className="text-sm font-bold">
                                      Beneficiary Bank Name
                                    </div>
                                    <div className="text-sm font-bold">
                                      Beneficiary Account No
                                    </div>
                                  </div>

                                  <div className="flex gap-x-1">
                                    <div className="flex flex-col">
                                      <div className="text-sm font-semibold">
                                        :
                                      </div>
                                      <div className="text-sm font-semibold">
                                        :
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold">
                                        BANK OF MSM
                                      </div>
                                      <div className="text-sm font-semibold">
                                        14745784754154
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-x-20">
                                  <div>
                                    <div className="text-sm font-bold">
                                      Beneficiary Bank IFSC
                                    </div>
                                    <div className="text-sm font-bold">
                                      Beneficiary Acount Name
                                    </div>
                                  </div>

                                  <div className="flex gap-x-1">
                                    <div className="flex flex-col">
                                      <div className="text-sm font-semibold">
                                        :
                                      </div>
                                      <div className="text-sm font-semibold">
                                        :
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold">
                                        14745784754154
                                      </div>
                                      <div className="text-sm font-semibold">
                                        MSM BILLS
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={6}
                              className="border border-slate-300 pl-1 pr-1"
                            >
                              <div className="flex flex-row-reverse justify-between ">
                                <div className="p-2 text-sm font-semibold">
                                  For MSM BILLS
                                </div>
                                <div className="p-2 text-sm font-semibold">
                                  Customer&apos;s Seal And Signature
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h1 className="text-center p-2 text-sm font-bold">
                        This is computer generated invoice
                      </h1>
                    </div>
                  );
                })}
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>

        {/* bill */}
      </div>

      <Modal footer={false} open={openModal} centered>
        <div className="flex gap-x-10">
          <Button
            onClick={() => {
              setBeforePrint(true);
              setTimeout(() => {
                handlePrint();
                setBeforePrint(false);
              }, 0.1);
            }}
            type="primary"
            size={"large"}
            className=" hover:!bg-primary !bg-transparent !text-primary !border-2
        hover:!border-primary hover:!text-white flex  items-center gap-x-1"
          >
            <h1>Print original</h1>
          </Button>

          <Button
            onClick={() => {
              setBeforePrintDuplicate(true);
              setTimeout(() => {
                handlePrint();
                setBeforePrintDuplicate(false);
              }, 0.1);
            }}
            type="primary"
            size={"large"}
            className=" hover:!bg-primary !bg-transparent !text-primary !border-2
        hover:!border-primary hover:!text-white flex  items-center gap-x-1"
          >
            <h1>Print Duplicate</h1>
          </Button>

          <Button
            onClick={() => {
              router.push("/bills");
            }}
            type="primary"
            size={"large"}
            className=" hover:!bg-primary !bg-transparent !text-sky-600 !border-2
        hover:!border-primary hover:!text-white flex  items-center gap-x-1"
          >
            <h1>Maybe Later</h1>
          </Button>
        </div>
      </Modal>
    </Spin>
  );
};

export default Genaratebill;
