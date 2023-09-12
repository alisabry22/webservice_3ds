


const button = document.getElementById('getCurrentData');
button.addEventListener('click', function (e) {
    fetch('/getcurrent', { method: 'get' }).then(function (response) {
        if (response.ok) {
            console.log("click was recorded");
            window.location = "/getcurrent";
            

        }
        throw new Error("Request Failed");
    }).then(data => {
        console.log(data);
        // var filename='mydata.json';
        // var savetoFile=new Blob([data],{type:'application/json'});
        // FileSaver.saveAs(savetoFile,filename);
    })

        .catch(function (err) {
            console.log(`err`, err);
        })

})

const projectsClicked = document.getElementById('getProjects');

projectsClicked.addEventListener('click', function (e) {
    fetch('/getprojects', { method: "GET" }).then(function (response) {
        if (response.ok) {
            window.location = '/getprojects';
            console.log(response);
        }
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    })

})

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener('click', function (e) {
    fetch('/logout', { method: "GET" }).then(function (response) {
        if (response.ok) {
            console.log("log out requested");
            window.location = '/';
        }
    }).then(data => console.log(data)).catch(err => console.log(err));
})


const get_physical_items = document.getElementById("getItems");

get_physical_items.addEventListener('click', function (e) {
    fetch('/getEngItems', { method: "Get" }).then(function (response) {
        if (response.ok) {
            window.location = '/getEngItems';
        }
    }).then(data => console.log(data)).catch(err => console.log(err));
})


// const createEngItem=document.getElementById("createEngItem");

// createEngItem.addEventListener('click',function(e){
//     window.location="/createEngItem";
// })
