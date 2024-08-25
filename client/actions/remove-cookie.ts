"use server"
import {cookies} from 'next/headers';

export  async function logout(){
    const cookie = cookies();
    const ds = cookie.get('ds');
    if(!ds) return;
    return cookie.delete('ds');
}