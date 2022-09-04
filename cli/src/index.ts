#!/usr/bin/env node
import superagent from 'superagent';
import path from 'path';
import yargs from "yargs";


const options = yargs
    .usage("Usage: -f <name>")
    .option("f", { alias: "file", describe: "Location of Zip file of the folder to upload", type: "string", demandOption: true })
    .option("s", { alias: 'server', describe: 'Server Url', type: 'string', demandOption: true })
    .argv as any;


const fileLoc = path.resolve(process.cwd(), options.f);

console.log('Checking File located at ' + fileLoc);

const extension = path.extname(fileLoc);

if (extension !== '.zip') {
    console.error('Only Zip Files are allowed');
}
superagent.get(options.s).then(() => {
    superagent.put(`${options.s}/upload`).attach('upload', fileLoc).then(res => {
        console.log(`Folder Deployed at Url: ${res.body.url}`);
    })
}).catch(e => {
    console.error('Could not connect to server at ' + options.s);
    process.exit(1)
})
