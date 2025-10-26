import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Demo() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns}></DataTable>
    </div>
  );
}
