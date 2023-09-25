import React from "react";
import {
  UserOutlined,
  ApiOutlined,
  IssuesCloseOutlined,
  HighlightOutlined,
  WindowsOutlined,
  BarcodeOutlined,
  UngroupOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { get } from "lodash";
import { useRouter } from "next/router";
import Image from "next/image";
import { Divider, Tooltip } from "antd";

const Sidenavbar = () => {
  const router = useRouter();
  console.log(router);
  const menudata = [
    {
      id: 0,
      name: "Generate Bill",
      icon: <PlusCircleOutlined />,
      link: "/generate-bill",
    },
    {
      id: 1,
      name: "Dashboard",
      icon: <WindowsOutlined />,
      link: "/",
    },
    {
      id: 2,
      name: "Customers",
      icon: <UserOutlined />,
      link: "/company",
    },
    {
      id: 3,
      name: "Products",
      icon: <HighlightOutlined />,
      link: "/product",
    },
    {
      id: 4,
      name: "Vehicle Numbers",
      icon: <UngroupOutlined />,
      link: "/vehicle-numbers",
    },
    {
      id: 5,
      name: "Destinations",
      icon: <ApiOutlined />,
      link: "/destination",
    },

    {
      id: 6,
      name: "All Bills",
      icon: <IssuesCloseOutlined />,
      link: "/bills",
    },
  ];

  return (
    <div className="w-[5vw] bg-accent flex-col shadow-2xl text-black text-lg font-bold  h-screen  overflow-y-scroll flex justify-start">
      <div className="flex flex-col">
        {menudata.map((res, index) => {
          return (
            <Tooltip
              title={get(res, "name", "")}
              placement="right"
              color="orange"
              style={{ width: 10 }}
              key={index}
            >
              <Link
                href={res.link}
                className={`flex flex-col   items-center group ${
                  get(router, "pathname", "") === res.link
                    ? "bg-white shadow-inner"
                    : "bg-accent"
                } gap-2 h-[10vh] hover:bg-white group border-primary justify-center cursor-pointer`}
              >
                <div
                  className={`group-hover:text-orange-600 ${
                    get(router, "pathname", "") === res.link
                      ? "text-orange-600 animate-pulse"
                      : "text-white"
                  } `}
                >
                  {get(res, "icon", "")}
                </div>
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default Sidenavbar;
