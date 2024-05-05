import { fetchInstance } from "./constants"

export const userRegister = (data) =>{
    return fetchInstance.post("users",data)
}

export const getUser = (userId) =>{
    return fetchInstance.get(`users/${userId}`)
}

export const getAllUsers = () =>{
    return fetchInstance.get("users")
}


export const UpdateUser = ({data,userId}) =>{
    return fetchInstance.put(`users/${userId}`,data)
}


