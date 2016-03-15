'use strict';

var http = require('http');
var https = require('https');

var options = require('./options');

var AlexaSkill = require('./AlexaSkill');
var EchoTasker = function () {
    AlexaSkill.call(this, options.appid);
};

EchoTasker.prototype = Object.create(AlexaSkill.prototype);
EchoTasker.prototype.constructor = EchoTasker;

EchoTasker.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'I can send an Auto Remote message for you. ' +
    'Speak your message. Or. Say the word text, the name of a person to text, and then your message.';

  var reprompt = 'For example, Alexa, tell Tasker to text joao, I love Tasker!';

  response.ask(output, reprompt);
};

EchoTasker.prototype.intentHandlers = {
    // register custom intent handlers

    TaskerIntent: function (intent, session, response) {
        console.log("TaskerIntent received");
        httpreq('http://autoremotejoaomgcd.appspot.com/sendmessage?key=' + options.ARkey + '&message=echo=:=' + intent.slots.Message.value, function(error) {
            response.tell("Auto Remote message sent");
//            genericResponse(error, response);
        });
    },

    SMSIntent: function (intent, session, response) {
        console.log("SMSIntent received");
        httpreq('http://autoremotejoaomgcd.appspot.com/sendmessage?key=' + options.ARkey + '&message=text_' + intent.slots.Person.value + '=:=' + intent.slots.Message.value, function(error) {
            response.tell("Text sent to " + intent.slots.Person.value + " saying " + intent.slots.Message.value);
        });
    },
}


function httpreq(options, responseCallback) {
    var transport = options.useHttps ? http : http;

    var req = transport.request(options, function(httpResponse) {
        var body = '';

        httpResponse.on('data', function(data) {
            body += data;
        });

        httpResponse.on('end', function() {
            responseCallback(undefined, body);
        });
    });

    req.on('error', function(e) {
        responseCallback(e);
    });

    req.end();
}


function genericResponse(error, response, success) {
    if (!error) {
        if (!success) {
            response.tell("OK");
        }
        else {
            response.tell(success);
        }
    }
    else {
        response.tell("The Lambda service encountered an error: " + error.message);
    }
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the EchoTasker skill.
    var echoTasker = new EchoTasker();
    echoTasker.execute(event, context);
};
