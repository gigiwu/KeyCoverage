const fs = require('fs');
const fetch = require('node-fetch');
const inputFile = './source.txt';
const corpus = fs.readFileSync(inputFile, 'utf8');

const getTopNgram = (k, n, corpus) => fetch("http://localhost:3000/topngram", {
    method: "post",
    headers: { 'Content-type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ k, n, corpus })
  })
  .then(res => res.json())
  .then(json => json.result)

getTopNgram(10, 2, corpus).then(result => console.log(result))
