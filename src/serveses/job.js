import { fetchInstance } from "./constants"

export const createNewJob = ({userId,data}) =>{
    return fetchInstance.post(`users/${userId}/jobs/`,data)
}

export const getAllRecruiterJobs = (userId) =>{
    return fetchInstance.get(`users/${userId}/jobs`)
}

export const getAllJobs = () =>{
    return fetchInstance.get(`jobs`)
}

export const getSingleJob = (userId,jobId) =>{
    return fetchInstance.get(`users/${userId}/jobs/${jobId}`)
} 

export const updateJob = ({userId,jobId,data}) =>{
    return fetchInstance.put(`users/${userId}/jobs/${jobId}`,data)
}

export const deleteJob = ({userId,jobId}) =>{
    return fetchInstance.delete(`users/${userId}/jobs/${jobId}`)
}
