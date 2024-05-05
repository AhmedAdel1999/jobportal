import axios from "axios"

const langsList = ["Python","Java","C","C++","HTML","CSS","JavaScript","TypeScript","Ruby","Swift","Kotlin","Go"]
const fetchInstance = axios.create({
    baseURL:'https://6633efe2f7d50bbd9b4b24df.mockapi.io/jobportal/'
})
export {langsList,fetchInstance}