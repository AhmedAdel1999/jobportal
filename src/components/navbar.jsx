import React,{ useContext, useEffect, useState,useLayoutEffect } from "react";
import i18n from "i18next";
import { initReactI18next,useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faTimes } from '@fortawesome/free-solid-svg-icons'
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/authcontext";
import logo from "../assets/logo.jpg"
import en from "../translation/en.json"
import ar from "../translation/ar.json"



const translationsEn = en.en
const translationsAr = ar.ar

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
        en: { translation: translationsEn },
        ar: { translation: translationsAr },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false }, // not needed for react as it escapes by default
    });


const NavbarSection = () =>{
    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })
    const[openSidebar,setOpensidebar]= useState(false)
    const [lang,setLang] = useState("en")
    const { t } = useTranslation();
    const queryClient = useQueryClient()
    const{setIsLoggedIn} = useContext(AuthContext)
    const data=queryClient.getQueriesData({queryKey:["getuser"]})[0]
    let currentUserData = data?data[1]:undefined
    let currentLang = JSON.parse(localStorage.getItem("lang")) || lang;


    const handleLang = (lang) => {
        localStorage.setItem("lang",JSON.stringify(lang))
        document.getElementsByTagName("html")[0].setAttribute("lang",lang)
        document.getElementsByTagName("html")[0].setAttribute("dir",lang=="en"?"ltr":"rtl")

        i18n.changeLanguage(lang); 
        setLang(lang)  
      };

    
    const handleLogout = async () =>{
        await queryClient.removeQueries()
        localStorage.removeItem("currentUserId") 
        setIsLoggedIn(false)
        setOpensidebar(false)
               
    }

    const handleClose = () =>{
        setOpensidebar(false)
    }

    useLayoutEffect(()=>{
        i18n.changeLanguage(currentLang);
        document.getElementsByTagName("html")[0].setAttribute("lang",currentLang)
        document.getElementsByTagName("html")[0].setAttribute("dir",currentLang=="en"?"ltr":"rtl")
        setLang(currentLang)
      },[])

    useEffect(()=>{
        if(isBigScreen){
            if(openSidebar){
                setOpensidebar(false)
            }
        }

    },[isBigScreen])


    const handleRoutes = () =>{
        if(currentUserData){
             if(currentUserData.data.role=="Aplicant"){
                return(
                    <React.Fragment>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleClose}
                            className='navlinkstyle'
                            to="/alljobs"
                         >
                            {t("all-jobs")}
                        </NavLink>
                        </li>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleClose}
                            className='navlinkstyle'
                            to="/myapplications"
                         >
                            {t("my-applications")}
                        </NavLink>
                        </li>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleClose}
                            className='navlinkstyle'
                            to="/myprofile"
                         >
                            {t("my-profile")}
                        </NavLink>
                        </li>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleLogout}
                            className='navlinkstyle'
                            to="/"
                         >
                            {t("logout")}
                        </NavLink>
                        </li>
                    </React.Fragment>
                )
            }
            else if(currentUserData.data.role==="Recruiter"){
                return(
                    <React.Fragment>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleClose}
                            className='navlinkstyle'
                            to="/createjob"
                         >
                            {t("create-job")}
                        </NavLink>
                        </li>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleClose}
                            className='navlinkstyle'
                            to="/mylistings"
                         >
                            {t("all-listings")}
                        </NavLink>
                        </li>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleClose}
                            className='navlinkstyle'
                            to="/allempolyees"
                         >
                            {t("all-employees")}
                        </NavLink>
                        </li>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleClose}
                            className='navlinkstyle'
                            to="/myprofile"
                         >
                            {t("my-profile")}
                        </NavLink>
                        </li>
                        <li className='listyle'>
                        <NavLink 
                            onClick={handleLogout}
                            className='navlinkstyle'
                            to="/"
                         >
                            {t("logout")}
                        </NavLink>
                        </li>
                    </React.Fragment>
                )
            }
            
        }else{
            return(
                <React.Fragment>
                    <li className='listyle'>
                    <NavLink 
                        onClick={handleClose}
                        className='navlinkstyle'
                        to="/"
                        >
                        {t("home")}
                    </NavLink>
                    </li>
                    <li className='listyle'>
                    <NavLink 
                        onClick={handleClose}
                        className='navlinkstyle'
                        to="/login"
                        >
                        {t("login")}
                    </NavLink>
                    </li>
                    <li className='listyle'>
                    <NavLink 
                        onClick={handleClose}
                        className='navlinkstyle'
                        to="/register"
                        >
                        {t("register")}
                    </NavLink>
                    </li>
                </React.Fragment>
            )
        }
    }

    return(
        <nav className='shadow-lg w-full sticky z-50 top-0 left-0 bg-base-4'>
            <div className='lg:flex items-center justify-between py-2 lg:px-10 px-7'>
                <div className='flex items-center gap-4'>
                    <img 
                      alt="logo"
                      src={logo}
                      className="w-[135px] h-[48px] object-fill object-center rounded-sm"
                    />
                    {
                        currentLang=="ar"?
                        <button 
                            className="bg-white p-2 rounded-sm font-bold" 
                            onClick={()=>handleLang("en")}
                        >
                            EN
                        </button>
                        :
                        <button 
                            className="bg-white p-2 rounded-sm font-bold" 
                            onClick={()=>handleLang("ar")}
                        >
                            AR
                        </button>
                    }
                </div>
            
                <div 
                    onClick={()=>setOpensidebar(!openSidebar)} 
                    className='toggler'
                >
                    {
                        openSidebar?
                        <FontAwesomeIcon className="text-white cursor-pointer" icon={faTimes} />
                        :
                        <FontAwesomeIcon className="text-white cursor-pointer" icon={faBars} />
                    }
                </div>

                <ul className={`ulstyle ${openSidebar ? 'top-[64px] left-0 shadow-xl':'left-[-300px]'}`}>
                    {handleRoutes()}
                </ul>
            </div>
        </nav>
    )
}
export default NavbarSection;

