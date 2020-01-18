// sig test enelu hamar e. Or imananq te vorn e arag, innn e dandax.
// npm i benchmark -g
// npm i benchmark

let Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

// add tests
suite.add('standard functions', function() {
    function l() {}
})
.add('arrow functions', function() {
    let f = () => {};
})
// add listeners
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });