import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd,faMinus } from '@fortawesome/free-solid-svg-icons'
import { Box,Autocomplete,TextField,CircularProgress, Alert } from "@mui/material";
import { useQuery,useMutation } from "@tanstack/react-query";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { UpdateUser,getUser } from "../serveses/user";
import { langsList } from "../serveses/constants";
import Loader from "../components/loding";
import { AuthContext } from "../context/authcontext";



const ProfilePage = () =>{
    
    const {data:currentUser,isPending:isLoadUser,refetch} = useQuery({queryKey:["getuser"],
    queryFn:()=>getUser(JSON.parse(localStorage.getItem("currentUserId")))})
    const { addToast:notify } = useToasts()
    const { t } = useTranslation();

    const {setUserData} = useContext(AuthContext)
    const[contact,setContact] = useState({value:"",error:""})
    const[bio,setBio]=useState("")
    const[skills,setSkills] = useState([])
    const[education,setEducation] = useState([])

     
    const { mutate:EditProfile,isPending:isLoading,error} = useMutation({mutationFn:UpdateUser,
        onSuccess:()=>{
            refetch()
            notify(`${t("update-profile")}`,
            {appearance: 'success',autoDismiss:"true"})
        }
    })

    useEffect(()=>{
       if(currentUser){
        setContact({value:currentUser.data.contact,error:""})
        setBio(currentUser.data.bio)
        setSkills(currentUser.data.skills)
        setEducation(currentUser.data.education)
        setUserData(currentUser)
       }
    },[currentUser])

    

    const handleContact = (e) =>{
        if(e.target.value.length>10){
            setContact({value:e.target.value,error:`${t("contact-issue")}`})
        }else{
            setContact({value:e.target.value,error:""})
        }   
    }

    const handleInputChange = (index,event) =>{
        const values = [...education]
        values[index][event.target.name]=event.target.value
        setEducation(values)
    }

    const handleSubmit = (e) =>{
          e.preventDefault();
          EditProfile({userId:currentUser.data.id,data:{
            bio,
            contact:contact.value,
            education,
            skills
          }})  
    }

    if(isLoadUser){
        return <Loader />
    }

    return(
        <div className="h-full grid grid-cols-12 pt-10">
            <div className="col-[2/span_10]">

                <div className="mb-4">
                    <p className="font-bold text-xl text-base-4">
                        {t("hi")} 
                       <span>{currentUser?.data.name}!</span>
                    </p>
                    <p className="font-bold text-base-4">{t("current-details")}</p>
                </div>

                {
                    error&&
                    <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error.message}</Alert>
                }

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-3 pb-5">

                   <div className="flex flex-col gap-y-[5px]">
                        <label className="font-bold text-base-4">{t("name")}</label>
                        <input 
                          className="inputstyle" 
                          type="text" 
                          value={currentUser?.data.name} 
                          disabled
                        />
                    </div>

                    <div className="flex flex-col gap-y-[5px]">
                        <label className="font-bold text-base-4">{t("email")}</label>
                        <input 
                          className="inputstyle placeholder:text-white" 
                          type="text" 
                          value={currentUser?.data.email}
                          disabled
                        />
                    </div>

                    <div className="flex flex-col gap-y-[5px]">
                        <label className="font-bold text-base-4">{t("role")}</label>
                        <select 
                            className="inputstyle"
                            value={currentUser?.data.role} 
                            disabled
                        >
                            <option value="Aplicant">{t("aplicant")}</option>
                            <option value="Recruiter">{t("recruiter")}</option>
                        </select>
                    </div>
                    {
                        currentUser?.data.role==="Recruiter"?
                        (
                            <React.Fragment>
                                <div className="flex flex-col gap-y-[5px]">
                                    <label className="font-bold text-base-4">{t("contact-no")}</label>
                                    <input 
                                    className="inputstyle" 
                                    type="text" value={contact.value} onChange={handleContact} 
                                    />
                                    {
                                        contact.error&&
                                        <span className="text-white">{contact.error}</span>
                                    }
                                </div>
                                <div className="flex flex-col gap-y-[5px]">
                                    <label className="font-bold text-base-4">{t("bio")}</label>
                                    <input 
                                    className="inputstyle" 
                                    type="text" value={bio} onChange={(e)=>setBio(e.target.value)} 
                                    />
                                </div>
                            </React.Fragment>
                        )
                        :
                        (
                            <React.Fragment>
                                <div className="flex flex-wrap items-center justify-between">
                                    <h3 className="font-bold text-base-4">
                                    {t("education")}
                                    </h3>
                                    {
                                        !education.length&&<p>{t("add-education")}</p>
                                    }
                                    <div className="flex gap-x-3">
                                        <span 
                                           className="cursor-pointer text-xl w-[40px] h-[40px] rounded-[50%] flex items-center justify-center hover:bg-base-3 hover:text-white" 
                                           onClick={()=>{
                                            let newArr = education.slice(0,education.length-1)
                                            setEducation(newArr)
                                           }}
                                        >
                                            <FontAwesomeIcon icon={faMinus}/>
                                        </span>
                                        <span 
                                           className="cursor-pointer text-xl w-[40px] h-[40px] rounded-[50%] flex items-center justify-center hover:bg-base-3 hover:text-white" 
                                           onClick={()=>setEducation([...education,{institution:"",startYear:"",endYear:""}])}
                                        >
                                        <FontAwesomeIcon icon={faAdd}/>
                                        </span>
                                    </div>
                                </div>
                                {
                                    education.map((ele,index)=>{
                                        return(
                                            <div className="flex flex-wrap gap-x-3" key={index}>
                                                <div className="flex grow flex-col gap-y-[5px]">
                                                    <label className="text-base-4">{t("institution")}</label>
                                                    <input 
                                                        className="inputstyle placeholder:text-white" 
                                                        type="text" value={ele.institution} name="institution"
                                                        onChange={(e)=>handleInputChange(index,e)} 
                                                    />
                                                </div>
                                                <div className="flex grow flex-col gap-y-[5px]">
                                                    <label className="text-base-4">{t("start-year")}</label>
                                                    <input 
                                                        className="inputstyle placeholder:text-white" 
                                                        type="number" min={1970} value={ele.startYear} name="startYear" 
                                                        onChange={(e)=>handleInputChange(index,e)} 
                                                    />
                                                </div>
                                                <div className="flex grow flex-col gap-y-[5px]">
                                                    <label className="text-base-4">{t("end-year")}</label>
                                                    <input 
                                                        className="inputstyle placeholder:text-white" 
                                                        type="number" min={1970} value={ele.endYear} name="endYear" 
                                                        onChange={(e)=>handleInputChange(index,e)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className="flex flex-col gap-y-[5px]">
                                   <label className="font-bold text-base-4">{t("skills")}:</label>
                                   <Autocomplete
                                        className="autocompletestyle"
                                        options={langsList}
                                        value={skills}
                                        onChange={(_event,newValue) => {
                                            setSkills(newValue)
                                        }}
                                        multiple
                                        renderInput={(params) => 
                                        (<TextField 
                                        className="[&.MuiTextField-root>.MuiOutlinedInput-root]:p-0"  {...params}  />)}
                                        renderOption={(props, option) => (
                                            <Box  component="li" {...props}>
                                                {option}
                                            </Box>
                                        )}
                                    />
                                </div>
                            </React.Fragment>
                        )
                    }

                    <button 
                        className="btnstyle"
                        type="submit"
                    >
                        <span className="mx-2">
                            {t("edit")}
                        </span>
                        {
                            isLoading&&
                            <CircularProgress size={25} color="inherit" />
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}
export default ProfilePage;