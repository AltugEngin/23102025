"use client";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type VisibilityState,
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
import { useEffect, useState } from "react";
import { type Payment } from "./columns";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectContent,
} from "@/components/ui/select";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  //data: TData[];
}

const formSchema = z.object({
  status: z.literal(["pending", "processing", "success", "failed"]),
  amount: z.coerce.number().max(10000, "Amount must be at most 10000$"),
  email: z.email(),
  company_name: z.null(),
});

function RecordAddForm({ setRecordData, companyData }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "success",
      amount: 100,
      email: "altugengin@yahoo.com",
      company_name: null,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setRecordData(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Record</CardTitle>
        <CardDescription>
          Enter device details which is to be sent to repair.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-status">Status</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-status"
                    aria-invalid={fieldState.invalid}
                    placeholder="success"
                    autoComplete="off"
                  ></Input>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}></FieldError>
                  )}
                </Field>
              )}
            ></Controller>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="altugengin@yahoo.com"
                    autoComplete="off"
                  ></Input>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}></FieldError>
                  )}
                </Field>
              )}
            ></Controller>
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-amount">Amount</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-amount"
                    aria-invalid={fieldState.invalid}
                    placeholder="100"
                    autoComplete="off"
                  ></Input>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}></FieldError>
                  )}
                </Field>
              )}
            ></Controller>
            <Controller
              name="company_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-amount">
                    Company
                  </FieldLabel>
                  <Select>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Companies</SelectLabel>

                        {companyData.map((value) => (
                          <SelectItem value={value.company_name}>
                            {value.company_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}></FieldError>
                  )}
                </Field>
              )}
            ></Controller>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [recordData, setRecordData] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const queryClient = useQueryClient();

  const fetchPosts = async (): Promise<Payment[]> => {
    const { data } = await supabase.from("payment").select("*");
    return data as Payment[];
  };

  const fetchCompanies = async (): Promise<Payment[]> => {
    const { data } = await supabase.from("company").select("*");
    return data as Payment[];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: fetchPosts,
  });

  const companyData = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompanies,
  });

  //console.log(companyData.data);
  const deleteRecordMutation = useMutation({
    mutationFn: async (id) =>
      await supabase.from("payment").delete().eq("id", id).select(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"], data });
    },
  });
  const insertRecord = async () =>
    await supabase.from("payment").insert({
      amount: recordData.amount,
      status: recordData.status,
      email: recordData.email,
    });

  const insertRecordMutation = useMutation({
    mutationFn: insertRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment"] }),
  });

  useEffect(() => insertRecordMutation.mutate(), [recordData]);

  //console.log(recordData.amount);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      deleteRow: (id) => deleteRecordMutation.mutate(id),
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
          <RecordAddForm
            setRecordData={setRecordData}
            companyData={companyData.data}
          ></RecordAddForm>

          <div className="flex items-center py-4">
            <Input
              className="max-w-sm"
              placeholder="Filter emails..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
            ></Input>
            {/**<Button
              className="ml-auto"
              variant="outline"
              onClick={() => insertRecordMutation.mutate()}
            >
              Add Record
            </Button> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Select Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
