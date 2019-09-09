// /Users/karnell.schultz/Documents/javaScript/lightProject
//nodemin index.js
const fs = require('fs');
const express = require('express') //import express into the express binding
const app = express(); // puts the whole lib into this app binding

app.listen(3000, () => console.log("Running on port:3000 ===> http://localhost:3000"));
app.use(express.static('public')); // references a place where express will be looking 
// my content to host. I created a folder named 'public' and put my index.html file in there. 
app.use(express.json({limit: '100kb'}));

// telling my server what to do when it gets a POST and setting up the endpont
app.post('/api', (request, response) => {
    const data = request.body;
    console.log(request.body);

    response.json({
        status: 'Success',
        latitude: data.lat,
        longitude: data.lon
        
    }); 
    logs.push(request.body)
    console.log(logs)
    
})
// fs.mkdir('/Users/karnell.schultz/Documents/javaScript/lightProject/swagy',
// {recursive: true }, (err) => {
//     if (err) throw err;
// })


let logs = [];