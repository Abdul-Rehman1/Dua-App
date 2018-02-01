// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAh8MBjNJUJLWFhigynM2IhMf_AcNGk_JQ",
    authDomain: "dua-applicationn-firebase.firebaseapp.com",
    databaseURL: "https://dua-applicationn-firebase.firebaseio.com",
    projectId: "dua-applicationn-firebase",
    storageBucket: "dua-applicationn-firebase.appspot.com",
    messagingSenderId: "542463509560"
  };
  firebase.initializeApp(config);
  var database = firebase.database().ref();
function signup(){
    var uname = document.getElementById('uname-sgnup').value;
    var uemail = document.getElementById('uemail-sgnup').value;
    var upass = document.getElementById('upass-sgnup').value;
    var uphone = document.getElementById('uphone-sgnup').value;
    var udata={
        name:uname,
        email:uemail,
        pass:upass,
        phone:uphone
    }
    var userData=localStorage.getItem("udata");
    if(!userData)
    {
        var userData=[];
    }
    else{
        userData=JSON.parse(userData);
    }
    userData.push(udata);
    localStorage.setItem("udata",JSON.stringify(userData));
    alert("signup successful");
    switchOpt(0);
}
function login(){
    var uemail = document.getElementById('uemail-lgin').value;
    var upass = document.getElementById('upass-lgin').value;
    var userData=JSON.parse(localStorage.getItem('udata'));
    //var flag=false;
    for(var i=0;i<userData.length;i++)
    {
        if(userData[i].email==uemail && userData[i].pass==upass)
        {
            alert("Login successful");
            sessionStorage.username=(userData[i].name);
            sessionStorage.useremail=(userData[i].email);
            sessionStorage.userpass=(userData[i].pass);
            sessionStorage.userphone=(userData[i].phone);
            return;
            
        }  
    }
     
     alert("Username or password is wrong");
}

function switchOpt(opt)
{
    var loginDiv = document.getElementById('login');
    var signupDiv = document.getElementById('signup');
    if(opt==1)
    {
        loginDiv.style.display="none";
        signupDiv.style.display="block";
    }
    else if(opt==0)
    {
        signupDiv.style.display="none";
        loginDiv.style.display="block";
    }
}
function fnSetUserData(){
    if(!sessionStorage.username){
        location.href="index.html";
    }
    else{
    document.getElementById('uname').innerHTML=sessionStorage.username;
    document.getElementById('uemail').innerHTML=sessionStorage.useremail;
    document.getElementById('uphone').innerHTML=sessionStorage.userphone;
    }
}
function Logout(){
    sessionStorage.clear();
    location.reload(true);
}
database.child("dua").on("child_added",function(snapshot){
    var obj = snapshot.val();
    obj.id = snapshot.key;
    userlikes=[];
    var i=0;
   // console.log(obj.userLikes);
    for(var prop in obj.userLikes)
    {
       if(obj.userLikes[prop]=="none"){}
       else{
        userlikes.push(obj.userLikes[prop]);
        }
    }
    viewAllDuas(obj,userlikes);
})
database.child("comments").on("child_added",function(snapshot){
    var comm = snapshot.val();
    comm.id = snapshot.key;
    var p=document.createElement('p');
    var commentText=document.createTextNode(comm.username+": "+comm.commentText);
    p.appendChild(commentText);
    document.getElementById("comm-"+comm.DuaId).getElementsByClassName("commentsec")[0].insertBefore(p, document.getElementById("comm-"+comm.DuaId).getElementsByClassName("commentsec")[0].childNodes[0])
})

database.child("dua").on("child_changed", function(data) {
    var dua = data.val();
    dua.id = data.key;
    document.getElementById('pray-id-'+dua.id).innerHTML=dua.prays;
    document.getElementById("prbtn-"+dua.id).value="Prayed";
})
function viewAllDuas(dua,userlikes){
    
    var duaContainer=document.getElementById('right-view');
    //var viewDuas=localStorage.getItem('duas');
    var invertedcomma="'";
    duaContainer.innerHTML+="<div class='well'>"+
                                "<p style='text-align:right;' class='time'>Posted on "+dua.time+"</p><p><b class='p-uname'>"+dua.nameOfPerson+"</b></p>"+
                                "<p>"+dua.dua+"</p>"+
                                "<p><input src='images/dua-hands.png' type='image' value='Pray' onclick='fnIncPray(\""+dua.id+"\","+dua.prays+",\""+userlikes+"\")' id='prbtn-"+dua.id+"'> <span id='pray-id-"+dua.id+"'>"+dua.prays+"</span></p>"+
                                "<div id='comm-"+dua.id+"' class='comment_area'>"+
                                  "<div class='commentsec'><div>"+
                                  "<input type='text' placeholder='Write a comment' id='coInp-"+dua.id+"' >"+
                                  "<input type='button' onclick='fnComment(\""+dua.id+"\")' value='comment'>"+
                                "<div>"+
                              "</div>"
                                                                        
            if(dua.userLikes.indexOf(sessionStorage.useremail)>-1)
            {
               document.getElementById("prbtn-"+dua.id).value="Prayed";
            } 
            else{
                document.getElementById("prbtn-"+dua.id).value="Pray";                                        
            }
    
}

function fnComment(duaId){
    var inputedCommentText = document.getElementById("coInp-"+duaId);
    var commentArea = document.getElementById("comm-"+duaId);
    var comments={
        username:sessionStorage.username,
        commentText:inputedCommentText.value,
        DuaId:duaId
    }
    inputedCommentText.value="";
    
    database.child("comments").push(comments);
}

function fnIncPray(duaId,numOfPrays,userlikes)
{
    var PrayCounterElement=document.getElementById("pray-id-"+duaId)
    if(userlikes.slice(0,1)=="" || userlikes.slice(0,1)=="," || userlikes.slice(0,1)==" ")
    {
        userlikes=userlikes.slice(1);
    }
    
    var userlikes = userlikes.split(",");
    
        if(userlikes.indexOf(sessionStorage.useremail)==-1){
            database.child("dua").child(duaId).child("prays").set(parseInt(numOfPrays)+1);
            userlikes.push(sessionStorage.useremail);
            database.child("dua").child(duaId).child("userLikes").set(userlikes);
           
        }
    
    //database.child("dua").child(duaId).child("userLikes").set([]);
    
   // for(var i=0;i<DuaArr.length;i++){
//        
//        if(DuaArr[i].id==u_id && DuaArr[i].userLikes.indexOf(sessionStorage.useremail)==-1)
//        {
//            //console.log("matched"+ DuaArr[i].id)    
//            DuaArr[i].prays+=1;
//            DuaArr[i].userLikes.push(sessionStorage.useremail);
//            PrayCounterElement.innerHTML=parseInt(PrayCounterElement.innerHTML)+1;
//            //document.getElementById("prbtn-"+u_id).value="Prayed";
//            localStorage.setItem('duas',JSON.stringify(DuaArr));
//        }
//        if(DuaArr[i].id==u_id && DuaArr[i].userLikes.indexOf(sessionStorage.useremail)>-1)
//        {
//            document.getElementById("prbtn-"+u_id).value="Prayed";
//        }
//        
//    }
}
function addDua(){
    var  dateTime=new Date();
    var date=getDayName(dateTime.getDay())+" "+dateTime.getDate()+"/"+getMonthName(dateTime.getMonth())+"/"+dateTime.getFullYear()+" "+hour12(dateTime.getHours())+":"+dateTime.getMinutes()+":"+dateTime.getSeconds()+" "+AmPm(dateTime.getHours());
    var duaElement=document.getElementById('createDua');
    if(duaElement.value.length=0)
    {
        alert("please enter your dua first");
    }
    var duaObj={
        time:date,
        dua:duaElement.value,
        nameOfPerson:sessionStorage.username,
        prays:0,
        userLikes:['none']
    }
    database.child("dua").push(duaObj);
   duaElement.value="";
  // viewAllDuas();
}

function getDayName(dayNum){
    switch(dayNum)
    {
        case 0:
        return "Sun";
        case 1:
        return "Mon";
        case 2:
        return "Tue";
        case 3:
        return "Wed";
        case 4:
        return "Thu";
        case 5:
        return "Fri";
        case 6:
        return "Sat";
    }
}
function getMonthName(monthNum){
    switch(monthNum)
    {
        case 0:
        return "Jan";
        case 1:
        return "Feb";
        case 2:
        return "Mar";
        case 3:
        return "Apr";
        case 4:
        return "May";
        case 5:
        return "Jun";
        case 6:
        return "Jul";
        case 7:
        return "Aug";
        case 8:
        return "Sep";
        case 9:
        return "Oct";
        case 10:
        return "Nov";
        case 11:
        return "Dec";
    }
}
function hour12(hour)
{
    if(hour==0)
    {
        hour ="12";
    }
    else if(hour>12){
        hour= hour-12;
    }
    if(hour>0 && hour<=9)
    {
        hour="0"+hour;
    }
    return hour;
}
function AmPm(hour)
{
    if(hour>12)
    return "PM";
    else
    return "AM";
}