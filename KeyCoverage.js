const fs = require('fs');
const natural = require('natural');
const NGrams = natural.NGrams;
// read input
const inputFile = './source.txt';
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

const grams2 = getTopNgram(10, 2, corpus);
const grams3 = getTopNgram(10, 3, corpus);
const grams4 = getTopNgram(10, 4, corpus);
console.log(grams2);
console.log(grams3);
console.log(grams4);
