import axios from "axios"

const langsList = ["Python","Java","C","C++","HTML","CSS","JavaScript","TypeScript","Ruby","Swift","Kotlin","Go"]
const fetchInstance = axios.create({
    baseURL:'https://jobportalapi-722r.onrender.com/'
})
export {langsList,fetchInstance}