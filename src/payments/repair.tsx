import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Repair = {
  id: string;
  created_at: string;
  description: string;
  sent_to: string;
  price: number;
  status: "pending" | "processing" | "success" | "failed";
};

const columns: ColumnDef<Repair>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "created_at", header: "Date" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "sent_to", header: "Sent to" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "status", header: "Status" },
];

export default function Repair() {
  const fetchRepairs = async (): Promise<Repair[]> => {
    const { data } = await supabase.from("repair").select("*");
    return data as Repair[];
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ["repair"],
    queryFn: fetchRepairs,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
