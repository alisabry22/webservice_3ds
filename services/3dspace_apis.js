const { https } = require("follow-redirects");
const hostname = "3dx22.promech.com";
const securityContext="VPLMProjectLeader.Company Name.Training";
var space_get_current_user_options={
                    
    'method': 'GET',
    hostname: hostname,
    'path': '/3dspace/resources/modeler/pno/person?current=true&select=preferredcredentials&select=collabspaces',
   // port:'433',
    "rejectUnauthorized": false,
    headers:{},
    'maxRedirects': 21


};
var get_projects_options={
'method': 'GET',
hostname: hostname,
'path': '/3dspace/resources/v1/modeler/projects',
// port:'433',
"rejectUnauthorized": false,
headers:{},
'maxRedirects': 21
};
var get_eng_items_options={
'method':"GET",
hostname:hostname,
'path':'/3dspace/resources/v1/modeler/dseng/dseng:EngItem/search',
headers:{},
'maxRedirects':21,
"rejectUnauthorized": false,
};
//eng items options for request
// var create_eng_items_options={
// 'method':"post",
// hostname:hostname,
// 'path':'/resources/v1/modeler/dseng/dseng:EngItem',
// headers:{},
// 'maxRedirects':21,
// "rejectUnauthorized": false,
// }
//csrf token 
// var get_csrf_token_options={
// 'hostname':hostname,
// 'method':"GET",
// 'path':'/3dspace/resources/v1/application/CSRF',
// headers:{},
// 'maxRedirects':21,
// "rejectUnauthorized": false,

// };

function GetCurrentUserData(headers){
 
    space_get_current_user_options.headers=headers;
    
    return new Promise(async function(resolve,reject){
        try {
           
            https.request(space_get_current_user_options,(response)=>{
                var chunks=[];
                response.on("data",(data)=>chunks.push(data));
                response.on("end",()=>{
                   
                    resolve([true,chunks])
                });
                response.on("error",(error)=>reject([false,error]));
            }).end();
        } catch (error) {
                reject([false,error]);
        }
    })
}

function GetCurrentProjects(headers){
    
    get_projects_options.headers=headers;
    get_projects_options.headers.SecurityContext=securityContext;


    return new Promise(async function (resolve,reject){
        try {
            https.request(get_projects_options,(response)=>{
                var chunks=[];
                response.on("data",(data)=>chunks.push(data));
                response.on("error",(err)=>console.log(err));
                response.on("end",()=>{
                    if(response.statusCode==200){
                        resolve([true,JSON.parse(chunks)]);
                       
                     
                    }else{
                        reject([false,response.statusCode]);
                        
                    }
                })
            }).end();
        } catch (error) {
                reject([false,error]);
        }
    })
 
}


function GetEngineeringItems (header){
    get_eng_items_options.headers=header;
    get_eng_items_options.headers.SecurityContext=securityContext;
    return new Promise(async function(resolve,reject){
        try {
            https.request(get_eng_items_options,(response)=>{
                var chunks=[];
                response.on("data",data=>chunks.push(data));
                response.on("error",err=>console.log(err));
                response.on("end",()=>{
                    if(response.statusCode==200){
                        resolve([true,JSON.parse(chunks)])
                    }else{
                        reject([false,response.statusCode]);
                    }
                
                });
            }).end();
        } catch (error) {
            reject([false,error]);
        }
      
       
    })
}

module.exports={GetCurrentUserData,GetCurrentProjects,GetEngineeringItems};