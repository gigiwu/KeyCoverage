var express = require('express');
var router = express.Router();

const fs = require('fs');
const natural = require('natural');
const NGrams = natural.NGrams;
// read input
const inputFile = '../source.txt';
const corpus = fs.readFileSync(inputFile, 'utf8');
// to store term frequency map
const tokenizer = new natural.WordTokenizer();

const get1to4Gram = corpus => {
  let freqMap = {};
  const ngrams = corpus => n => NGrams.ngrams(corpus, n);
  const putFreqMap = term => freqMap[term] = (freqMap[term] || 0) + 1;

  corpus.split(/\r?\n/).forEach(line => {
    const stemmedData = tokenizer.tokenize(line)
      .map(natural.PorterStemmer.stem);
    [1, 2, 3, 4]
      .map(ngrams(stemmedData)) // [[['it', 's'], [] ], [...], [...]]
      .reduce((arr, terms) => arr.concat(terms), [])
      .map(term => term.join(" "))
      .map(putFreqMap)
  })

  return Object.keys(freqMap)
    .filter(key=>freqMap[key] > 1)
    .sort((a,b)=>freqMap[a]-freqMap[b])
    .map(key=>[key, freqMap[key]]);
}

const getTopNgram = (k, n, corpus) => {
  let freqMap = {};
  const putFreqMap = term => freqMap[term] = (freqMap[term] || 0) + 1;

  corpus.split(/\r?\n/).forEach(line => {
    const stemmedData = tokenizer.tokenize(line)
      .map(natural.PorterStemmer.stem);
    NGrams.ngrams(stemmedData, n) // [[['it', 's'], [] ], [...], [...]]
      .map(term => term.join(" "))
      .map(putFreqMap)
  })

  return Object.keys(freqMap)
    .filter(key=>freqMap[key] > 1)
    .sort((a,b)=>freqMap[b]-freqMap[a])
    .slice(0, k)
    .map(key=>[key, freqMap[key]]);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query);
  const k = parseInt(req.query.k);
  const n = parseInt(req.query.n);
  res.json({
    result: getTopNgram(k, n, corpus),
    corpus: corpus,
  });
  //res.render('index', { title: 'Express' });
});

router.post('/topngram', (req, res) => {
  const k = req.body.k;
  const n = req.body.n;
  const corpus = req.body.corpus;
  console.log(corpus);
  res.json({
    result: getTopNgram(k, n, corpus),
  });
});

module.exports = router;
