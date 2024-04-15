const Loader = () =>{
    return(
        <div className="w-full h-full flex items-center justify-center bg-base-2" >
            <div className="w-[50px] h-[180px] text-center text-sm">
                <div className="inline-block bg-base-4 h-full w-[6px] animate-loader"></div>
                <div className="inline-block bg-base-4 h-full w-[6px] animate-[loader_1.2s_infinite_ease-out_-1.1s]"></div>
                <div className="inline-block bg-base-4 h-full w-[6px] animate-[loader_1.2s_infinite_ease-out_-1.0s]"></div>
                <div className="inline-block bg-base-4 h-full w-[6px] animate-[loader_1.2s_infinite_ease-out_-0.9s]"></div>
                <div className="inline-block bg-base-4 h-full w-[6px] animate-[loader_1.2s_infinite_ease-out_-0.8s]"></div>
            </div>
        </div>
    )
}
export default Loader;