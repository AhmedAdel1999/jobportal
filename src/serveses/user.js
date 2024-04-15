import { fetchInstance } from "./constants"

export const getUser = (token) =>{
    return fetchInstance.get("user/me",{
        headers:{
            token:`${token}`
        }
    })
}

export const getAllUser = () =>{
    return fetchInstance.get("user/")
}

export const UpdateUser = ({data,userId}) =>{
    return fetchInstance.put(`user/editUser/${userId}`,data)
}

export const getUsersApplications = (data) =>{
    return fetchInstance.post(`user/getApps`,data)
}

export const getApplicant = (id) =>{
    return fetchInstance.get(`user/getApp/${id}`)
}

export const addJobToUser = ({id,data}) =>{
    return fetchInstance.post(`user/addJob/${id}`,data)
}

