var ScreenshotApi = require('./lib/ScreenshotApi.js'),

    fs            = require('fs'),
    path          = require('path'),

    winston       = require('winston'),
    config        = require('config'),

    kue           = require('kue'),
    jobs          = kue.createQueue();

var cwd = process.cwd();

var cacheFolder = path.resolve(cwd, config.cache.folder);
// Warn if cache folder dosn't exist
if (!fs.existsSync(cacheFolder)){
  winston.info('"%s" folder not found. Make sure the server configuration is correct.', cacheFolder);
}


if ( !!config.logging )
  winston.add(winston.transports.File, config.logging );

winston.info('--- Starting Renderer ---');

var screenshotApi = new ScreenshotApi(config);

jobs.process('screenshot', function(job, done){
  winston.info('Process job "%s"', job.data.title);

  var canceled = false,
      globalTimeout = setTimeout(function(){
        canceled = true;
        done ( new Error('Request took longer than ' + config.screenshot.globaltimeout + 'ms') );
      }, config.screenshot.globaltimeout);

    var options = {
        screenSize: {
            width: 320
            , height: 480
        }
        , shotSize: {
            width: 320
            , height: 'all'
        }
        , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
        , timeout: 10000
    };

    try{

    screenshotApi.screenshot(job.data.title, options, job, function(err, stream){
      clearTimeout(globalTimeout);
      if ( canceled ) return;

      if ( err ){

        done ( '' + err );

      } else {

        job.log('Cache Request ' + job.data.id);
        job.log('Done');
        // stream.pipe(fs.createWriteStream(path.resolve(cacheFolder, job.data.id)));
        done();

      }
    });
  } catch ( err ){
    done ( '' + err );
  }
});
