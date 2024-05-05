import { useEffect, useState } from "react";
import { Alert,Button,CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck,faCheck,faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { getSingleJob,updateJob } from "../serveses/job";
import { useParams } from "react-router-dom";
import Loader from "../components/loding";
import TableShared from "../components/tableshared";
import { useTranslation } from "react-i18next";


const JobApplicantsPage = () =>{
    
    const queryClient = useQueryClient()
    const {id} = useParams()
    const { t } = useTranslation()
    const[applicantStatus,setApplicantStatus]=useState(null)
    const[applicantID,setApplicantID]=useState(null)
    const[jobApplicants,setJobApplicants] = useState([])
    let currentUserId = JSON.parse(localStorage.getItem("currentUserId"))


    const {data:Allusers} = queryClient.getQueriesData({queryKey: ["getusers"]})[0][1]
    const {data:jobData,isLoading,error,refetch} = useQuery({queryKey:["getjob",id],queryFn:()=>getSingleJob(currentUserId,id)})
    const{mutate:updateStatus,isPending:isLoadStatus}=useMutation({mutationFn:updateJob})
    

    useEffect(()=>{
        if(jobData){
            let applicants=[]
            jobData.data.receivedApplicants.forEach((item)=>{
                let users = Allusers.filter((user)=>user.id===item.id)
                applicants=[...applicants,...users]
           })
           setJobApplicants([...applicants])
       }
    },[jobData])

    const UpdateTheStatus = (applicantId,status) =>{
        
        let updatedApplication = status==="Accepted"?{
            ...jobData.data.receivedApplicants.filter((ele)=>ele.id===applicantId)[0],
            status,
            dateOfJoining:new Date()
        }:
        {
            ...jobData.data.receivedApplicants.filter((ele)=>ele.id===applicantId)[0],
            status,
        }
        let receivedApplicants=jobData.data.receivedApplicants.map((ele)=>{
            if(ele.id===updatedApplication.id){
                return updatedApplication;
            }else{
                return ele
            }
        })

        let handleNoOfAccepted = () =>{
            if(status==="Accepted"){return (jobData.data.noOfAccepted + 1)}
            else if(status==="Shortlisted"){return jobData.data.noOfAccepted}
            else if(status==="Rejected"){
                return jobData.data.noOfAccepted===0?0:jobData.data.noOfAccepted - 1 
            }
        }
        setApplicantStatus(status)
        setApplicantID(applicantId)
        updateStatus({
            userId:jobData.data.userId,
            jobId:jobData.data.id,
            data:{
                ...jobData.data,
                receivedApplicants,
                noOfAccepted:handleNoOfAccepted()
            }},{
            onSuccess:()=>{
                refetch()
                setApplicantID(null)
                setApplicantStatus(null)
            }
        })
    }

    const tableHeader = ["app-name","app-skills","app-date","app-education","sop",
                "employee-rating","soa","options"
    ]
    const tableBody = jobApplicants?.map((applicant,ind)=>{
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
                            onClick={()=>UpdateTheStatus(jobData.data.receivedApplicants[ind]["id"],"Shortlisted")}
                            startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faListCheck} />}
                            endIcon={(isLoadStatus&&applicantID==jobData.data.receivedApplicants[ind]["id"]&&applicantStatus==="Shortlisted")?
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
                            onClick={()=>UpdateTheStatus(jobData.data.receivedApplicants[ind]["id"],"Accepted")}
                            startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faCheck} />}
                            endIcon={(isLoadStatus&&applicantID==jobData.data.receivedApplicants[ind]["id"]&&applicantStatus==="Accepted")?
                                <CircularProgress size={25} color="inherit" />
                                :
                                null
                            }
                        >
                            <span className="font-[700] rtl:mx-2">{t("accept")}</span>
                        </Button>
                    }
                    {
                        (jobData.data.receivedApplicants[ind].status!=="Rejected" &&
                        jobData.data.receivedApplicants[ind].status!=="Accepted")?
                        <Button 
                            variant="contained"
                            sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                            disableRipple
                            disableElevation
                            onClick={()=>UpdateTheStatus(jobData.data.receivedApplicants[ind]["id"],"Rejected")}
                            startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faXmark} />}
                            endIcon={(isLoadStatus&&applicantID==jobData.data.receivedApplicants[ind]["id"]&&applicantStatus==="Rejected")?
                                <CircularProgress size={25} color="inherit" />
                                :
                                null
                            }
                        >
                            <span className="font-[700] rtl:mx-2">{t("reject")}</span>
                        </Button>
                        :
                        <p>{t("accept-no-options")}</p>
                    }
                </div>
            )
            :
            (<p>{t("no-options")}</p>)
        }
    })
    
    if(isLoading){
        return <Loader />
    }

    return(
        <div className="grid grid-cols-12 pt-10">
            <div className="col-[2/span_10] overflow-hidden">
                <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("all-apps")}</h3>
                {
                    (error)?
                    (<Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error.message}</Alert>):
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