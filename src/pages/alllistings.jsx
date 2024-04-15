import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Alert,Button,CircularProgress } from "@mui/material";
import { useToasts } from "react-toast-notifications";
import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import { getAllJobs,deleteJob } from "../serveses/job";
import { useTranslation } from "react-i18next";
import Loader from "../components/loding";
import TableShared from "../components/tableshared";


const AllListings = () =>{

    const queryClient = useQueryClient()
    const { addToast:notify } = useToasts()
    const { t } = useTranslation();
    const[jobDeletedId,setJobDeletedId]=useState(null)
    const {data:userdata} = queryClient.getQueryData(["getuser"])
    const {data:AllJobs,isPending,error,refetch} = useQuery({queryKey:["alljobs"],queryFn:getAllJobs})
    const {mutate:deleteSingleJob,isSuccess,isPending:isLoad,error:err} = useMutation({mutationFn:deleteJob})
    const myJobs = AllJobs?AllJobs.data.filter((job)=>userdata.email===job.email):[]

    useEffect(()=>{
       if(isSuccess){
        notify(`${t("delete-job")}`,
        {appearance: 'success',autoDismiss:"true"})
       }
    },[isSuccess])

    const handleDeleteJob = (id) =>{
        setJobDeletedId(id)
        deleteSingleJob(id,{
            onSuccess:()=>{refetch()}
        })
    }
    
    const tableHeader=[
        "title","posting-date","no-apps",
        "no-positions","options"
    ]

    const tableBody =myJobs.map((job)=>{
        return{
            cell1:job.title,
            cell2:new Date(job.dateOfPosting).toLocaleDateString(),
            cell3:job.receivedApplicants.length,
            cell4:job.maxPositions,
            cell5:(
                <div className="flex justify-center gap-2">
                    <Button 
                      component={Link} to={`/editjob/${job._id}`}
                      variant="contained"
                      sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                      disableRipple
                      disableElevation
                      startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faEdit} />}
                    >
                        <span className="font-[700] rtl:mx-2">{t("edit")}</span>
                    </Button>
                    <Button
                    onClick={()=>handleDeleteJob(job._id)}
                      variant="contained"
                      sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                      disableRipple
                      disableElevation
                      startIcon={<FontAwesomeIcon style={{margin:"0px"}} icon={faTrashCan} />}
                      endIcon={(isLoad&&job._id==jobDeletedId)?<CircularProgress size={25} color="inherit" />:null}
                    >
                        <span className="font-[700] rtl:mx-2">{t("delete")}</span>
                    </Button>
                    <Button 
                       component={Link} to={`/jobapplicants/${job._id}`}
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

    if(isPending){
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
                !myJobs.length&&
                <Alert sx={{width:"fit-content"}} severity="info">You Don,t Have Any Job Listings</Alert>
               }
               {
                myJobs.length?
                (<TableShared tableBody={tableBody} tableHeader={tableHeader} />)
                :
                null
               }
            </div>
        </div>
    )
}
export default AllListings;