var chalk = require('chalk');

module.exports = function(){
  return function *logEverything(next) {
    console.log(chalk.gray.underline(' -- parsed request headers -- '));
    logHeaders(this.request.headers);
    console.log(chalk.gray.underline(' -- parsed request body -- '));
    console.log(chalk.gray(JSON.stringify(this.request.body)));

    var res = this.res;
    var ctx = this;
    logResponse(res,ctx);
    yield next;

  };
}
function logHeaders(headers){
  for(key in headers){
    if(headers.hasOwnProperty(key)){
      console.log(chalk.gray(key + ': ' + headers[key]))
    }
  }
}
function logResponse(res,ctx) {
  var onfinish = done.bind(null, 'finish');
  var onclose = done.bind(null, 'close');
  res.once('finish', onfinish);
  res.once('close', onclose);
  function done(event){
    res.removeListener('finish', onfinish);
    res.removeListener('close', onclose);
    console.log(chalk.gray.underline('-- responding with body --'));
    console.log(chalk.gray(ctx.body));
  }
}
