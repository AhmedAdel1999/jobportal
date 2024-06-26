import { useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Alert, Button, Modal, CircularProgress } from "@mui/material"
import { getAllJobs } from "../serveses/job"
import Loader from "../components/loding"
import TableShared from "../components/tableshared"
import { UpdateUser, getAllUsers } from "../serveses/user"
import { useTranslation } from "react-i18next";

const AllEmpolyees = () =>{

    const currentUserId = JSON.parse(localStorage.getItem("currentUserId"))
    const[isOpen,setISOpen]=useState(false)
    const[applicantId,setApplicantId]=useState(null)
    const employeeRate=useRef(0)

    const { t } = useTranslation();
    const {data:AllJobs,isLoading:LoadJobs,error} = useQuery({queryKey:["getalljobs"],queryFn:getAllJobs})
    const {data:AllUsers,isLoading:LoadUsers,refetch} = useQuery({queryKey:["getusers"],queryFn:getAllUsers})
    const {mutate:RateApplicant,isPending:isLoad,error:err} = useMutation({mutationFn:UpdateUser})
    const myOwnApplicantedJobs = AllJobs&&AllJobs.data.filter((job)=>job.userId===currentUserId&&job.receivedApplicants.length!=0);
    const AllJobAcceptedApplicants=[];
    

    (
        function(){
            myOwnApplicantedJobs?.forEach((job)=>{{
                job.receivedApplicants.forEach((ele)=>{
                    
                if(ele.status==="Accepted"){
                    let applicant = AllUsers?.data.filter((user)=>user.id==ele.id)[0]
                    AllJobAcceptedApplicants.push(
                        {
                            typeOfJob:job.typeOfJob,
                            jobTitle:job.title,
                            dateOfJoining:ele.dateOfJoining,
                            rating:applicant?.rating&&(applicant?.rating).toFixed(2),
                            name:applicant?.name,
                            id:ele.id
                        }
                    )
                }
            })
        }})
    }
    )()

    const handleRate = (e) =>{
       e.preventDefault();
       const currentApplicant = AllUsers?.data.filter((user)=>user.id===applicantId)[0]
       RateApplicant({
        userId:applicantId,
        data:{
            ...currentApplicant,
            rating:(Number(currentApplicant.rating)+Number(employeeRate.current.value))/2
        }},{
        onSuccess:()=>{
            setISOpen(false)
            refetch()
        }
       })
    }
    
    const tableHeader =[
        "employee-name","joining-date","job-type","job-title",
        "employee-rating","employee-rate"
    ]
    const tableBody=AllJobAcceptedApplicants.map((ele)=>{
        return{
            cell1:ele.name,
            cell2:new Date(ele.dateOfJoining).toLocaleDateString(),
            cell3:ele.typeOfJob,
            cell4:ele.jobTitle,
            cell5:ele.rating,
            cell6:(
              <div>
                <Button
                    variant="contained"
                    sx={{background:"#6BB2A0","&:hover":{background:"#6BB2A0"}}}
                    disableRipple
                    disableElevation
                    onClick={()=>{
                        setISOpen(true)
                        setApplicantId(ele.id)
                    }}
                >
                   <span className="font-[700] text-lg">{t("rate")}</span>
                </Button>
                <Modal
                    open={isOpen&&ele.id===applicantId}
                    onClose={()=>{setISOpen(false)}}
                >
                  <div
                  className="modalstyle"
                  >
                    <h3 className="font-[700] text-xl text-base-4 mb-2">
                        {t("employee-rate")} {ele.name}
                    </h3>
                    <form onSubmit={handleRate} className="flex flex-col gap-y-3">
                        <div className="flex flex-col gap-y-[5px]">
                            <label className="font-bold text-base-4">{t("rating")}:</label>
                            <input 
                            className="inputstyle" 
                            type="number" min="0" max="5" ref={employeeRate}
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
              </div>
            )
        }
    })

    if(LoadJobs || LoadUsers){
        return <Loader />
    }
    return(
        <div className="grid grid-cols-12 pt-10">
            <div className="col-[2/span_10] overflow-hidden">
                <h3 className="text-2xl text-base-4 font-[700] mb-8">{t("all-employee")}</h3>
                {
                    (error || err)&&
                    <Alert sx={{marginBottom:"16px",width:"fit-content"}} severity="error">{error?.message || err?.message}</Alert>
                }
                {
                 AllJobAcceptedApplicants.length>0?
                 <TableShared tableBody={tableBody} tableHeader={tableHeader} />
                 :
                <Alert sx={{width:"fit-content"}} severity="info">{t("no-employees")}</Alert>
               }
            </div>
        </div>
    )
}
export default AllEmpolyees