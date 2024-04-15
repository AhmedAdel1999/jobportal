import { createContext, useState } from "react"
export const AuthContext = createContext()
const AuthContextProvider = ({children}) =>{
    const token = JSON.parse(localStorage.getItem("token"))
    const[IsLoggedIn,setIsLoggedIn]=useState(token?true:false)
    const[userData,setUserData]=useState(null)
    return(
        <AuthContext.Provider value={{IsLoggedIn,setIsLoggedIn,setUserData}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider