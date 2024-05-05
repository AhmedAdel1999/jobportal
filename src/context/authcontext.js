import { createContext, useState } from "react"
export const AuthContext = createContext()
const AuthContextProvider = ({children}) =>{
    const currentUserId = JSON.parse(localStorage.getItem("currentUserId"))
    const[IsLoggedIn,setIsLoggedIn]=useState(currentUserId?true:false)
    const[userData,setUserData]=useState(null)
    return(
        <AuthContext.Provider value={{IsLoggedIn,setIsLoggedIn,setUserData}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider