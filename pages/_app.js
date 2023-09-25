import "./styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar/Navbar";
import Sidenavbar from "./navbar/Sidenavbar";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import React from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  React.useEffect(() => {
    if (!Cookies.get("__utief_")) {
      router.push("/authentication");
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="flex w-screen">
        <Sidenavbar />
        <div className="flex flex-col">
          {router.route !== "/authentication" && <Navbar />}
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}
