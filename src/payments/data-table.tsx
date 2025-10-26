"use client";

import {
  flexRender,
  type SortingState,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Item, ItemMedia, ItemContent, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/supabaseClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type Payment } from "./columns";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  //data: TData[];
}

const fetchPosts = async (): Promise<Payment[]> => {
  const { data } = await supabase.from("payment").select("*");
  return data as Payment[];
};

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: fetchPosts,
  });
  const { mutate } = useMutation({
    mutationFn: async (id) =>
      await supabase.from("payment").delete().eq("id", id).select(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"], data });
    },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta: {
      deleteRow: (id) => mutate(id),
    },
  });

  return (
    <div>
      {isLoading ? (
        <Item>
          <ItemMedia>
            <Spinner></Spinner>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Loading Table...</ItemTitle>
          </ItemContent>
        </Item>
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
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
