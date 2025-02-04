"use client"
import { useSearchParams } from "next/navigation";
import { CiWarning } from "react-icons/ci";


const ErrorCard = () => {
  const query = useSearchParams()
  const error = query.get("error")

  return (
    <>
      {error && (
        <div
          className="w-full border border-destructive bg-destructive/20 p-3 rounded-md flex gap-2 items-center justify-center text-destructive font-bold text-md"
        >
          <CiWarning className="text-2xl" />
          {error}
        </div>
      )}
    </>
  )
}

export default ErrorCard
