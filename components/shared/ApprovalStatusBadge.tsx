interface Props{
    status:string;
}

export default function ApprovalStatusBadge({status}:Props){

    const colors:any={
        pending:"bg-yellow-500/20 text-yellow-400",
        approved:"bg-green-500/20 text-green-400",
        rejected:"bg-red-500/20 text-red-400",
        submitted:"bg-blue-500/20 text-blue-400"
    }

    return(

        <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
                colors[status] || "bg-gray-500/20 text-gray-300"
            }`}
        >
            {status}
        </span>

    )

}