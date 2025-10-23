type Payment={
    id:string
    amount:number
    status:"pending" | "processing" | "success" | "failed"
    email:string
}

export const payments: Payment[]=[
    {
        id:"728ed52f",
        amount:100,
        status:"pending",
        email:"m@example.com"
    },
    {
        id:"Abfed52f",
        amount:100,
        status:"processing",
        email:"m@yahoo.com"
    }
]