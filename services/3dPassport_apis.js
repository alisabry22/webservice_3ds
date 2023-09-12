
const { https } = require("follow-redirects");
const hostname = "3dx22.promech.com";
//login ticket options
const login_ticket_options = {
    hostname: hostname,

    //port: 443,
    path: "/3dpassport/login?action=get_auth_params",
    method: 'GET',
    'headers': {
        'Accept': "application/json",
    },
    "rejectUnauthorized": false,

};
//get login token 
function getLoginTicket(){
    return new Promise(async function(resolve,reject){
       
        try {
          https.request(login_ticket_options,(first_response)=>{
                var chunks=[];
                first_response.on("data",(data)=>chunks.push(data));
                first_response.on("end",()=>{
                  //first call ended now we get lt,JsessionId from response headers

                    var response = Buffer.concat(chunks);

                    //return lt and headers to take Jsession ID from it in another requests 
                    resolve([first_response.headers["set-cookie"],JSON.parse(response)]);
                });

                first_response.on("error",(error)=>reject([false,error]));
            }).end();
        } catch (error) {
            console.error(error);
        }
    })
}

//login request options
var cas_auth_options = {
    'method': 'POST',
    'hostname': hostname,
    'path': '/3dpassport/login',

    'headers':{},
    "rejectUnauthorized": false,
    'maxRedirects': 21
};

//post request to login with username and password with lt from first request
function LoginWithUsernameAndPassword(cookies,lt,username,password){
 
    xFormBody= `${'lt'}=${lt}&${'username'}=${username}&${'password'}=${password}`;
    var cookie =cookies;
       
    cas_auth_options.headers={
        
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Accept': 'application/json',
            'Cookie':cookie,
            'Content-Length':Buffer.byteLength(xFormBody),
     
    };
   
    return new Promise(async function(resolve,reject){
        try {
            cas_auth_options.beforeRedirect = (options, response, request) => {
                var beforeRedirectCookies=[];
                beforeRedirectCookies=response.headers["set-cookie"];
                for(let i=0 ; i<beforeRedirectCookies.length;i++){
                    cookie.push(beforeRedirectCookies[i]);
                }
//this to handle castGC cookie before redirect because this request has redirection and i need to get CastGC before redirection

                cas_auth_options.headers.Cookie = cookie;   
                
            };
        var loginRequest=   https.request(cas_auth_options,(second_response)=>{
          
                var chunks1 = [];
            second_response.on("data",(data)=>chunks1.push(data));
            second_response.on("end",()=>{
                if(second_response.statusCode === 200 && second_response.responseUrl.includes("my-profile")){
                    resolve([true,cas_auth_options.headers]);
                }else{
              
                    resolve([false,"Username Or Password are wrong"]);
                }
            });

            second_response.on("error",(error)=>reject([false,error]));

            });
            loginRequest.write(xFormBody);
            loginRequest.end();
        } catch (error) {
                console.error(error);
        }
    })
}
module.exports={getLoginTicket,LoginWithUsernameAndPassword}