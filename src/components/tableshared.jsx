import React from "react"
import { useTranslation } from "react-i18next";

const TableShared = ({tableHeader,tableBody}) =>{

    const { t } = useTranslation();
    return(
        <div className="overflow-auto w-full">
            <table className="tablestyle">
                <thead>
                    <tr>
                    {
                        tableHeader.map((td)=>{
                            return(
                                <th className="tablethstyle" key={Math.random()}>
                                    {t(`${td}`)}
                                </th>
                            )
                        })
                    }
                    </tr>
                </thead>
                <tbody>
                    {
                        tableBody.map((job)=>{
                            return(
                                <tr className="tabletrstyle" key={Math.random()}>
                                    {
                                        Object.values(job).map((item)=>{
                                            return(
                                                <td className="tabletdstyle" key={Math.random()}>
                                                    {item}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
      </div>
    )
}
export default TableShared;