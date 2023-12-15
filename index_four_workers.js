const express = require("express");
const {Worker} = require("worker_threads");

const app = express();
const port = process.env.PORT || 3000;
const Thread_count =4 




//non-blocking
app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});


function createWorker(){
  const worker = new Worker('./four_worker.js',{
    workerData:{thread_count:Thread_count}
  })

    worker.on("message", (data) => {
      return data
    });

    worker.on("error", (msg) => {
      throw new Error(msg)
    });
  
}

//blocking
app.get("/blocking/", async (req, res) => {
    const workerPromises = [];

    for(let i = 0; i < Thread_count; i++){
      workerPromises.push(createWorker())
    }
  
    const result = await Promise.all(workerPromises)

    const total = result[0]+result[1]+result[2]+result[3]

    res.status(200).send(`result is ${total}`)
  });


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});