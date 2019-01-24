//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };
  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us11.api.mailchimp.com/3.0/lists/3bc98355af",
    method: "POST",
    headers: {
      "Authorization": "marcin1 b4772d7f30d1e36bd8f226535480e45d-us11"
    },
    body: jsonData
  };

// redirect to success.html or failure.html based on statusCode from Mailchimp api
  request(options, function(error, response, body) {
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      console.log(response.statusCode);
    }
  });
});

// redirect to homepage when failure accures
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// check if server is running properly
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});


// mailchimp api key
// b4772d7f30d1e36bd8f226535480e45d-us11

// unique id mailchimp
// 3bc98355af
