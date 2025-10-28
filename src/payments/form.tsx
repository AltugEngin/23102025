import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  status: z.literal(["pending", "processing", "success", "failed"]),
  amount: z.coerce.number().max(10000, "Amount must be at most 10000$"),
  email: z.email(),
});

export function RecordAddForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "success",
      amount: 100,
      email: "altugengin@yahoo.com",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
