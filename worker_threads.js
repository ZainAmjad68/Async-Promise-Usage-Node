const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    console.log('Starting Main Thread');
    const worker = new Worker(__filename, {
            workerData : {
                secondMsgFromParent : 'Keep doing work',
                timeToWaste: 1500
            }

    });      // to let it know that cpu intensive code is in same file
    worker.on('message', (worker_msg) => {
        console.log(`Worker: ${worker_msg}`);
    })
    worker.postMessage('Done with my work');
    console.log('At the end of Main Thread; but still in it.');
} else {
    // this message is displayed at the end because worker was still blocked by the wasteTime method and couldn't handle parent msg event till the end 
    parentPort.on('message', (parent_msg) => {
          console.log(`First Parent Message (inside an event): ${parent_msg}`);
    })
    console.log(`Second Parent Message (using WorkerData): ${workerData.secondMsgFromParent}`);
    parentPort.postMessage('Starting Worker Thread');
    wasteTime(workerData.timeToWaste);
    parentPort.postMessage('In the Middle');
    wasteTime(2000);
    parentPort.postMessage('At the end of Worker Thread');
}

function wasteTime (delay) {
    const end = Date.now() + delay;
    while (Date.now() < end) {}
}

//const worker = new Worker('cpu_intensive.js')   // the file that has cpu intensive tasks

// or you can just pass the code you want to run in a new thread to the constructor
// eval : true tells node that the first arg should be interpreted as code
//const secondWorker = new Worker(`console.log('damn this is tough')`, {eval : true})