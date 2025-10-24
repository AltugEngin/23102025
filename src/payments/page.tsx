import { supabase } from "@/supabaseClient";
import { columns, type Payment } from "./columns";
import { useState } from "react";

import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";

const fetchPosts=async():Promise<Payment[]> =>{
  const {data}=await supabase.from("payment").select("*")
  return data as Payment[]
}

export default function Demo() {
 const {data}=useQuery({queryKey:["payment"],queryFn:fetchPosts})
 console.log(typeof data)
 console.log(data[1].amount)


  return (
    <div className="container mx-auto py-10">
     {/*<DataTable columns={columns} data={data}></DataTable>*/}
     <DataTable columns={columns} data={data}></DataTable>
    </div>
  );
}
