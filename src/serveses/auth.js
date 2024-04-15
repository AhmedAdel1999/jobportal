import { fetchInstance } from "./constants"
export const userRegister = (data) =>{
    return fetchInstance.post("user/register",data)
}
export const userLogin = (data) =>{
    return fetchInstance.post("user/login",data)
}