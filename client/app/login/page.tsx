"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/loading";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("aziz@google.com");
  const [password, setPassword] = useState("admin");
   const [loading, setLoading] = useState(false);
  const handleLogin = async () => { 
    setLoading(true);
    const payload = {
      email,
      password,
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/users/login",
        payload,
        { withCredentials: true }
      );

      if (res.status === 200) {
        const {data} = res;
        localStorage.setItem('user',data.user);
        setLoading(false);
        router.push("/");
      }
    } catch (err) {
      setLoading(false);
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
          className="px-3 py-1.5 rounded-md hover:ring-1 bg-sky-600 text-white disabled:bg-gray-400 disabled:hover:ring-0"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <LoadingButton />: "Sign in"}
        </button>
        
      </div>
    </div>
  );
};

export default Login;
