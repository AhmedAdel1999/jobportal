import React, { useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { applyJob, getAllJobs, updateJob } from "../serveses/job"
import { Button,Alert, Modal,CircularProgress } from "@mui/material"
import TableShared from "../components/tableshared"
import { useToasts } from "react-toast-notifications"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { UpdateUser } from "../serveses/user"
import { useTranslation } from "react-i18next";
import Loader from "../components/loding"


const ALLRecruiterJobs = () =>{

    const[isOpen,setISOpen]=useState(false)
    const[jobID,setJobID]=useState(null)
    const sop = useRef("")

    const queryClient = useQueryClient()
    const { t } = useTranslation();
    const { addToast:notify } = useToasts()

    const {data:userData} = queryClient.getQueriesData({queryKey:["getuser"]})[0][1]
    const {data:AllJobs,isLoading,error,refetch} = useQuery({queryKey:["getalljobs"],queryFn:getAllJobs})
    const{mutate:ApplyForJob,isPending:isLoad,error:err}=useMutation({mutationFn:updateJob})
    const{mutate:AddJobToUser}=useMutation({mutationFn:UpdateUser})
    const AvailableJobs=AllJobs?.data.filter((job)=>new Date(job.deadline).getTime() - Date.now()>0)
    

    const handleApply = (e) =>{
        e.preventDefault();

        let jobAppliedData = AvailableJobs.filter((job)=>job.id===jobID)[0]
        ApplyForJob({userId:jobAppliedData.userId,jobId:jobID,
            data:{
                ...jobAppliedData,
                receivedApplicants:[
                    ...jobAppliedData.receivedApplicants,
                    {
                        id: userData.id,
                        email: userData.email,
                        sop: sop.current.value,
                        status:"Applied",
                        dateOfApplication:new Date()
                    }
                ]
        }},{
            onSuccess:async ()=>{
                setISOpen(false)
                notify(`You Have Applied For Job Successfully`,
                {appearance: 'success',autoDismiss:"true"})
                await AddJobToUser({
                    userId:userData.id,
                    data:{
                        ...userData,
                        jobsApplied:[
                            ...userData.jobsApplied,
                            jobAppliedData.id
                        ]
                    }
                })
                await refetch()              
            }
        })
    }


    const tableHeader = [
        "job-title","skills","recruiter-name","job-rate","salary",
        "duration","deadline","options"
    ]

    const tableBody = AvailableJobs?.map((job)=>{
        let checkApply = job.receivedApplicants.some((ele)=>ele.id==userData.id)
        return{
            cell1:job.title,
            cell2:job.skills.join(", "),
            cell3:job.name,
            cell4:(job.rating).toFixed(2),
            cell5:job.salary,
            cell6:job.duration,
            cell7:new Date(job.deadline).toLocaleDateString(),
            cell8:(
                <div>
                    {
                        userData.jobsApplied.length<10?
                            checkApply?
                            <span>{t("applied")}</span>
                            :
                            (job.receivedApplicants.length < job.maxApplicants && job.noOfAccepted < job.maxPositions)?
                            <React.Fragment>
                                <Button
                                    variant="contained"
                                    sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                                    disableRipple
                                    disableElevation
                                    onClick={()=>{
                                        setISOpen(true)
                                        setJobID(job.id)
                                    }}
                                    startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faPaperPlane} />}
                                >
                                    <span className="rtl:mx-2 rtl:font-[700]">{t("apply")}</span>
                                </Button>
                                <Modal
                                 open={isOpen&&jobID==job.id}
                                 onClose={()=>setISOpen(false)}
                                >
                                    <div className="modalstyle"
                                    >
                                        <h3 className="font-[700] text-xl text-base-4 mb-2">{t("job-apply")}</h3>
                                        <form onSubmit={handleApply} className="flex flex-col gap-y-3">
                                            <div className="flex flex-col gap-y-[5px]">
                                                <label className="font-bold text-base-4">{t("sop")}:</label>
                                                <textarea 
                                                className="inputstyle" 
                                                type="text" min="0" max="250" ref={sop}
                                                />
                                            </div>
                                            <button 
                                                className="btnstyle"
                                                type="submit"
                                            >
                                                <span className="mx-2">{t("apply")}</span>
                                                {
                                                    isLoad&&
                                                    <CircularProgress size={25} color="inherit" />
                                                }
                                            </button>
                                        </form>
                                    </div>
                                </Modal>
                            </React.Fragment>
                            :
                            <span>{t("full-positions")}</span>
                        :
                        <span>{t("cant-apply")}</span>
                    }
                </div>
            )
        }
    })


    if(isLoading){
        return <Loader />
    }
    return(
        <div className="grid grid-cols-12 pt-10">
            <div className="col-[2/span_10] overflow-hidden">
                <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("avialable-jobs")}</h3>
                {
                    (error || err)&&
                    <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error?.message || err?.message}</Alert>
                }
                {
                    AvailableJobs?.length>0?
                    <TableShared tableBody={tableBody} tableHeader={tableHeader} />
                    :
                    <Alert sx={{width:"fit-content"}} severity="info">{t("no-jobs")}</Alert>
                }
                
            </div>
        </div>
    )
}
export default ALLRecruiterJobs