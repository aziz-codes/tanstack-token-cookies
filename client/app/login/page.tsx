"use client";

import { create } from "@/actions/save-cookie";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/users/login",
        payload
      );
      const { refreshToken, accessToken } = res.data;

      const tds = `${refreshToken}AZ-:24${accessToken}`;
      const data = {
        name: "ds",
        value: tds,
        httpOnly: true,
        path: "/",
        secure: true,
      };
      await create(data);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex items-center h-screen justify-center">
      <div className="w-full max-w-sm border px-3 py-4 bg-white shadow-lg h-96 justify-center rounded-md flex flex-col space-y-5">
        <input
          type="text"
          placeholder="Email"
          className="outline-none py-1 px-1 rounded-md border w-full "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Email"
          className="outline-none py-1 px-1 rounded-md border w-full "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="px-3 py-1.5 rounded-md hover:ring-1 bg-sky-600 text-white"
          onClick={handleLogin}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
