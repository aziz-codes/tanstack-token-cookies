"use server";

import { cookies } from "next/headers";

export async function getCookie() {
  return cookies().get("sid")?.value;
  //   return auths;
}
