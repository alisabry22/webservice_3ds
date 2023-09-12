
const express=require("express");
const path = require('path');
 var alert=require("alert");
const app=express();
const { getLoginTicket, LoginWithUsernameAndPassword } = require("./services/3dPassport_apis");
const { GetCurrentUserData, GetEngineeringItems } = require("./services/3dspace_apis");
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));

//this variable is important will hold all cookies needed for other requests
var headers_for_any_request;


app.get("/",(req,res)=>{

    res.sendFile(__dirname+"/Pages/login.html");
   
    
});

app.post("/",async (req,res)=>{

   const {username,password}=req.body;
    if(username&&password){
       const loginTicketResponse= await getLoginTicket();
      if(loginTicketResponse[0]!=false){
        var cookie=loginTicketResponse[0];
        // here i have login ticket and JsessionID i will save them for coming calls
        //now i need to login using the post request
    
       const LoginRequestResponse=await LoginWithUsernameAndPassword(cookie,loginTicketResponse[1].lt,username,password);
      
            if(LoginRequestResponse[0]!=false){
               
                //this const_headers will have all cookies saved
              
                headers_for_any_request=LoginRequestResponse[1];
      
                res.sendFile(__dirname+"/Pages/current_user.html");
          
            }else{
            // means that login request fails, username or password are wrong or castGc and Jsession id issue

                alert(LoginRequestResponse[1]);
            }

    
      }else{
        // means that get login ticket request fails
        alert(loginTicketResponse[1]);
      }
}
   
})

app.get("/logout",(req,res)=>{
  
    res.redirect('back');
})
                   
//get current user data
app.get('/getcurrent',async(req,res)=>{
   
    if(headers_for_any_request){
        const currentUserResponse= await GetCurrentUserData(headers_for_any_request);
     
        if(currentUserResponse[0]==true){
           
                  res.setHeader("Content-Type","application/json");
                res.setHeader("Accept","application/json");
                res.status(200).send(JSON.parse(currentUserResponse[1]));
        }else{
            //there is error with the request

            console.log(`currentUserResponse`, currentUserResponse[1]);
        }
     
    }else{
        console.log("headers_for_any_request is failed  ");
    }
  
    
    

})

//get projects 
app.get("/getprojects",async(req,res)=>{

  const engItemsRepsonse=  await GetEngineeringItems(headers_for_any_request);
    if(engItemsRepsonse[0]==true){
        res.setHeader("Content-Type","application/json");
        res.setHeader("Accept","application/json");
        res.status(200).send(engItemsRepsonse[1])
    }else{
        alert(engItemsRepsonse[1]);
    }
 
})

//get engineering items
app.get('/getEngItems',async (req,res)=>{
        const result=await GetEngineeringItems(headers_for_any_request);
        if(result[0]==true){
            res.setHeader("Content-Type","application/json");
            res.setHeader("Accept","application/json");
            res.status(200).send(result[1]);
        }else{
            console.log(result);
            alert(result[1]);
        }

})

//create Engineering Items

app.get("/createEngItem",(req,res)=>{
    res.sendFile(__dirname+"/create_eng_item.html");
})


// app.post("/createEngItem",(req,res)=>{
//     https.request(get_csrf_token_options,(response)=>{
//         var chunks=[];
//         response.on("data",data=>chunks.push(data));
//         response.on("end",()=>{
//             // if response is successfuly call create items request
//             if(response.statusCode===200){
//                 var csrf_token=JSON.parse(chunks.toString()).csrf["value"];
                
//             }else{
//                 console.log(response.statusCode);
//             }
//         })
//     }).end();

//     //we need to provide security context in the headers and CSRF_TOKEN ALSO
//     create_eng_items_options.headers.SecurityContext="VPLMProjectLeader.Company Name.Training";

//    const {title,partnumber}=req.body;
//    if(title&&partnumber){
    
//    }
// })
app.listen(3000,()=>console.log(`listenning on port`, 3000));













