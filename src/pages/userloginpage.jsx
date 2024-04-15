import React, { useContext, useEffect, useState } from "react";
import { CircularProgress,Alert } from "@mui/material";
import { useMutation } from "@tanstack/react-query"
import { userLogin } from "../serveses/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { useTranslation } from "react-i18next";


const LoginPage = () =>{

    const { t } = useTranslation()
    const[email,setEmail] = useState({value:"",error:""})
    const[password,setPassword] = useState({value:"",error:""})

    const {setIsLoggedIn} = useContext(AuthContext)
    const navigate = useNavigate()

    const { mutate:LoginUser,data,isPending,isSuccess,error } = useMutation({mutationFn:userLogin})

   
    useEffect(()=>{
        if(isSuccess){
            localStorage.setItem("token",JSON.stringify(data.data.token.split(" ")[1]))
            setIsLoggedIn(true)
            navigate("/myprofile")
        }
    },[isSuccess])



    const handleEmail = (e) =>{
        if(!e.target.value){
            setEmail({value:e.target.value,error:`${t("required")}`})
        }else{
            let regexEmail = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
            if(!e.target.value.match(regexEmail)){
                setEmail({value:e.target.value,error:`${t("invalid-email")}`})
            }else{
                setEmail({value:e.target.value,error:""})
            } 
        }   
    }

    const handlePassword = (e) =>{
        if(!e.target.value){
            setPassword({value:e.target.value,error:`${t("required")}`})
        }else{
            let regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            if(!e.target.value.match(regexPassword)){
                setPassword({value:e.target.value,error:`${t("password-base")}`})
            }else{
                setPassword({value:e.target.value,error:""})
            }
        }   
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!email.value || !password.value){
            if(!email.value){setEmail({...email,error:`${t("required")}`})}
            if(!password.value){setPassword({...password,error:`${t("required")}`})}
        }else{
            LoginUser({email:email.value,password:password.value})
        }
    }

    return(
        <div className="h-full grid grid-cols-12 pt-10">
            <div className="col-[2/span_10]">
                <h1 className="font-extrabold text-base-4 text-3xl mb-6">{t("login")}</h1>
                {
                    error&&
                    <Alert sx={{marginBottom:"10px",width:"fit-content"}} severity="error">
                        {error.response.data.error}
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
                           isPending&&
                            <CircularProgress size={25} color="inherit" />
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}
export default LoginPage;