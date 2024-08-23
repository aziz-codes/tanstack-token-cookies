"use server";

import { cookies } from "next/headers";

export async function create(data: any) {
  cookies().set(data);
}
