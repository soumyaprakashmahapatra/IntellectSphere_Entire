
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ImCross } from 'react-icons/im'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { URL } from '../url'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const CreatePost = () => {

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const { user } = useContext(UserContext)
  const [cat, setCat] = useState("") /*cat is a state variable that holds the current value of a single category. */
  const [cats, setCats] = useState([])/*cats is a state variable that holds an array of all categories. */


  const navigate = useNavigate()

  const deleteCategory = (i) => {
    let updatedCats = [...cats]
    updatedCats.splice(i)
    setCats(updatedCats)
  }

  /*deleteCategory is a function that deletes a category from the cats array at a given index i.
 let updatedCats = [...cats]; creates a copy of the cats array to avoid directly mutating the state.
 updatedCats.splice(i, 1); removes one item at index i from the updatedCats array.
 setCats(updatedCats); updates the state with the modified updatedCats array. */

  const addCategory = () => {
    let updatedCats = [...cats]
    updatedCats.push(cat)
    setCat("")
    setCats(updatedCats)
  }
  /*addCategory is a function that adds the current value of cat to the cats array.
  let updatedCats = [...cats]; creates a copy of the cats array.
  updatedCats.push(cat); adds the current category value (cat) to the end of the updatedCats array.
  setCat(""); resets the cat state to an empty string, clearing the input field.
  setCats(updatedCats); updates the state with the new array that includes the added category. */

  const handleCreate = async (e) => {
    e.preventDefault()
    /*e.preventDefault() is called to prevent the default behavior of the form submission. This is typically used to stop the form from reloading the page when it is submitted, allowing for custom handling of the form submission. */
    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats
    }
    /*The post object contains the following properties:
    title: This is presumably a state variable or prop that holds the title of the post.
    desc: This is another state variable or prop that holds the description of the post.
    username: This is extracted from the user object, specifically user.username. user is likely context value (useContext()) representing the current user.
    userId: This is also extracted from the user object, specifically user._id, representing the unique identifier of the user.
    categories: This is represented by cats, likely a state variable or prop that holds an array or list of categories associated with the post. */


    if (file) {
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append("img", filename)
      data.append("file", file)
      post.photo = filename
      // console.log(data)
      //img upload
      try {
        const imgUpload = await axios.post(URL + "/api/upload", data)
        // console.log(imgUpload.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    //post upload
    // console.log(post)
    try {
      const res = await axios.post(URL + "/api/posts/create", post, { withCredentials: true })
      navigate("/posts/post/" + res.data._id)
      // console.log(res.data)

    }
    catch (err) {
      console.log(err)
    }
  }



  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold md:text-2xl text-xl '>Create a post</h1>
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
          <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none' />
          <input onChange={(e) => setFile(e.target.files[0])} type="file" className='px-4' />
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
              <input value={cat} onChange={(e) => setCat(e.target.value)} className='px-4 py-2 outline-none' placeholder='Enter post category' type="text" />
              <div onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold cursor-pointer'>Add</div>
            </div>

            {/* categories */}
            <div className='flex px-4 mt-3'>
              {cats?.map((c, i) => (
                <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md'>
                  <p>{c}</p>
                  <p onClick={() => deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross /></p>
                </div>
              ))}
              {/* cats is an array of category items.
                The optional chaining operator ?. is used to ensure that if cats is null or undefined, the rest of the code won't execute, avoiding runtime errors.
                The map function iterates over each element in the cats array. For each element c (category), and its index i, a new JSX element is returned.
              */}

            </div>

          </div>
          <textarea onChange={(e) => setDesc(e.target.value)} rows={15} cols={30} className='px-4 py-2 outline-none' placeholder='Enter post description' />
          <button onClick={handleCreate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'>Create</button>
        </form>

      </div>
      <Footer />
    </div>
  )
}

export default CreatePost