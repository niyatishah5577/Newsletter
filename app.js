const express = require("express")
const bodyParser = require("body-parser")
// const request =require("request")
const https = require("https");
const { dirname } = require("path");

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(process.env.PORT||3000, function () {
    console.log("up and running")
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})


app.post("/failure",function(req,res){
    res.redirect("/")
})

app.post("/", function (req, res) {

    fname = req.body.fname
    lname = req.body.lname
    email = req.body.email
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }
    const jsondata = JSON.stringify(data)
    const url = "https://us17.api.mailchimp.com/3.0/lists/acecd66a17"
    const options = {
        method: "POST",
        auth: "niyatishah5577:a39d15d920fe0c3760558cdf80105ce7-us17"
    }
    const request_mail_chimp = https.request(url, options, function (response) {
        response.on("data", function (data) {
            mainData = JSON.parse(data)
            console.log(mainData)
            console.log(mainData.error_count)
            if ((JSON.parse(data)).error_count === 0) {
                console.log(response.statusCode);
                res.sendFile(__dirname+'/success.html');
              } else if ((JSON.parse(data)).errors[0].error_code === 'ERROR_CONTACT_EXISTS' || (JSON.parse(data)).errors[0].error_code === 'ERROR_GENERIC'){
                res.sendFile(__dirname+'/failure.html');
              };
            
        })
        
    })
    request_mail_chimp.write(jsondata)
    request_mail_chimp.end()
})

// api key a39d15d920fe0c3760558cdf80105ce7-us17
//audience id acecd66a17