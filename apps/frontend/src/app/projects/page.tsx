import HomeSidebar from "../../components/HomePage/HomeSidebar"

const page = () => {
  return (
    <div className="bg-indigo-500 h-screen flex-1 flex">
      <div className="w-[270px]">
        <HomeSidebar />
      </div>
      <div className="flex-1">
        Page
      </div>
    </div>
  )
}

export default page
