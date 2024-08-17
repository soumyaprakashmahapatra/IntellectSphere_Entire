const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
/* multer, a middleware for handling multipart/form-data, which is primarily used for uploading files. Here, it's being used in an Express.js application. */
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')

//database
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}



//middlewares
dotenv.config()
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
/*Requests starting with /api/auth will be handled by the authRoute router. */
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})
/*multer.diskStorage() creates a storage engine that can save files to disk.
destination specifies the folder where the uploaded files will be stored. In this case, it's the "images" directory. The callback function fn is called with null (for no error) and the directory name.
filename specifies the name of the file. Here, the filename is set to req.body.img, which means it uses the value sent in the request body under the img key. The commented line shows an alternative where the filename is hardcoded to "image1.jpg". */

const upload=multer({storage:storage})  //middleware for handling file uploads, using the defined storage engine.
app.post("/api/upload",upload.single("file"),(req,res)=>{
    /*upload.single("file") is the middleware function that handles the file upload. It expects a single file upload with the key "file". */
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})


app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})