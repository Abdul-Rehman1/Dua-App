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
function viewAllDuas(){
    
    var duaContainer=document.getElementById('right-view');
    var viewDuas=localStorage.getItem('duas');
    
    if(viewDuas){
        viewDuas=JSON.parse(viewDuas);
        duaContainer.innerHTML="";
        for(var i=viewDuas.length-1;i>=0;i--)
        {
            duaContainer.innerHTML+="<div class='well'>"+
                                        "<p style='text-align:right;' class='time'>Posted on "+viewDuas[i].time+"</p><p><b class='p-uname'>"+viewDuas[i].nameOfPerson+"</b></p>"+
                                        "<p>"+viewDuas[i].dua+"</p>"+
                                        "<p><input type='button' value='Prayed' onclick='fnIncPray("+viewDuas[i].id+")' id='prbtn-"+viewDuas[i].id+"'> <span id='pray-id-"+viewDuas[i].id+"'>"+viewDuas[i].prays+"</span></p>"+
                                        "<div id='comm-"+viewDuas[i].id+"' class='comment_area'>"+
                                          "<div class='commentsec'><div>"+
                                          "<input type='text' placeholder='Write a comment' id='coInp-"+viewDuas[i].id+"' >"+
                                          "<input type='button' onclick='fnComment("+viewDuas[i].id+")' value='comment'>"+
                                        "<div>"+
                                      "</div>"
                                      
            for(var j=0;j<viewDuas[i].comments.length;j++)
            {
                var p=document.createElement('p');
                var commentText=document.createTextNode(viewDuas[i].comments[j]);
                p.appendChild(commentText);
                document.getElementById("comm-"+i).getElementsByClassName("commentsec")[0].insertBefore(p, document.getElementById("comm-"+i).getElementsByClassName("commentsec")[0].childNodes[0])
            }
            if(viewDuas[i].userLikes.indexOf(sessionStorage.useremail)>-1)
            {
               document.getElementById("prbtn-"+viewDuas[i].id).value="Prayed";
            } 
            else{
                document.getElementById("prbtn-"+viewDuas[i].id).value="Pray";                                        
            }
        }
    }   
}
function fnComment(duaId){
    var inputedCommentText = document.getElementById("coInp-"+duaId);
    var commentArea = document.getElementById("comm-"+duaId);
    var p=document.createElement('p');
    var commentText=document.createTextNode(sessionStorage.username+": "+inputedCommentText.value);
    p.appendChild(commentText);
    commentArea.getElementsByClassName("commentsec")[0].insertBefore(p, commentArea.getElementsByClassName("commentsec")[0].childNodes[0]);
    inputedCommentText.value="";
    var DuaArr=JSON.parse(localStorage.getItem('duas'));
    for(var i=0;i<DuaArr.length;i++){
        if(DuaArr[i].id==duaId)
        {
            DuaArr[i].comments.push(commentText.nodeValue);
            localStorage.setItem('duas',JSON.stringify(DuaArr));
            break;
        }
    }
}

function fnIncPray(u_id)
{
    var DuaArr=JSON.parse(localStorage.getItem('duas'));
    var PrayCounterElement=document.getElementById("pray-id-"+u_id)
    for(var i=0;i<DuaArr.length;i++){
        
        if(DuaArr[i].id==u_id && DuaArr[i].userLikes.indexOf(sessionStorage.useremail)==-1)
        {
            //console.log("matched"+ DuaArr[i].id)    
            DuaArr[i].prays+=1;
            DuaArr[i].userLikes.push(sessionStorage.useremail);
            PrayCounterElement.innerHTML=parseInt(PrayCounterElement.innerHTML)+1;
            //document.getElementById("prbtn-"+u_id).value="Prayed";
            localStorage.setItem('duas',JSON.stringify(DuaArr));
        }
        if(DuaArr[i].id==u_id && DuaArr[i].userLikes.indexOf(sessionStorage.useremail)>-1)
        {
            document.getElementById("prbtn-"+u_id).value="Prayed";
        }
        
    }
}
function addDua(){
    var  dateTime=new Date();
    var date=getDayName(dateTime.getDay())+" "+dateTime.getDate()+"/"+getMonthName(dateTime.getMonth())+"/"+dateTime.getFullYear()+" "+hour12(dateTime.getHours())+":"+dateTime.getMinutes()+":"+dateTime.getSeconds()+" "+AmPm(dateTime.getHours());
    var duaElement=document.getElementById('createDua');
    if(duaElement.value.length=0)
    {
        alert("please enter your dua first");
    }
    var duaArr =localStorage.getItem('duas');
    if(!duaArr)
    {
        var duaArr=[];
    }   
    else{
        duaArr=JSON.parse(duaArr);1
    }
    var duaObj={
        id:duaArr.length,
        time:date,
        dua:duaElement.value,
        nameOfPerson:sessionStorage.username,
        prays:0,
        userLikes:[],
        comments:[]
    }
    duaArr.push(duaObj);
   localStorage.setItem('duas',JSON.stringify(duaArr));
   duaElement.value="";
   viewAllDuas();
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