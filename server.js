const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

const port = process.env.PORT || 3000;

const videoFileMap={
    'myscholarship':'videos/myscholarship.mp4'
}

app.get('/videos/:filename', (req, res)=>{
    const fileName = req.params.filename;
    console.log("fileName ", fileName)
    const filePath = videoFileMap[fileName]
    console.log("filePath ", filePath)
    if(!filePath){
        return res.status(404).send('File not found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res)
    }
})

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