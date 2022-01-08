addEventListener('fetch', event => {
event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
let endpoint = "https://api.nasa.gov/planetary/apod"
const token = "xxx"
endpoint+= `?api_key=${token}`
const init = {
headers: {
"content-type": "application/json;charset=UTF-8",
},
}

const response = await fetch(endpoint,init)
const content = await response.json()

let html_style = `h1{
    color:#2c2d96
}
 body{
    padding:3em;
    font-family:arial,sans-serif;
    background-image:url(${
        content.hdurl
    }
    );
    background-position:center center;
    background-repeat:no-repeat;
    background-size:cover;
    height:100vh;
    margin-bottom:50px;
    display:grid;
    place-items:center
}
 a,button{
     color: #fff;
     background: #416dea;
     padding: 12px 12px;
     border-radius: 36px;
     font-size: 13px;
     font-weight: 500;
     justify-content: center;
     box-shadow: 2px 5px 10px #e4e4e4;
     color: #fff;
}
 #info{
    background-color: #EBEBEB;
     border-radius: 32px;
     justify-content: center;
     cursor: pointer;
     padding: 10px 10px;
     display:none;
}
#epic{
    background-color: #EBEBEB;
     border-radius: 32px;
     justify-content: center;
     padding: 10px 10px;
    display: inline-block;
    text-align: center;
     width: 850px;
     margin: auto;
}
 #btn-show{
    position:fixed;
     bottom:60px;
     right:40px;
     opacity:0.6
}
 #btn-show:hover{
    opacity:1
}
footer{
    position:fixed;
    bottom:0px;
     left:0px;
     right:0px;
     height:50px;
     margin-bottom:0px;
    width:100%;
    background-color:#2c2d96;
    color:#fff;
    text-align:center;
    font-family: 'Open Sans', sans-serif;
     font-size: 16px;
}`

let html_content = `<div id="info">
                        <h1>${content.title} 🔭</h1>
                        <p>Date: ${content.date} </p>
                        <p>${content.explanation}</p>
                        <a href=${content.hdurl} download>Download Image</a>
                    </div>`
html_content += `<button id="btn-show" onClick="displayInfo()">Picture of the Day</button>`
html_content += `<div id="epic">
                    <p><em>Daily imagery collected by DSCOVR's Earth Polychromatic Imaging Camera (EPIC) instrument. Uniquely positioned at the Earth-Sun Lagrange point, EPIC provides full disc imagery of the Earth and captures unique perspectives of certain astronomical events such as lunar transits using a 2048x2048 pixel CCD (Charge Coupled Device) detector coupled to a 30-cm aperture Cassegrain telescope.</em></p>
                    <img src="" alt="NASA EPIC-Earth Polychromatic Imaging Camera" width="500" height="500">
                    <p>Caption:</p>
                    <p>Latitute and Longitude:</p>
                    <p></p>
                    <button id="btn-next" onClick="nextImg()">>></button>
                    </div>`

let html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <title>NASA: POD</title>
    <meta name="description" content="Nasa Picture of the Day and EPIC-Earth Polychromatic Imaging Camera">
    <script>
        function displayInfo() {
            var divInfo = document.getElementById("info");
            var divEpic = document.getElementById("epic");
            if (divInfo.style.display === 'none') {
                divInfo.style.display = "block";
                divEpic.style.display = "none";
            }
            else if (divInfo.style.display === 'block') {
                divInfo.style.display = "none";
                divEpic.style.display = "inline-block";
            }
            else {
                divInfo.style.display = "block";
                divEpic.style.display = "none";
            }
        }   
    </script>
</head>

<body>
    <style>
        ${html_style}
    </style>
    <div id="container">
        ${html_content}
    </div>
    <script>
        nasa_epic_url="https://epic.gsfc.nasa.gov/api/natural";
        nasa_img_uri="https://epic.gsfc.nasa.gov/archive/natural/";
        img_data=[];
        n=0;
        i=1;
        imgElem= document.querySelector("#epic>img");
        p2= document.querySelectorAll("#epic>p")[1];
        p4 = document.querySelectorAll("#epic>p")[3];
        fetch(nasa_epic_url)
        .then(response => response.json())
        .then(data => {
            data.forEach(function(item){img_data.push([nasa_img_uri+item.date.split(" ")[0].replaceAll('-','/')+"/png/"+item.image+".png",item.caption+" Date: "+item.date,item.centroid_coordinates])})
            n=img_data.length;
            imgElem.src = img_data[0][0];
            p2.innerHTML = img_data[0][1];
            p4.innerHTML = img_data[0][2].lat+","+img_data[0][2].lon;
        })
        .catch(console.error); 
        function nextImg()
        {
            if(i<n)
            {
            imgElem.src = img_data[i][0];
            p2.innerHTML = img_data[i][1];
            p4.innerHTML = img_data[i][2].lat+","+img_data[i][2].lon;
            i++;
            }
            else
            {
            i=0;
            imgElem.src = img_data[i][0];
            p2.innerHTML = img_data[i][1];
            p4.innerHTML = img_data[i][2].lat+","+img_data[i][2].lon;
            }
        }
    </script>
    <footer><p>This page relies on NASA's EPIC and POD APIs for the latest data<a href="https://api.nasa.gov/" target="_blank">NASA APIs</a>&nbsp;&nbsp;&nbsp;<a href="https://prasenjit.co.in/" target="_self">Author</a></p>
    </footer>
</body>`

return new Response(html, {
headers: {
"content-type": "text/html;charset=UTF-8",
},})
}
