import { Avatar, Button } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Navbar = () => {
  const route = useRouter();
  const handleClick = () => {
    Cookies.remove("__utief_");
    route.push("/authentication");
  };
  return (
    <div className="w-[95vw] h-[10vh] bg-accent   flex items-center justify-end px-5">
      <div className="cursor-pointer">
        <Button
          onClick={handleClick}
          type="primary"
          size={"large"}
          className=" hover:!bg-primary !bg-transparent !text-primary !border-2
        hover:!border-primary hover:!text-white flex  items-center gap-x-1"
        >
          <div>Logout</div>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
