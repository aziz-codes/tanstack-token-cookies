"use server";

import { cookies } from "next/headers";

export default async function RefreshToken() {
  return cookies().get("rft")?.value;
 
}
