import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Alert,Button,CircularProgress } from "@mui/material";
import { useToasts } from "react-toast-notifications";
import { useQuery,useMutation } from "@tanstack/react-query";
import { getAllJobs,deleteJob } from "../serveses/job";
import { useTranslation } from "react-i18next";
import Loader from "../components/loding";
import TableShared from "../components/tableshared";

const AllListings = () =>{

    const { addToast:notify } = useToasts()
    const { t } = useTranslation();

    let userId = JSON.parse(localStorage.getItem("currentUserId"))
    const[jobDeletedId,setJobDeletedId]=useState(null)
    const {data:AllJobs,isLoading,error,refetch} = useQuery({queryKey:["getalljobs"],queryFn:getAllJobs})
    const myJobs = AllJobs?.data.filter((job)=>job.userId===userId)
    const {mutate:deleteSingleJob,isSuccess,isPending:isLoad,error:err} = useMutation({mutationFn:deleteJob})


    useEffect(()=>{
       if(isSuccess){
        notify(`${t("delete-job")}`,
        {appearance: 'success',autoDismiss:"true"})
       }
    },[isSuccess])

    const handleDeleteJob = (id) =>{
        setJobDeletedId(id)
        deleteSingleJob({jobId:id,userId},{
            onSuccess:()=>{refetch()}
        })
    }
    
    const tableHeader=[
        "title","posting-date","no-accepted","no-apps",
        "no-positions","options"
    ]

    const tableBody =myJobs?.map((job)=>{
        return{
            cell1:job.title,
            cell2:new Date(job.dateOfPosting).toLocaleDateString(),
            cell3:job.noOfAccepted,
            cell4:job.receivedApplicants.length,
            cell5:job.maxPositions,
            cell6:(
                <div className="flex justify-center gap-2">
                    <Button 
                      component={Link} to={`/editjob/${job.id}`}
                      variant="contained"
                      sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                      disableRipple
                      disableElevation
                      startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faEdit} />}
                    >
                        <span className="font-[700] rtl:mx-2">{t("edit")}</span>
                    </Button>
                    <Button
                    onClick={()=>handleDeleteJob(job.id)}
                      variant="contained"
                      sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                      disableRipple
                      disableElevation
                      startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faTrashCan} />}
                      endIcon={(isLoad&&job.id==jobDeletedId)?<CircularProgress size={25} color="inherit" />:null}
                    >
                        <span className="font-[700] rtl:mx-2">{t("delete")}</span>
                    </Button>
                    <Button 
                       component={Link} to={`/jobapplicants/${job.id}`}
                       variant="contained"
                        sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                        disableRipple
                        disableElevation
                        startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faUsers} />}
                    >
                        <span className="font-[700] rtl:mx-2">{t("applicants")}</span>
                    </Button>
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
               <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("your-listings")}</h3>
               {
                (error||err)&&
                <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error?.message ||err?.message}</Alert>
               }
               {
                !myJobs?.length&&
                <Alert sx={{width:"fit-content"}} severity="info">You Don,t Have Any Job Listings</Alert>
               }
               {
                myJobs?.length?
                (<TableShared tableBody={tableBody} tableHeader={tableHeader} />)
                :
                null
               }
            </div>
        </div>
    )
}
export default AllListings;