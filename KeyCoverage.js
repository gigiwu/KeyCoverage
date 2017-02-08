var fs = require('fs');
var natural = require('natural');
var NGrams = natural.NGrams;
//readinput
var inputFile = './source.txt';
var corpus = fs.readFileSync(inputFile, 'utf8');
var freqMap = {};

tokenizer = new natural.WordTokenizer();
console.log(tokenizer.tokenize("  your dog has fleas.  "));

corpus.split(/\r?\n/).forEach(function(line){
  //console.log('tok:'+natural.PorterStemmer.tokenizeAndStem(line));
  //preprocess(line.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\']/g,""));
  preprocess(tokenizer.tokenize(line));
});
  console.log(freqMap);

function preprocess(data){
  var res = [];
  data.forEach(function(word,i){
      word = natural.PorterStemmer.stem(word);
      res.push(word);
  });

//1-gram
  res.forEach(function(callback, idx){
    var term = res[idx];
    putFreqMap(term);
  });

  //2~4 gram
  for(i = 2; i<=4; i++){
    putNgramIntoFreqMap(res,i);
  }

  /**
  NGrams.ngrams(res,2).forEach(function(callback, idx, ngram){
    var term = ngram[idx].join(" ");
    putFreqMap(term);
  });

  //3-gram
  NGrams.ngrams(res,3).forEach
**/

}


function putFreqMap(term){
  if(!freqMap[term]){
    freqMap[term] = 0;
  }
  freqMap[term] += 1;
}

function putNgramIntoFreqMap(corpus,n){
  NGrams.ngrams(corpus,n).forEach(function(callback, idx, ngram){
    var term = ngram[idx].join(" ");
    putFreqMap(term);
  });
}
console.log(NGrams.bigrams('some words here'));
console.log(NGrams.bigrams(['some',  'words',  'here']));
