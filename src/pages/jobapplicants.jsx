import { useState } from "react";
import { Alert,Button,CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck,faCheck,faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery,useMutation } from "@tanstack/react-query";
import { getSingleJobs,updateJobStatus } from "../serveses/job";
import { getUsersApplications } from "../serveses/user";
import { useParams } from "react-router-dom";
import Loader from "../components/loding";
import TableShared from "../components/tableshared";
import { useTranslation } from "react-i18next";


const JobApplicantsPage = () =>{

    const {id} = useParams()
    const { t } = useTranslation()
    const[applicantStatus,setApplicantStatus]=useState(null)
    const[applicantID,setApplicantID]=useState(null)


    const {data:jobData,isPending,error,refetch} = useQuery({queryKey:["getjob",id],queryFn:()=>getSingleJobs(id)})
   
    const{data:jobApplicants,isPending:isLoad,error:err}=useQuery({queryKey:["getjobApplicants",id],
    queryFn:()=>getUsersApplications({applicantIds:jobData.data.receivedApplicants}),enabled:!!jobData
    })
    const{mutate:updateStatus,isPending:isLoadStatus}=useMutation({mutationFn:updateJobStatus})
    

    const UpdateTheStatus = (jobId,status) =>{
        setApplicantStatus(status)
        setApplicantID(jobId)
        updateStatus({id,data:{jobId,status}},{
            onSuccess:()=>{
                refetch()
                setApplicantID(null)
            }
        })
    }

    const tableHeader = ["app-name","app-skills","app-date","app-education","sop",
                "rating","soa","options"
    ]
    const tableBody = jobApplicants?.data.users.map((applicant,ind)=>{
        return{
            cell1:applicant.name,
            cell2:applicant.skills.join(", "),
            cell3:new Date(jobData.data.receivedApplicants[ind].dateOfApplication).toLocaleDateString(),
            cell4:applicant.education[0].institution.toUpperCase(),
            cell5:(<p className="m-w-[150px] overflow-hidden text-ellipsis text-nowrap">{jobData.data.receivedApplicants[ind].sop}</p>),
            cell6:applicant.rating,
            cell7:jobData.data.receivedApplicants[ind].status,
            cell8:jobData.data.receivedApplicants[ind].status!=="Rejected"?(
                <div className="flex justify-center gap-2">
                    {
                        jobData.data.receivedApplicants[ind].status==="Applied"&&
                        <Button 
                            variant="contained"
                            sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                            disableRipple
                            disableElevation
                            onClick={()=>UpdateTheStatus(jobData.data.receivedApplicants[ind]["_id"],"Shortlisted")}
                            startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faListCheck} />}
                            endIcon={(isLoadStatus&&applicantID==jobData.data.receivedApplicants[ind]["_id"]&&applicantStatus==="Shortlisted")?
                                <CircularProgress size={25} color="inherit" />
                                :
                                null
                            }
                        >
                            <span className="font-[700] rtl:mx-2">{t("shortList")}</span>
                        </Button>
                    }
                    {
                        jobData.data.receivedApplicants[ind].status==="Shortlisted"&&
                        <Button 
                            variant="contained"
                            sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                            disableRipple
                            disableElevation
                            onClick={()=>UpdateTheStatus(jobData.data.receivedApplicants[ind]["_id"],"Accepted")}
                            startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faCheck} />}
                            endIcon={(isLoadStatus&&applicantID==jobData.data.receivedApplicants[ind]["_id"]&&applicantStatus==="Accepted")?
                                <CircularProgress size={25} color="inherit" />
                                :
                                null
                            }
                        >
                            <span className="font-[700] rtl:mx-2">{t("accept")}</span>
                        </Button>
                    }
                    {
                        jobData.data.receivedApplicants[ind].status!=="Rejected"&&
                        <Button 
                            variant="contained"
                            sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                            disableRipple
                            disableElevation
                            onClick={()=>UpdateTheStatus(jobData.data.receivedApplicants[ind]["_id"],"Rejected")}
                            startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faXmark} />}
                            endIcon={(isLoadStatus&&applicantID==jobData.data.receivedApplicants[ind]["_id"]&&applicantStatus==="Rejected")?
                                <CircularProgress size={25} color="inherit" />
                                :
                                null
                            }
                        >
                            <span className="font-[700] rtl:mx-2">{t("reject")}</span>
                        </Button>
                    }
                </div>
            )
            :
            (<p>{t("no-options")}</p>)
        }
    })
    
    if(isPending || isLoad){
        return <Loader />
    }

    return(
        <div className="grid grid-cols-12 pt-10">
            <div className="col-[2/span_10] overflow-hidden">
                <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("all-apps")}</h3>
                {
                    (error || err)?
                    (<Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error?.message || err?.message}</Alert>):
                    !jobData?.data.receivedApplicants.length?
                    <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="info">{t("no-apply")}</Alert>
                    :tableBody.length!==0&&
                    <TableShared tableBody={tableBody} tableHeader={tableHeader} />

                }
                
            </div>
        </div>
    )
}
export default JobApplicantsPage;