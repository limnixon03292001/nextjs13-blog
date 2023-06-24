import Posts from "./components/Posts"
import MyProfilePic from './components/MyProfilePic'

//route segment config
//If you want to revalidate data that does not use fetch (i.e. using an external package or query builder), you can use the route segment config.
export const revalidate = 86400

export default function Home() {
  return (
     <div className="mx-auto">
      <MyProfilePic/>
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 👋&nbsp;
        <span className="whitespace-nowrap">
          I'm <span className="font-bold">Nixon</span>.
        </span>
      </p>
 
      <Posts/>
    </div>
  )
}
