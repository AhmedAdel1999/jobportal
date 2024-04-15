import React, { useEffect, useState } from "react";
import { Box,Autocomplete,TextField,CircularProgress, Alert } from "@mui/material";
import { langsList } from "../serveses/constants";
import { useMutation } from "@tanstack/react-query"
import { userRegister } from "../serveses/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const RegisterPage = () =>{
    const[name,setName] = useState({value:"",error:""})
    const[email,setEmail] = useState({value:"",error:""})
    const[role,setRole] = useState("Aplicant")
    const[password,setPassword] = useState({value:"",error:""})
    const[confirmPassword,setConfirmPassword] = useState({value:"",error:""})
    const[institution,setInstitution]=useState("")
    const[startYear,setStartYear]=useState("")
    const[endYear,setEndYear]=useState("")
    const[skills,setSkills] = useState([])
    const[contact,setContact] = useState({value:"",error:""})
    const[bio,setBio]=useState("")

    const { mutate:AddUser,data,isPending,isSuccess ,error} = useMutation({mutationFn:userRegister})
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(()=>{
        if(data && isSuccess){
            navigate("/login")
        }
    },[data,isSuccess])

    const handleName = (e) =>{
        if(!e.target.value){
            setName({value:e.target.value,error:`${t("required")}`})
        }else{
            setName({value:e.target.value,error:""})
        }   
    }


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

    const handleConfirmPassword = (e) =>{
        if(!e.target.value){
            setConfirmPassword({value:e.target.value,error:`${t("required")}`})
        }else{
            if(e.target.value!==password.value){
                setConfirmPassword({value:e.target.value,error:`${t("not-matched")}`})
            }else{
                setConfirmPassword({value:e.target.value,error:""})
            }
        }   
    }

    const handleContact = (e) =>{
        if(e.target.value.length>10){
            setContact({value:e.target.value,error:`${t("contact-issue")}`})
        }else{
            setContact({value:e.target.value,error:""})
        }   
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!name.value || !email.value || !password.value || !confirmPassword.value){
            if(!name.value){setName({...name,error:`${t("required")}`})}
            if(!email.value){setEmail({...email,error:`${t("required")}`})}
            if(!password.value){setPassword({...password,error:`${t("required")}`})}
            if(!confirmPassword.value){setConfirmPassword({...confirmPassword,error:`${t("required")}`})}
        }else{
            AddUser({
                name:name.value,email:email.value,
                role,password:password.value,confirmPassword:confirmPassword.value,
                institution,startYear,endYear,skills,contact:contact.value,bio
            })
        }
    }

    return(
        <div className="h-full grid grid-cols-12 pt-10">
            <div className="col-[2/span_10]">
                <h1 className="font-extrabold text-3xl text-base-4 mb-6">{t("register")}</h1>
                {
                    error&&
                    <Alert sx={{marginBottom:"10px",width:"fit-content"}} severity="error">{error.response.data.userError}</Alert>
                }
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-3 pb-5">
                    <div className="flex flex-col gap-y-[5px]">
                        <label className="capitalize text-base text-base-4 font-bold">{t("name")}</label>
                        <input 
                          className="inputstyle" 
                          type="text" value={name.value} onChange={handleName} 
                        />
                        {
                            name.error&&
                            <span className="text-white">{name.error}</span>
                        }
                    </div>


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
                        <label className="capitalize text-base text-base-4 font-bold">{t("role")}</label>
                        <select 
                            className="inputstyle"
                            value={role} 
                            onChange={(e)=>setRole(e.target.value)}
                        >
                            <option value="Aplicant">{t("aplicant")}</option>
                            <option value="Recruiter">{t("recruiter")}</option>
                        </select>
                    </div>


                    <div className="flex flex-col gap-y-[5px]">
                        <label className="capitalize text-base text-base-4 font-bold">{t("password")}:</label>
                        <input 
                          className="inputstyle" 
                          type="password" value={password.value} onChange={handlePassword} 
                        />
                        {
                            password.error&&
                            <span className="text-white">{password.error}</span>
                        }
                    </div>


                    <div className="flex flex-col gap-y-[5px]">
                        <label className="capitalize text-base text-base-4 font-bold">{t("confirm-password")}:</label>
                        <input 
                          className="inputstyle" 
                          type="password" value={confirmPassword.value} onChange={handleConfirmPassword} 
                        />
                        {
                            confirmPassword.error&&
                            <span className="text-white">{confirmPassword.error}</span>
                        }
                    </div>

                    {
                        role==="Aplicant"?
                        (
                            <React.Fragment>
                                <h3 className="font-bold text-base-4">
                                    {t("add-education-header")}
                                </h3>
                                <div className="flex flex-col gap-y-[5px]">
                                    <label className="capitalize text-base text-base-4 font-bold">{t("institution")}</label>
                                    <input 
                                    className="inputstyle" 
                                    type="text" value={institution} onChange={(e)=>setInstitution(e.target.value)} 
                                    />
                                </div>


                                <div className="flex flex-col gap-y-[5px]">
                                    <label className="capitalize text-base text-base-4 font-bold">{t("start-year")}</label>
                                    <input 
                                    className="inputstyle" 
                                    type="number" min={1970} value={startYear} onChange={(e)=>setStartYear(e.target.value)} 
                                    />
                                </div>


                                <div className="flex flex-col gap-y-[5px]">
                                    <label className="capitalize text-base text-base-4 font-bold">{t("end-year")}</label>
                                    <input 
                                    className="inputstyle" 
                                    type="number" min={1970} value={endYear} onChange={(e)=>setEndYear(e.target.value)} 
                                    />
                                </div>

                                
                                <div className="flex flex-col gap-y-[5px]">
                                   <label className="capitalize text-base text-base-4 font-bold">{t("skills")}:</label>
                                   <Autocomplete
                                        className="autocompletestyle"
                                        options={langsList}
                                        value={skills}
                                        onChange={(_event,newValue) => {
                                            setSkills(newValue)
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
                                </div>
                            </React.Fragment>
                        ):
                        <React.Fragment>
                            <div className="flex flex-col gap-y-[5px]">
                                <label className="capitalize text-base text-base-4 font-bold">{t("contact-no")}</label>
                                <input 
                                className="inputstyle" 
                                type="text" value={contact.value} onChange={handleContact} 
                                />
                                {
                                    contact.error&&
                                    <span className="text-white">{contact.error}</span>
                                }
                            </div>
                            <div className="flex flex-col gap-y-[5px]">
                                <label className="capitalize text-base text-base-4 font-bold">{t("bio")}</label>
                                <input 
                                className="inputstyle" 
                                type="text" value={bio} onChange={(e)=>setBio(e.target.value)} 
                                />
                            </div>
                        </React.Fragment>
                    }

                    <button 
                    className="btnstyle"
                    type="submit"
                    >
                        <span className="mx-2">{t("register")}</span>
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
export default RegisterPage;