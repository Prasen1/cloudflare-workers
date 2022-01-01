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
let html_style = `h1{color:#2c2d96}
body{padding:3em;font-family:arial,sans-serif;background-image:url(${content.hdurl}); background-position:center
center;background-repeat:no-repeat;background-size:cover;height:100vh;margin-bottom:50px;display:grid;place-items:center}
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
} #info{background-color: #EBEBEB; border-radius: 32px; justify-content: center; cursor: pointer; padding: 10px 10px;
display:none} #btn-show{position:fixed; bottom:40px; right:40px; opacity:0.6} #btn-show:hover{opacity:1}`
let html_content = `<div id="info">
    <h1>${content.title} 🔭</h1>`
    html_content += `<p>Date: ${content.date} </p>`
    html_content += `<p>${content.explanation}</p>`
    html_content += `<a href=${content.hdurl} download>Download Image</a>
</div>`
    html_content += `<button id="btn-show" onClick="displayInfo()">About this image</button>`
let html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <title>NASA: POD</title>
    <meta name="description" content="Nasa Picture of the Day">
    <script>
        function displayInfo() {
            var x = document.getElementById("info");
            if (x.style.display === 'none') {
                x.style.display = "block";
            }
            else if (x.style.display === 'block') {
                x.style.display = "none";
            }
            else {
                x.style.display = "block";
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
</body>`

return new Response(html, {
headers: {
"content-type": "text/html;charset=UTF-8",
},})
}
