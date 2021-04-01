const express=require('express');
const jwt=require('jsonwebtoken')
const app=express();
const morgan=require('morgan');
const bodyparser=require('body-parser')

const productsRoutes=require('./api/routes/products');
const loginRoutes=require('./api/routes/login');


app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use((req,res,next)=>{
   res.header("Access-Control-Allow-Origin","*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
   if(req.method==='OPTIONS')
   {
      res.header('Access-Control-Allow-Methods','*')
    return res.header(200).json({});
   }
 });

//routes which should handle request
app.use('/api/v1.0/products',productsRoutes);
app.use('/api/v1.0/login',loginRoutes);

app.use((req,res,next)=>{
   const error=new Error('not found');
    error.staus=404;
    //forward status request
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.staus||500)
    res.json({
        error:{
            message:error.message
        }
    })
});


module.exports=app;