import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children}) =>{

    const currentUserId = localStorage.getItem("currentUserId")
    return currentUserId?children:<Navigate to="/login" replace />

    
}
export default ProtectedRoute