const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "./build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

// app.get('/', (req, res) => {
//     res.send("Hello World");
// })

app.listen(port, async () => {
    try {
        console.log(`server is listening on port ${port} `)
    } catch(e) {
        console.log(e.message);
    }
    
})