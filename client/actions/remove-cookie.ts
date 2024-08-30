"use server"
import {cookies} from 'next/headers';

export  async function logout(){
    const cookie = cookies();
    const ds = cookie.get('cb-session');
    if(!ds) return;
     cookie.delete('cb-session');
     cookie.delete('rt');
     cookie.delete('at');
}