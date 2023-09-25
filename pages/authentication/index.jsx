import { Button, Form, Input } from "antd";
import React from "react";
import { authenticateAdmin } from "../../utilities/apiHelper";
import { toast } from "react-toastify";
import { get } from "lodash";
import Image from "next/image";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

const Login = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleLoginFinish = async (values) => {
    try {
      const result = await authenticateAdmin(JSON.stringify(values));
      Cookie.set("__utief_", get(result, "data.data", ""));
      toast.success("Start Your Journey");
      form.resetFields();
      router.push("/");
    } catch (err) {
      if (err.response.data.message === "failed") {
        toast.error("something went wrong");
      } else {
        toast.error(get(err, "response.data.message", "something went wrong"));
      }
    }
  };

  return (
    <div
      data-theme="mytheme"
      className="flex  items-center justify-center w-screen h-screen bg-no-repeat bg-cover"
    >
      <div className="w-[400px] h-[510px] bg-white shadow-inner rounded-2xl flex justify-center flex-col items-center">
        <Image
          width={100}
          height={100}
          alt="login"
          src="/images/l.png"
          className="rounded-full shadow-sm"
        />

        <Form
          onFinish={handleLoginFinish}
          form={form}
          layout="vertical"
          size="large"
          autoComplete="off"
          className="!w-[90%] pt-[3vh] flex flex-col gap-y-5"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "Please Enter Valid Email",
              },
              {
                required: true,
                message: "Please Enter Email Here",
              },
            ]}
            initialValue={"example@gmail.com"}
          >
            <Input
              placeholder="Enter Email Here"
              className="p-4 !outline-primary  !border-2 focus:!border-primary hover:!border-primary hover:border-2 focus:border-2 "
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter Password here",
              },
            ]}
            initialValue={"example"}
          >
            <Input.Password
              placeholder="Enter Password Here"
              className="p-4 !outline-primary  !border-2 focus:!border-primary hover:!border-primary hover:border-2 focus:border-2 "
            />
          </Form.Item>
          <div className="text-sm capitalize text-gray-400 cursor-pointer">
            forgot password?
          </div>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            className="border-2 !bg-primary hover:!bg-transparent hover:!text-primary hover:!border-2 hover:!border-primary   text-white !h-[58px] !hover:bg-red-700"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
