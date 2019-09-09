const express = require('express') //import express into the express binding
const app = express(); // puts the whole lib into this app binding
app.listen(3000, () => console.log("Running . . . on port:3000"));
app.use(express.static('public')); // references a place where express will be looking 
// my content to host. I created a folder named 'public' and put my index.html file in there. 


// /Users/karnell.schultz/Documents/javaScript/lightProject

