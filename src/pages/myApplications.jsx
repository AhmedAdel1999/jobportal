import React, { useRef, useState } from "react";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import { getAppliedJobs, updateJob } from "../serveses/job";
import Loader from "../components/loding";
import { Button, Modal,CircularProgress,Alert } from "@mui/material";
import TableShared from "../components/tableshared";
import { useTranslation } from "react-i18next";

const MYApplications = () =>{

    const [isOpen,setISOpen]=useState(false)
    const[jobID,setJobID]=useState(null)
    const rating = useRef(0)

    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const {data:userData}=queryClient.getQueryData(["getuser"])
    const{data:AppliedJobs,isPending,error,refetch} = useQuery({queryKey:["getAllAppliedJobs"],queryFn:()=>getAppliedJobs({jobIds: userData.jobsApplied})})
    const{mutate:AddJobRate,isPending:isLoad,error:err} = useMutation({mutationFn:updateJob})


    const handleRate = (e) =>{
        e.preventDefault();
        AddJobRate({id:jobID,data:{rating:rating.current.value}},{
            onSuccess:()=>{
                setISOpen(false)
                refetch()
            }
        })
    }

    const tableHeader = [
        "job-title","joining-date","salary",
        "recruiter-name","job-status","rate-job"
    ]

    const tableBody=AppliedJobs?.data.jobs.map((job)=>{
        let applicant = job.receivedApplicants.filter((ele)=>ele.email==userData.email)[0]
        return{
           cell1:job.title,
           cell2:!applicant?.dateOfJoining || applicant?.status=="Rejected"?`${t("not-accepted-yet")}`:new Date(applicant.dateOfJoining).toLocaleDateString(),
           cell3:job.salary,
           cell4:job.name,
           cell5:applicant?.status,
           cell6:(
            <div>
                {
                    applicant.status==="Accepted"?
                    <React.Fragment>
                        <Button
                            variant="contained"
                            sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                            disableRipple
                            disableElevation
                            onClick={()=>{
                                setISOpen(true)
                                setJobID(job._id)
                            }}
                        >
                            {t("rate")}
                        </Button>
                        <Modal
                            open={isOpen&&job._id==jobID}
                            onClose={()=>{setISOpen(false)}}
                        >
                        <div
                        className="modalstyle"
                        >
                            <h3 className="font-[700] text-xl text-base-4 mb-2">{t("rate-job")}</h3>
                            <form onSubmit={handleRate} className="flex flex-col gap-y-3">
                                <div className="flex flex-col gap-y-[5px]">
                                    <label className="font-bold text-base-4">{t("rating")}:</label>
                                    <input 
                                    className="inputstyle" 
                                    type="number" min="0" max="5" ref={rating}
                                    />
                                </div>
                                <button 
                                    className="btnstyle"
                                    type="submit"
                                >
                                    <span className="mx-2">{t("add-rate")}</span>
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
                    <span>{t("only-accepted")}</span>
                }
            </div>
           )
        }
    })

    
    if(isPending){
        return <Loader />
    }

    return(
        <div className="grid grid-cols-12 pt-10">
            <div className="col-[2/span_10] overflow-hidden">
                <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("all-myjobs-apps")}</h3>
                {
                    (error || err)&&
                    <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error?.message || err?.message}</Alert>
                }
                {
                    AppliedJobs?.data?.jobs.length>0?
                    <TableShared tableBody={tableBody} tableHeader={tableHeader} />
                    :
                    <Alert sx={{width:"fit-content"}} severity="info">{t("have-no-apps")}</Alert>
                }
            </div>
        </div>
    )
}
export default MYApplications;