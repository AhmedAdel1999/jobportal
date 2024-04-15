import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next";
import error from "../assets/error.png"

const PageNotFound = () =>{

    const { t } = useTranslation()
    const navigate = useNavigate()

    return(
        <div className="h-full grid grid-cols-12 pt-10">
            <div className="col-[2/span_10] flex flex-col items-center gap-10">
                <div>
                    <h3 className="font-extrabold text-base-4 text-4xl text-center mb-5">
                        {t("notfound-header")}
                    </h3>
                    <p className="text-center capitalize font-bold text-base-4">
                        {t("notfound-text")}
                    </p>
                </div>
                <img 
                  alt="404 not found"
                  src={error}
                  loading="lazy"
                  className="h-[300px] min-w-[300px] max-w-[500px] object-fill"
                />
                <button className="btnstyle bg-base-4 font-bold" onClick={()=>navigate(-1)}>Go Back</button>
            </div>
        </div>
    )
}
export default PageNotFound