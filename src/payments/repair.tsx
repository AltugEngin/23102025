//REACT
import { useState,useEffect } from "react";

// REACT-HOOK-FORM
import * as z from "zod"
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// SUPABASE DATABASE
import { supabase } from "@/supabaseClient";

// TANSTACK QUERY
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";

// TANSTACK TABLE
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  flexRender,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

// SHADCN UI
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Item,ItemMedia,ItemContent,ItemTitle } from "@/components/ui/item";
import { Field,FieldGroup,FieldLabel,FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Select,SelectTrigger,SelectContent,SelectValue,SelectLabel,SelectGroup,SelectItem } from "@/components/ui/select";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogContent,DialogFooter,DialogClose } from "@/components/ui/dialog";
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

// LUCIDE REACT
import { Plus,MoreHorizontal,ArrowUpDown } from "lucide-react";

//-----------------------------------------------------------------------------------------------------------------------------


type Repair = {
  id: string;
  created_at: string;
  description: string;
  sent_to: string;
  price: number;
  status: "pending" | "processing" | "success" | "failed";
};

const columns: ColumnDef<Repair>[] = [
  { accessorKey: "id",  header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID <ArrowUpDown className="ml-2 h-4 w-4"></ArrowUpDown>
        </Button>
      );
    }, },
  { accessorKey: "created_at", header: "Date" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "sent_to", header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID <ArrowUpDown className="ml-2 h-4 w-4"></ArrowUpDown>
        </Button>
      );
    }, },
  { accessorKey: "price", header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="text-right font-medium">{formattedPrice}</div>;
    }, },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const repair = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4"></MoreHorizontal>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(repair.id)}
            >
              Copy row ID
            </DropdownMenuItem>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem
              onClick={() => table.options.meta?.deleteRepairData(repair.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const repairFormSchema = z.object({
  status: z.literal(["pending", "processing", "success", "failed"]),
  price: z.coerce.number(),
  description: z.string().nonempty(), 
  sent_to: z.string().nonempty(),
});

function RepairForm_AddDialog({setWriteFormData,supplierData}){
  const form = useForm<z.infer<typeof repairFormSchema>>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      status: "success",
      price: 100,
      description: "",
      sent_to: "",
    },
  });

  const onSubmit = (data: z.infer<typeof repairFormSchema>) => {
    setWriteFormData(data);
  };
  return(<Dialog>
    <form id="form-rhf-demo-dialog" onSubmit={form.handleSubmit(onSubmit)}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus></Plus></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Record</DialogTitle>
          <DialogDescription>Enter repair details</DialogDescription>
        </DialogHeader>
        <FieldGroup>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-dialog-description">Description</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="elektronik kart, sürücü, motor vs..."
                    autoComplete="off"
                  ></Input>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}></FieldError>
                  )}
                </Field>
              )}
            ></Controller>
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-dialog-status">Status</FieldLabel>
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
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-dialog-price">Price</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-price"
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
              name="sent_to"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-dialog-sent_to">
                    Sent to
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="w-[280px]"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Supplier</SelectLabel>

                        {supplierData.data?.map((value) => (
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
           <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" form="form-rhf-demo-dialog">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>)
}



export default function Repair() {
  const queryClient = useQueryClient();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [writeFormData,setWriteFormData]=useState({})

  const fetchRepairs = async (): Promise<Repair[]> => {
    const { data } = await supabase.from("repair").select("*");
    return data as Repair[];
  };
  const fetchSuppliers = async () => {
      const { data } = await supabase.from("company").select("*");
      return data;
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ["repair"],
    queryFn: fetchRepairs,
  });

  const supplierData = useQuery({
      queryKey: ["company"],
      queryFn: fetchSuppliers,
    });

  const insertRepairData = async (payload: Partial<Repair>) => {
      await supabase.from("repair").insert({
        price: payload.price,
        status: payload.status,
        description: payload.description,
        sent_to: payload.sent_to,
      });
  };

  const insertRepairDataMutation = useMutation({
    mutationFn: insertRepairData,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["repair"] }),
  });

  const deleteRecordMutation = useMutation({
      mutationFn: async (id: number) =>
        await supabase.from("repair").delete().eq("id", id).select(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["repair"] });
      },
    });


   useEffect(() => {
      insertRepairDataMutation.mutate(writeFormData);
    }, [writeFormData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    meta: {
      deleteRepairData: (id: number) => deleteRecordMutation.mutate(id),
    },
    state:{
      columnFilters,
      sorting
    }
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
          <div className="flex items-center py-4">
            <span className="ml-auto">

            <RepairForm_AddDialog setWriteFormData={setWriteFormData} supplierData={supplierData}></RepairForm_AddDialog>
            </span>
             <Input className="max-w-sm" placeholder="Filter suppliers..." 
             value={
                            (table.getColumn("sent_to")?.getFilterValue() as string) ?? ""
                          }
             onChange={(event) =>
                            table.getColumn("sent_to")?.setFilterValue(event.target.value)
                          }
                        ></Input>
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
        </div>
      )}
    </div>
  );
}
