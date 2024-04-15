import bgImg from "../assets/bg_1.jpg"
import { Fade } from "react-reveal"
import { useTranslation } from "react-i18next";
const HomePage = () =>{

    const { t } = useTranslation();

    return(
        <div 
            style={{backgroundImage:`url(${bgImg})`}}
            className={`h-full bg-no-repeat bg-cover bg-center flex justify-center items-center `}
        >
            <div className="max-w-[700px] min-w-[300px] px-4">
                <Fade top>
                  <p className="relative z-0 font-extrabold italic text-center text-white text-4xl ">
                     {t("welcome-header")}
                  </p>
                </Fade>
                
                <Fade bottom>
                    <p className="font-bold italic text-center text-white text-xl">
                       {t("welcome-text")}
                    </p>
                </Fade>
            </div>
        </div>
    )
}
export default HomePage