import React, { useContext, useEffect, useState } from "react";
import { CircularProgress,Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "../serveses/user";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { useTranslation } from "react-i18next";


const LoginPage = () =>{

    const {data:AllUsers} = useQuery({queryKey:["getusers"],queryFn:getAllUsers})
    const { t } = useTranslation()
    const[email,setEmail] = useState({value:"",error:""})
    const[password,setPassword] = useState({value:"",error:""})
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)

    const {setIsLoggedIn} = useContext(AuthContext)
    const navigate = useNavigate()
   

    const handleEmail = (e) =>{
        if(!e.target.value){
            setEmail({value:e.target.value,error:`${t("required")}`})
        }else{
            setEmail({value:e.target.value,error:""})
        }   
    }

    const handlePassword = (e) =>{
        if(!e.target.value){
            setPassword({value:e.target.value,error:`${t("required")}`})
        }else{
            setPassword({value:e.target.value,error:""})
        }   
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!email.value || !password.value){
            if(!email.value){setEmail({...email,error:`${t("required")}`})}
            if(!password.value){setPassword({...password,error:`${t("required")}`})}
        }else{
            setLoading(true)
            let currentUserId
            let isExist = false
            try{
                if(AllUsers.data.length){
                    for(let i=0; i<AllUsers.data.length; i++){
                        if(AllUsers.data[i].email===email.value && AllUsers.data[i].password===password.value){
                            isExist=true
                            currentUserId=AllUsers.data[i].id
                            break;
                        }
                    }
                    if(isExist){
                        localStorage.setItem("currentUserId",JSON.stringify(currentUserId))
                        setIsLoggedIn(true)
                        navigate("/myprofile")
                    }else{
                    throw new Error("user not found or password don,t match")
                    }
                }else{
                    throw new Error("User Not Found")
                }
            }catch(error){
                setError(error.message)
                setLoading(false)
            }
        }
    }

    return(
        <div className="h-full grid grid-cols-12 pt-10">
            <div className="col-[2/span_10]">
                <h1 className="font-extrabold text-base-4 text-3xl mb-6">{t("login")}</h1>
                {
                    error&&
                    <Alert sx={{marginBottom:"10px",width:"fit-content"}} severity="error">
                        {error}
                    </Alert>
                }
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-3 pb-5">

                    <div className="flex flex-col gap-y-[5px]">
                        <label className="capitalize text-base text-base-4 font-bold">{t("email")}</label>
                        <input 
                          className="inputstyle placeholder:text-white" 
                          type="text" value={email.value} onChange={handleEmail} 
                          placeholder="examle@gmail.com"
                        />
                        {
                            email.error&&
                            <span className="text-white">{email.error}</span>
                        }
                    </div>

                    <div className="flex flex-col gap-y-[5px]">
                        <label className="capitalize text-base text-base-4 font-bold">{t("password")}</label>
                        <input 
                          className="inputstyle" 
                          type="password" value={password.value} onChange={handlePassword} 
                        />
                        {
                            password.error&&
                            <span className="text-white">{password.error}</span>
                        }
                    </div>

                    <button 
                        className="btnstyle"
                        type="submit"
                    >
                        <span className="mx-2">{t("login")}</span>
                        {
                           loading&&
                            <CircularProgress size={25} color="inherit" />
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}
export default LoginPage;