
import { useNavigate } from 'react-router'
import { useAuth } from './AuthContext';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent,CardFooter } from './components/ui/card';
import { FieldGroup,Field,FieldLabel,FieldError } from './components/ui/field';
import { Input } from './components/ui/input';
import { Controller } from 'react-hook-form';
import { Button } from './components/ui/button';

const signInFormSchema=z.object({email:z.email(),password:z.string().max(8).min(4)})

export default function SignIn() {
    const navigate=useNavigate();
    const {signInWithEmail}=useAuth();
    const form=useForm<z.infer<typeof signInFormSchema>>({
        resolver:zodResolver(signInFormSchema),
        defaultValues: {
            email:"altugengin@yahoo.com",
            password:"123456"
        },
    })

    async function onSubmit(data:z.infer<typeof signInFormSchema>){
        const {error}=await signInWithEmail(data)
         if (error) {
      throw new Error(error.message);
    } else {
      navigate("/repair");
    }
    }



  return (
    <Card>
        <CardContent>
            <form id="form-rhf-signin" onSubmit={form.handleSubmit(onSubmit)}>
<FieldGroup>
<Controller 
name="email" 
control={form.control} 
render={({field,fieldState})=>(
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-signin-email">
                  Email
                  </FieldLabel>
                  <Input
                  {...field}
                  id="form-rhf-signin-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="altugengin@yahoo.com"
                  autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>)}/>
                  
<Controller 
name="password" 
control={form.control} 
render={({field,fieldState})=>(
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-signin-password">
                  Password
                  </FieldLabel>
                  <Input
                  {...field}
                  id="form-rhf-signin-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="123456"
                  autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>)}/>

                  </FieldGroup>
                  </form>
        </CardContent>
        <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-signin">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
