const express = require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const url='mongodb+srv://urujahmedsyed:beabat@cluster0.64q31qj.mongodb.net/resportal1';
const User=require('./models/usermodel');
const Img=require('./models/imagemodel');
const jwt=require('jsonwebtoken');
// const multer = require('multer');
// const upload = multer().single('image');
// 'image' is the name of the input element in the HTML form
const cookieParser = require('cookie-parser');
const collName = 'images';


app.use(cors({origin:["https://ccareclient.onrender.com/","https://ccareserver.onrender.com"],methods:["GET","POST"],credentials: true}))
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
//   });

mongoose.connect(
    url,
    { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    },(err) => {
    if (err) {
    console.log("error in connection");
    } else {
    console.log("mongodb is connected");
    }}
);

app.get("/",(req,res)=>{
    return res.json({
        Mssg:"hwedsal"
    })
})

app.post('/api/login', async (req,res)=>{
    const user = await User.findOne({
        uname: req.body.uname,
        password: req.body.password,
    })
    if(user){

        const token=jwt.sign(
            {
                uname: user.uname,
            },
            //enter a java web token that will get encrypted and authorized
            //for the name from the given database we will take a status called ok and the token is returned, if its an error then false is returned
            'secret123'
        )
        // console.log(token)
        return res.json({status:'ok',user:token})
    } else{
        return res.json({status:'error',user:false})
    }
});

app.post('/api/data', async (req, res) => {
Img.find({}).then(val => {
        res.json({ code: 1, array: val });
        // console.log(val);
    });

});


app.post('/api/signup', async (req,res)=>{
    console.log(req.body)
    try{
        const user = await User.create({
            name: req.body.name,
            uname: req.body.uname,
            password: req.body.password,
            mobile: req.body.mobile,
        })
        res.json({status:'yaya'})
    } catch(err){
        res.json({status:'error',error:'Duplicate username'})
    }
});
app.post('/api/image', async (req, res) => {
    try {
      const { image, result, ground, username, type } = req.body;
      const imgData = Buffer.from(image, 'base64');
      await Img.create({
        image: imgData,
        result,
        ground,
        username,
        type
      });
      res.json({ code: 1, message: 'Data uploaded successfully' });
    } catch (err) {
      res.json({ code: -1, message: 'Error uploading data' });
    }
  });
  

  app.listen(12345,()=>{
    console.log('server started on port 12345')
    });

// app.post('/api/images', async (req,res)=>{
//     console.log(req.body)
//     try{
//         const user = await User.create({
//             image: req.body.image,
//             result: req.body.result,
//             ground: req.body.ground,
//             username: req.body.username,
//             type: req.body.type,
//         })
//         res.json({status:'yaya'})
//     } catch(err){
//         res.json({status:'error',error:'mistake in life'})
//     }
// });

// app.post('/api/images', upload, async (req, res) => {
//     const { result, ground, username, type } = req.body;
//     const img = req.file.buffer; // the uploaded file buffer
//     const imgType = req.file.mimetype;
    
//     try {
//         const result = await Img.create({ img, result, ground, username, imgType });
//         return res.json({ status: 'ok', result });
//     } catch (err) {
//         return res.json({ status: 'error', error: err.message });
//     }
// });



