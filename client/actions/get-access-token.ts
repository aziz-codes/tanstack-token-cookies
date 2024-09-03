"use server";

import { cookies } from "next/headers";

export  default function getAccessToken() {
  return cookies().get("act")?.value;
 
}
