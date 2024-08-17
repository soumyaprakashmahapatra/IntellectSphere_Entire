import { useNavigate, useParams } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { BiEdit } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import axios from "axios"
import { URL, IF } from "../url"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"


const PostDetails = () => {

  const postId = useParams().id
  /*Inside app.jsx <Route exact path="/posts/post/:id" element={<PostDetails/>}/> from yhis it extract the id */
  //   Route Definition: The path /post/:id means that any URL that matches this pattern (e.g., /post/123, /post/abc) will render the PostDetail component.
  // useParams Hook: Inside PostDetail, useParams is called to extract the parameters from the URL. In this case, it extracts the id parameter.
  const [post, setPost] = useState({})
  const { user } = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()


  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId)
      // console.log(res.data)
      setPost(res.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleDeletePost = async () => {

    try {
      const res = await axios.delete(URL + "/api/posts/" + postId, { withCredentials: true })
      /*{ withCredentials: true }-->This ensures that any cookies (such as session cookies) are included with the request, allowing the server to authenticate the user. */
      console.log(res.data)
      navigate("/")
    
    }
    catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    fetchPost()

  }, [postId])

  const fetchPostComments = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId)
      setComments(res.data)
      setLoader(false)

    }
    catch (err) {
      setLoader(true)
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPostComments()

  }, [postId])

  const postComment = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(URL + "/api/comments/create",
        { comment: comment, author: user.username, postId: postId, userId: user._id },
        /*This object contains the data that will be sent in the body of the POST request. The properties include:
        comment: The content of the comment being sent. This is likely a variable holding the text of the comment.
        author: The username of the user making the comment. This is accessed from the user object, specifically user.username.
        postId: The ID of the post to which the comment is being added. This is retrieved from postId, which might have been extracted        from the URL using useParams.
        userId: The ID of the user making the comment. This is accessed from the user object, specifically user._id. */
        { withCredentials: true })

      // fetchPostComments()
      // setComment("")
      window.location.reload(true)

    }
    catch (err) {
      console.log(err)
    }

  }



  return (
    <div>
      <Navbar />
      {loader ? <div className="h-[80vh] flex justify-center items-center w-full"><Loader /></div> : <div className="px-8 md:px-[200px] mt-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
          {user?._id === post?.userId && <div className="flex items-center justify-center space-x-2">
          {/*if the post belong to that particular user then only show the edit and delete buttom */}  
            <p className="cursor-pointer" onClick={() => navigate("/edit/" + postId)} ><BiEdit /></p>
            <p className="cursor-pointer" onClick={handleDeletePost}><MdDelete /></p>
          </div>}
        </div>
        <div className="flex items-center justify-between mt-2 md:mt-4">
          <p>@{post.username}</p>
          <div className="flex space-x-2">
            <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
            <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
          </div>
        </div>
        <img src={IF + post.photo} className="w-full  mx-auto mt-8" alt="" />
        <p className="mx-auto mt-8">{post.desc}</p>
        <div className="flex items-center mt-8 space-x-4 font-semibold">
          <p>Categories:</p>
          <div className="flex justify-center items-center space-x-2">
            {post.categories?.map((c, i) => (
              <>
                <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>
              </>

            ))}

            {/*post.categories?.map((c, i) => ( ... )):

            post.categories accesses the categories property of the post object.
            The optional chaining operator (?.) ensures that if categories is null or undefined, the expression short-circuits and returns            undefined instead of throwing an error.
            .map((c, i) => ( ... )) iterates over each element in the categories array, where c is the current category and i is the index            of the current element.
            Inside the map function:

            <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>:
            This creates a div element for each category.
            key={i} is a unique key assigned to each div based on the index i. This helps React identify which items have changed, are            added, or are removed.
            className="bg-gray-300 rounded-lg px-3 py-1" applies CSS classes to style the div with a gray background, rounded corners, and            padding.
            {c} inserts the current category (c) as the content of the div. */}

          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
          {comments?.map((c) => (
            <Comment key={c._id} c={c} post={post} />
          ))}

        </div>
        {/* write a comment */}
        <div className="w-full flex flex-col mt-4 md:flex-row">
          <input onChange={(e) => setComment(e.target.value)} type="text" placeholder="Write a comment" className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0" />
          <button onClick={postComment} className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0">Add Comment</button>
        </div>
      </div>}
      <Footer />
    </div>
  )
}

export default PostDetails