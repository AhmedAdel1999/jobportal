import { fetchInstance } from "./constants"

export const createNewJob = (data) =>{
    return fetchInstance.post("Job/register",data)
}

export const getAllJobs = () =>{
    return fetchInstance.get("Job")
}

export const getSingleJobs = (id) =>{
    return fetchInstance.get(`Job/getJob/${id}`)
} 

export const updateJob = ({id,data}) =>{
    return fetchInstance.post(`Job/editJob/${id}`,data)
}

export const deleteJob = (id) =>{
    return fetchInstance.post(`Job/deleteJob/${id}`)
}

export const updateJobStatus = ({id,data}) =>{
    return fetchInstance.post(`Job/updateStatus/${id}`,data)
}

export const applyJob = ({id,data}) =>{
    return fetchInstance.post(`job/addApp/${id}`,data)
} 

export const getAppliedJobs = (data) =>{
    return fetchInstance.post(`job/getJobs`,data)
} 