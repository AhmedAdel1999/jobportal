import { useEffect, useState } from "react";
import { CircularProgress,Alert,Box,TextField,Autocomplete } from "@mui/material";
import { langsList } from "../serveses/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToasts } from "react-toast-notifications";
import { updateJob } from "../serveses/job";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditJobPage = () =>{

    const {id} = useParams()
    const navigate = useNavigate()
    const { addToast:notify } = useToasts()
    const queryClient = useQueryClient()
    const { t } = useTranslation()

    const {data:allJobs} = queryClient.getQueryData(["alljobs"])
    const jobData = allJobs.filter((ele)=>ele._id==id)[0]
    const{ mutate:EditJob,isPending,error,isSuccess} = useMutation({mutationFn:updateJob})

    const [currentjob,setCurrentJob] = useState({
        title:{value:jobData.title,error:""},
        maxApps:{value:jobData.maxApplicants,error:""},
        maxPos:{value:jobData.maxPositions,error:""},
        skills:{value:jobData.skills,error:""},
        jobType:{value:jobData.typeOfJob,error:""},
        duration:{value:jobData.duration,error:""},
        salary:{value:jobData.salary,error:""},
        deadline:{value:jobData.deadline.slice(0,jobData.deadline.indexOf(".")),error:""}
    })

    useEffect(()=>{
         if(isSuccess){
            notify(`${t("update-job")}`,
            {appearance: 'success',autoDismiss:"true"})
            navigate("/mylistings")
         }
    },[isSuccess])

    const handleInputChange = (e) =>{
        const {name,value} = e.target
        if(!value || !value.length){
            setCurrentJob({
                ...currentjob,
                [name]:{value:value,error:`${t("fill-field")}`}
            })
        }else{
            setCurrentJob({
                ...currentjob,
                [name]:{value:value,error:""}
            })
        }
    }


    const onSubmit = (e) =>{
        e.preventDefault()
        if(!currentjob.deadline.value ||!currentjob.maxApps.value||!currentjob.maxPos.value){  
            let obj={...currentjob}
             for(let key in currentjob){
                if(!currentjob[key].value || !currentjob[key].value.length){
                    obj={...obj,[key]:{value:currentjob[key].value,error:`${t("fill-field")}`}}
                }
             }
             setCurrentJob(obj)
         }else{
            let obj={}
             for(let key in currentjob){
                obj={...obj,[key]:currentjob[key].value}
             }
             EditJob({id,data:{...obj}})
         }
    }

    
    
    return(
        <div className="grid grid-cols-12 pt-10">
            <div className="col-[2/span_10]">
                <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("edit-current-job")}</h3>
                {
                    error&&
                    <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error.message}</Alert>
                }
                <form onSubmit={onSubmit} className="flex flex-col gap-y-5 pb-6">

                   <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("job-title")}:</label>
                        <input value={currentjob.title.value} name="title" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="text" />
                        {currentjob.title.error&&<span className="text-white capitalize">{currentjob.title.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("max-no-apps")}:</label>
                        <input value={currentjob.maxApps.value} name="maxApps" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {currentjob.maxApps.error&&<span className="text-white capitalize">{currentjob.maxApps.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("max-no-available")}:</label>
                        <input value={currentjob.maxPos.value} name="maxPos" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {currentjob.maxPos.error&&<span className="text-white capitalize">{currentjob.maxPos.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("deadline")}:</label>
                        <input value={currentjob.deadline.value} name="deadline" onChange={(e)=>handleInputChange(e)} className="inputstyle w-fit" type="datetime-local" />
                        {currentjob.deadline.error&&<span className="text-white capitalize">{currentjob.deadline.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("required-skills")}:</label>
                        <Autocomplete
                            className="autocompletestyle"
                            options={langsList}
                            value={currentjob.skills.value}
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
                        {currentjob.skills.error&&<span className="text-white capitalize">{currentjob.skills.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("job-type")}:</label>
                        <Autocomplete
                            className="autocompletestyle [&>div>div>input.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input]:text-white"
                            value={currentjob.jobType.value}
                            options={["Full-time","Part-time","Work From Home"]}
                            onChange={(_event,newValue) => {
                                handleInputChange({target:{name:"jobType",value:newValue}})
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
                        {currentjob.jobType.error&&<span className="text-white capitalize">{currentjob.jobType.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("duration")}:</label>
                        <input value={currentjob.duration.value} name="duration" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {currentjob.duration.error&&<span className="text-white capitalize">{currentjob.duration.error}</span>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className=" capitalize text-base text-base-4 font-bold">{t("salary")}:</label>
                        <input value={currentjob.salary.value} name="salary" onChange={(e)=>handleInputChange(e)} className="inputstyle" type="number" />
                        {currentjob.salary.error&&<span className="text-white capitalize">{currentjob.salary.error}</span>}
                    </div>

                    <div className="flex justify-start">
                        <button 
                            className="btnstyle"
                            type="submit"
                        >
                            <span className="mx-2">{t("edit-job")}</span>
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
export default EditJobPage;