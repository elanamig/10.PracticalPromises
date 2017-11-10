'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem two stanza one and stanza two, in any order
   *    but log 'done' when both are done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  const prom1 = promisifiedReadFile ('poem-two/stanza-01.txt').then (data=>blue(data));
  const prom2 = promisifiedReadFile ('poem-two/stanza-02.txt').then (data=>blue(data));

  console.log(prom1);

  // async.each ([prom1, prom2], (promise, eachDone) => {
  //   promise.then (data => {
  //     console.log('-- A. callback promise version --');
  //       blue(data);
  //       eachDone();
  //   });
  // })


  Promise.all ([prom1, prom2])
  .then (results => {
    console.log('done');
  }).catch(err=>console.log('-- A. callback promise version done --'));
}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log all the stanzas in poem two, in any order
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version
  //const promArray = filenames.map(name=>promisifiedReadFile(name).then(data=>blue(data)))
  Promise.all(filenames.map(name=>promisifiedReadFile(name).then(data=>blue(data)))).then(results=>console.log('done'));

}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log all the stanzas in poem two, *in order*
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  const promArray = filenames.map(name=>promisifiedReadFile(name));

  // Promise.all(promArray)
  // .then(results=>{

  //   results.forEach(stanza => {
  //     //then is not explicitly called - stanza is the RESOLVED value 
  //     blue(stanza);
  //   })

  //   console.log('done')
  // });

  Promise.each(filenames, filename => {
    return promisifiedReadFile(filename).then(data=>blue(data));
  }).then ((data) => console.log('done'));
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log all the stanzas in poem two, *in order*
   *    making sure to fail for any error and log it out
   *    and log 'done' when they're all done
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(err);
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  ///const promArray = filenames.map(name=>promisifiedReadFile(name));
  Promise.each(filenames, filename => {
    return promisifiedReadFile(filename).then(data=>blue(data)).catch(err=>magenta(err));
  }).then ((data) => console.log('done'));
  // filenames.forEach (name=> {
  //   promisifiedReadFile(name)
  // })


  // let prom = promisifiedReadFile(filenames[0]);
  // for (var i = 1; i<filenames.length-1; i++) {
  //   prom.then (data=>{
  //     blue(data);
  //     return 
  //   })
  //   prom = promisifiedReadFile(filenames[i]).then (data=> {
  //     blue(data);
  //     return promisifiedReadFile(filenames[i+1]);
  //   })
  // }

  // filesnames.reduce ( (promise, fileName) => {
  //   promise.then (data =>{
  //     blue(data);
  //     return promisifiedReadFile (fileName);
  //   })
  // }, new Promise());


}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    // your code here
  }
}
