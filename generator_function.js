function *generatorFunction() {
    console.log('Generator Function is running');

    let x=5;
    yield x;    // pauses the function and returns it at this point if called

    x++;
    y = yield x;
    return x + y;           // lazy execution; additional work not done until i explicitly call the next()
}

let iterator = generatorFunction();

console.log(iterator.next());   // returns an object with a 'value' and a boolean 'done'  {value:5, done:false}
console.log(iterator.next());   // to resume the paused function  (but it gets paused again) {value:6, done:false}
console.log(iterator.next(4));  // this resumes function again and assigns passed parameter to the value to which yield was assigned and it returns the result of their addition
                                                // {value:10, done:true}

console.log('All Done!');