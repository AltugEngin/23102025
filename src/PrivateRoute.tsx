import { Navigate } from "react-router"
import { useAuth } from "./AuthContext"
import type React from "react"

const PrivateRoute=({children}:{children:React.ReactNode})=>{
    const {user}=useAuth()
    if(user===undefined){
        return <div>Loading...</div>
    }
    return <div>{user ? <>{children}</> : <Navigate to="/"></Navigate>}</div>
}

export default PrivateRoute;