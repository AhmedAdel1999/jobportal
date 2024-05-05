import bgImg from "../assets/cover.png"
import { Fade } from "react-reveal"
import { useTranslation } from "react-i18next";
const HomePage = () =>{

    const { t } = useTranslation();

    return(
        <div 
            style={{backgroundImage:`url(${bgImg})`}}
            className={`h-full bg-no-repeat bg-cover bg-center pt-16  px-8`}
        >
            <section className="flex flex-col h-full max-w-[700px] justify-center gap-4">
                <Fade top>
                  <p className="relative z-0 font-extrabold italic text-center text-white text-4xl">
                     {t("welcome-header")}
                  </p>
                </Fade>
                
                <Fade bottom>
                    <p className="font-bold italic text-center text-white text-xl">
                       {t("welcome-text")}
                    </p>
                </Fade>
            </section>
        </div>
    )
}
export default HomePage