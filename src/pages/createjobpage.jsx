import { useEffect, useState } from "react";
import { Autocomplete,TextField,Box,CircularProgress,Alert } from "@mui/material";
import { langsList } from "../serveses/constants";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { createNewJob } from "../serveses/job";
import { useNavigate } from "react-router-dom";

const CreateJobPage = () =>{

    const [newjob,setNewJob] = useState({
        title:{value:"",error:""},
        maxApplicants:{value:"",error:""},
        maxPositions:{value:"",error:""},
        deadline:{value:"",error:""},
        skills:{value:[],error:""},
        typeOfJob:{value:"",error:""},
        duration:{value:"",error:""},
        salary:{value:"",error:""},
    })
    const queryClient = useQueryClient()
    const { t } = useTranslation();
    const userdata = queryClient.getQueriesData({queryKey:["getuser"]})[0][1]
    
    const navigate = useNavigate()
    const { addToast:notify } = useToasts()
    const{ mutate:AddNewJob,isPending,error,isSuccess} = useMutation({mutationFn:createNewJob})

    useEffect(()=>{
         if(isSuccess){
            notify(`${t("add-job")}`,
            {appearance: 'success',autoDismiss:"true"})
            navigate("/mylistings")
         }
    },[isSuccess])

    const handleInputChange = (e) =>{
        const {name,value} = e.target
        if(!value || !value.length){
            setNewJob({
                ...newjob,
                [name]:{value:value,error:`${t("fill-field")}`}
            })
        }else{
            setNewJob({
                ...newjob,
                [name]:{value:value,error:""}
            })
        }
    }


    const onSubmit = (e) =>{
        e.preventDefault()
        if(
            !newjob.deadline.value||!newjob.duration.value ||!newjob.maxApplicants.value||
            !newjob.maxPositions.value||!newjob.salary.value||!newjob.skills.value.length||
            !newjob.title.value||!newjob.typeOfJob.value
         ){  
            let obj={...newjob}
             for(let key in newjob){
                if(!newjob[key].value || !newjob[key].value.length){
                    obj={...obj,[key]:{value:newjob[key].value,error:`${t("fill-field")}`}}
                }
             }
             setNewJob(obj)
         }else{
            let obj={}
             for(let key in newjob){
                obj={...obj,[key]:newjob[key].value}
             }
             AddNewJob({
                
                data:{
                    ...obj,
                    salary:Number(obj.salary),
                    maxApplicants:Number(obj.maxApplicants),
                    maxPositions:Number(obj.maxPositions),
                    rating:0,
                    noOfAccepted:0,
                    email:userdata.data.email,
                    name:userdata.data.name,
                    dateOfPosting:new Date()
                },
                userId:userdata.data.id
             })
         }
    }


    return(
        <div className="grid grid-cols-12 pt-10">
            <div className="col-[2/span_10]">
                <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("create-new-job")}</h3>
                {
                    error&&
                    <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error.message}</Alert>
                }
                <form onSubmit={onSubmit} className="flex flex-col gap-y-5 pb-6">

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("job-title")}:</label>
                        <input name="title" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="text" />
                        {newjob.title.error&&<span className="text-white capitalize">{newjob.title.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("max-no-apps")}</label>
                        <input name="maxApplicants" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {newjob.maxApplicants.error&&<span className="text-white capitalize">{newjob.maxApplicants.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("max-no-available")}</label>
                        <input name="maxPositions" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {newjob.maxPositions.error&&<span className="text-white capitalize">{newjob.maxPositions.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("deadline")}:</label>
                        <input name="deadline" onChange={(e)=>handleInputChange(e)} className="inputstyle w-fit" type="datetime-local" />
                        {newjob.deadline.error&&<span className="text-white capitalize">{newjob.deadline.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("required-skills")}:</label>
                        <Autocomplete
                            className="autocompletestyle"
                            options={langsList}
                            onChange={(_event,newValue) => {
                                handleInputChange({target:{name:"skills",value:newValue}})
                            }}
                            multiple
                            renderInput={(params) => 
                            (<TextField
                            className="[&.MuiTextField-root>.MuiOutlinedInput-root]:p-0"  {...params}  />)}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    {option}
                                </Box>
                            )}
                        />
                        {newjob.skills.error&&<span className="text-white capitalize">{newjob.skills.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("job-type")}:</label>
                        <Autocomplete
                            className="autocompletestyle [&>div>div>input.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input]:text-white"
                            options={["Full-time","Part-time","Work From Home"]}
                            onChange={(_event,newValue) => {
                                handleInputChange({target:{name:"typeOfJob",value:newValue}})
                            }}
                            renderInput={(params) => 
                            (<TextField 
                            className="[&.MuiTextField-root>.MuiOutlinedInput-root]:p-0"  {...params}  />)}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    {t(`${option}`)}
                                </Box>
                            )}
                        />
                        {newjob.typeOfJob.error&&<span className="text-white capitalize">{newjob.typeOfJob.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("duration")}:</label>
                        <input name="duration" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {newjob.duration.error&&<span className="text-white capitalize">{newjob.duration.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("salary")}:</label>
                        <input name="salary" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {newjob.salary.error&&<span className="text-white capitalize">{newjob.salary.error}</span>}
                    </div>

                    <div className="flex justify-start">
                    <button 
                        className="btnstyle"
                        type="submit"
                    >
                        <span className="mx-2">{t("create")}</span>
                        {
                            isPending&&
                            <CircularProgress size={25} color="inherit" />
                        }
                    </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default CreateJobPage;