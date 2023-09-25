/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from "react";
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
  CloudDownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

import * as htmlToImage from "html-to-image";
import {
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  getAllBills,
} from "@/utilities/apiHelper";
import _, { get, isEmpty } from "lodash";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";

import Link from "next/link";

const PrintBills = ({ datas, setViewBill }) => {
  const [loading, setLoading] = useState(false);
  const [fixedData, setTotalBillsData] = useState(datas);
  const [changeSize, setChangeSize] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log(fixedData);

  return (
    <Spin spinning={loading}>
      <div className={`w-fit p-2 `} ref={componentRef}>
        <div className={`p-2   w-[100%]`}>
          <table className={`border-collapse border border-slate-400 `}>
            <tbody>
              <tr>
                <td colSpan={3} className="border border-slate-300 pl-4 p-2">
                  <div className="flex gap-x-4">
                    <Image
                      src="/images/loard.png"
                      width={50}
                      height={40}
                      className="w-[50px] h-[5vh] grayscale"
                      alt="logo"
                    />
                    <div className="flex flex-col">
                      <h1 className="uppercase font-bold text-sm">MSM BILLS</h1>
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
                <td colSpan={3} className="border border-slate-300 pl-4">
                  <div className="flex gap-x-10">
                    <div>
                      <div className="text-sm font-bold">Invoice No</div>
                      <div className="text-sm font-bold">Invoice Date</div>
                    </div>

                    <div className="flex gap-x-1">
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold">:</div>
                        <div className="text-sm font-semibold">:</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {fixedData?.invoice_number}
                        </div>
                        <div className="text-sm font-semibold">
                          {fixedData?.invoice_date}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-slate-300 pl-4 p-2">
                  <div className="flex gap-x-4 items-start">
                    <div className="w-[50px]">
                      <div className="text-sm font-bold">Buyer&nbsp;:</div>
                    </div>
                    <div>
                      <h1 className="uppercase font-bold text-sm">
                        {fixedData?.company_name}
                      </h1>
                      <address className="uppercase  text-[11px]">
                        {fixedData?.company_address
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
                          {fixedData?.gstin}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td colSpan={3} className="border border-slate-300 pl-4">
                  <div className="flex gap-x-10">
                    <div>
                      <div className="text-sm font-bold">Dispatch</div>
                      <div className="text-sm font-bold">Destination</div>
                      <div className="text-sm font-bold">Mode Of Payment</div>
                      <div className="text-sm font-bold">Terms of Delivery</div>
                    </div>

                    <div className="flex gap-x-1">
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold">:</div>
                        <div className="text-sm font-semibold">:</div>
                        <div className="text-sm font-semibold">:</div>
                        <div className="text-sm font-semibold">:</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {fixedData?.dispatch}
                        </div>
                        <div className="text-sm font-semibold">
                          {fixedData?.destination}
                        </div>
                        <div className="text-sm font-semibold">
                          {fixedData?.payment_mode}
                        </div>
                        <div className="text-sm font-semibold">
                          {fixedData?.delivery_terms}
                        </div>
                      </div>
                    </div>
                  </div>
                  {Number(fixedData?.itc) ? (
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
                  <div className="text-sm font-bold">Rate Per Unit</div>
                </td>
                <td className="border border-slate-300 pl-4 p-1">
                  <div className="text-sm font-bold">Amount</div>
                </td>
              </tr>

              {fixedData?.items?.map((res, index) => {
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
                          parseFloat(res.quantity * res.rate).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3} className="border border-slate-300 pl-4 p-1">
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
                    {!fixedData?.items?.some((res) => {
                      return res.rate === undefined;
                    }) &&
                      parseFloat(
                        (_.sum(
                          fixedData?.items?.map((data) => {
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
                <td colSpan={3} className="border border-slate-300 pl-4 p-1">
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
                    {!fixedData?.items?.some((res) => {
                      return res.rate === undefined;
                    }) &&
                      parseFloat(
                        (_.sum(
                          fixedData?.items?.map((data) => {
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
                <td colSpan={3} className="border border-slate-300 pl-4 p-1">
                  <div className="text-sm font-bold text-end">Grand Total</div>
                </td>
                <td className="border border-slate-300 pl-4 p-1">
                  <div className="text-sm font-bold">
                    {!fixedData?.items?.some((res) => {
                      return res.rate === undefined;
                    }) &&
                      _.sum(
                        fixedData?.items?.map((data) => {
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
                    {!fixedData?.items?.some((res) => {
                      return res.rate === undefined;
                    }) &&
                      parseFloat(
                        (_.sum(
                          fixedData?.items?.map((data) => {
                            return data.rate * data.quantity;
                          })
                        ) /
                          100) *
                          2.5 *
                          2 +
                          _.sum(
                            fixedData?.items?.map((data) => {
                              return data.rate * data.quantity;
                            })
                          )
                      ).toFixed(2)}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={6} className="border border-slate-300 pl-1 p-2">
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
                          <div className="text-sm font-semibold">:</div>
                          <div className="text-sm font-semibold">:</div>
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
                          <div className="text-sm font-semibold">:</div>
                          <div className="text-sm font-semibold">:</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            14745784754154
                          </div>
                          <div className="text-sm font-semibold">MSM BILLS</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={6} className="border border-slate-300 pl-1 pr-1">
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
      </div>
      <div className={`absolute bottom-0 right-[1vw]`}>
        <div className="flex items-center w-[100%] justify-end space-x-2 pb-2">
          <Tooltip title="Close">
            <Tag
              onClick={() => {
                setViewBill(false);
              }}
              type="primary"
              size="middle"
              className="cursor-pointer"
              color="red"
            >
              cancel
            </Tag>
          </Tooltip>
          <Tooltip title="Click To Print">
            <Tag
              onClick={() => {
                setChangeSize(true);
                setLoading(true);
                setTimeout(() => {
                  handlePrint();
                  setChangeSize(false);
                  setLoading(false);
                }, [1000]);
              }}
              type="primary"
              size="middle"
              htmlType="submit"
              className="cursor-pointer"
              color="green"
            >
              Print
            </Tag>
          </Tooltip>
        </div>
      </div>
    </Spin>
  );
};

export default PrintBills;
