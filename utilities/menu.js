import {
  UserOutlined,
  ApiOutlined,
  IssuesCloseOutlined,
  HighlightOutlined,
  WindowsOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const items = [
  getItem(
    <Link href="/">
      <h1 className="font-bold ">Dashboard</h1>
    </Link>,
    "",
    <WindowsOutlined />
  ),
  getItem(
    <Link href="/company">
      <h1 className="font-bold ">Company</h1>
    </Link>,
    "customer",
    <UserOutlined />
  ),
  getItem(
    <Link href="/product">
      <h1 className="font-bold ">Product</h1>
    </Link>,
    "product",
    <HighlightOutlined />
  ),
  getItem(
    <Link href="/vehicle-numbers">
      <h1 className="font-bold ">Vehicle Numbers</h1>
    </Link>,
    "vehicle-numbers",
    <Image width={10} height={10} alt="logo" src="/images/vehicle.gif" />
  ),
  getItem(
    <Link href="/destination">
      <h1 className="font-bold ">Destinations</h1>
    </Link>,
    "destination",
    <ApiOutlined />
  ),
  getItem(
    <Link href="/generate-bill">
      <h1 className="font-bold">Generate Bill</h1>
    </Link>,
    "generate-bill",
    <BarcodeOutlined />
  ),
  getItem(
    <Link href="/bills">
      <h1 className="font-bold">Bills History</h1>
    </Link>,
    "bills",
    <IssuesCloseOutlined />
  ),
];
