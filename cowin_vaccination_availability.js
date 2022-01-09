addEventListener("fetch", event => {
    return event.respondWith(handleRequest())
    })

const HTML = `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Covid Vaccination Sessions</title>
    <meta name="description" content="Vaccination sessions for current date and next 7 days via CowinAPI">
    <style>
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%
        }

        caption {
            color: #2c2d96;
            font-weight: bold;
            font-family: 'Open Sans', sans-serif;
            font-size: 27px;
            line-height: 32px;
            margin: 0 0 40px;
        }

        td,
        th {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px
        }

        tr:nth-child(even) {
            background: linear-gradient(to bottom, #09f 0, #9cf 100%)
        }

        tr:nth-child(odd) {
            background: linear-gradient(to bottom, #09f 0, #ccf 100%)
        }

        .cn {
            background-color: rgba(255, 255, 255, .95);
            border-radius: 5px;
            color: #333;
            font-family: system-ui, sans-serif;
            line-height: 1.5;
            max-width: 70%;
            padding: 1rem 2rem
        }

        @supports (-webkit-backdrop-filter:none) or (backdrop-filter:none) {
            .cn {
                -webkit-backdrop-filter: blur(10px);
                backdrop-filter: blur(10px);
                background-color: rgba(255, 255, 255, .5)
            }
        }

        body {
            background-image: url(https://cdn.pixabay.com/photo/2019/09/28/10/38/medical-4510408_1280.png);
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            height: 100vh;
            margin-bottom: 50px;
            display: grid;
            place-items: center
        }

        h1 {
            color: #2c2d96;
            font-family: 'Helvetica Neue', sans-serif;
            font-weight: bold;
            letter-spacing: -1px;
            line-height: 1;
        }

        button {
            color: #fff;
            background: #416dea;
            padding: 12px 12px;
            cursor: pointer;
            border-radius: 36px;
            font-size: 13px;
            font-weight: 500;
            justify-content: center;
            box-shadow: 2px 5px 10px #e4e4e4;
            color: #fff;
        }

        footer {
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            height: 50px;
            margin-bottom: 0px;
            width: 100%;
            background-color: #2c2d96;
            color: #fff;
            text-align: center;
            font-family: 'Open Sans', sans-serif;
            font-size: 18px;
        }

        .container {
            margin: 20px 20px;
            padding-top: 30px;
            padding-bottom: 80px;
        }

        input {
            padding: 11px 11px;
            cursor: text;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 700;
            justify-content: center;
            box-shadow: 2px 5px 4px #e4e4e4;
        }
    </style>
</head>

<body onload="sessionToday();">
    <h1>Sessions For Pincode 797112 Today</h1>
    <div class="cn">
        <table id="tb">
        </table>
    </div>
    <script>
        Date.prototype.formatDDMMYYYY = function () {
            return this.getDate() +
                "-" + (this.getMonth() + 1) +
                "-" + this.getFullYear();
        }
        var d = new Date();
        var td = d.formatDDMMYYYY();
        var txt = "";
        pinCode = 797112;
        function sessionToday() {
            if (document.getElementById('pin-input').value.length > 0) {
                pinCode = document.getElementById('pin-input').value;
            }
            var byPin = new Request('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pinCode + '&date=' + td);
            txt = "";
            document.getElementById('tb').innerHTML = "<tr><th>Center Block Name</th><th>Center Name</th><th>Availability</th><th>Date</th><th>Fee</th><th>Minimum Age Limit</th><th>Slots</th></tr>"
            fetch(byPin)
                .then(response => response.json())
                .then(data => {
                    for (const session of data.sessions) {
                        txt += "<tr><td>" + session.block_name + "</td>";
                        txt += "<td>" + session.name + "</td>";
                        txt += "<td>" + session.available_capacity + "</td>";
                        txt += "<td>" + session.date + "</td>";
                        txt += "<td>" + session.fee + "</td>";
                        txt += "<td>" + session.min_age_limit + "</td>";
                        txt += "<td>" + session.slots + "</td></tr>";
                    }
                    if (txt.length === 0) { txt += "No available sessions"; }
                    document.getElementById("tb").innerHTML += txt;
                    document.querySelector("body > h1").innerHTML = "Sessions For Pincode " + pinCode + " Today";
                })
                .catch(console.error);
        }
        function nextSeven() {
            if (document.getElementById('pin-input').value.length > 0) {
                pinCode = document.getElementById('pin-input').value;
            }
            var byPinCal = new Request('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=' + pinCode + '&date=' + td);
            txt = "";
            document.getElementById('tb').innerHTML = "";
            txt = "<caption>Next 7 Days from Today</caption>"
            fetch(byPinCal)
                .then(response => response.json())
                .then(data => {
                    for (const center of data.centers) {
                        txt += "<tr><td>" + center.block_name + "</td>";
                        txt += "<td>" + center.name + "</td><td>";
                        center.sessions.forEach(function (s) {
                            txt += "<b> Date: " + s.date + "</b><br> Availability: " + s.available_capacity + "<br> Min age: " + s.min_age_limit + "<br> Slots: " + s.slots + "<br><hr>"
                        });
                        txt += "</td></tr>";
                    }
                    document.getElementById("tb").innerHTML += txt;
                    document.querySelector("body > h1").innerHTML = "Sessions For Pincode " + pinCode;
                })
                .catch(console.error);
        }
    </script>
    <div class="container">
        <button id="btn" onclick="nextSeven();">Sessions for next 7 days</button>
        <button id="rf" onclick="sessionToday();">Sessions Today</button>
        <input type="number" id="pin-input" placeholder="Check Another Pincode">
    </div>
    <footer>
        <p>Register &nbsp;&#x1F449;&#x1F3FB;&nbsp;<a style="color:#fff" href="https://www.cowin.gov.in/home"
                target="_blank">CoWin Portal</a><a style="color:#fff;float:right" href="https://prasenjit.co.in/"
                target="_self">Author</a></p>
    </footer>
</body>

</html>
`
async function handleRequest() {
    const init = {
    headers: {
    "content-type": "text/html;charset=UTF-8",
    },
    }
    return new Response(HTML, init)
    }
