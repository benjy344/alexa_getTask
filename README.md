# Alexa getTask
![Alexa logo](https://images-na.ssl-images-amazon.com/images/I/313cnZULc9L.png)

I try the new Amazon home bot Alexa and the Lambda functions

and i tried to create a simple function that aims to list tasks according to a given day.

I make this in differents steps which i will explain here

## Step 1 : Creating Alexa Skill


So let's start and go to the Amazon Dev console (after some "creating account's steps") and create a New Alexa skill

 
![Alexa step1](http://jice.lavocat.name/blog/images/posts/2017/tutoriel_amazon_alexa/alexa_skill_dev_console.png)


Here I enter some informations like **Name** and **Invocation Name** and create my skill

Next i need to defined the intent schema

~~~javascript
{
  "intents": [
    {
      "slots": [
        {
          "name": "day",
          "type": "LIST_OF_DAYS"
        }
      ],
      "intent": "WhatsMyTask"
    },
    {
      "intent": "AMAZON.HelpIntent"
    }
  ]
}
~~~ 


I define here the name of my function i will call, the name of my variable and the differents value this variable is able to takes. (monday, thursday...)

I need to defined the differents utterances that Alexa need to undersantand

~~~text

WhatsMyTask what's my task for {day}
WhatsMyTask what is my task for {day}
WhatsMyTask what are my tasks for {day}
WhatsMyTask have i tasks for {day}

~~~ 


## Step 2 : Creating Lambda Function

In this step I used an already exist's function, in order to import some `node_modules` easier and i totaly modificate it.

In first, I import the Alexa SDK 

~~~Javascript
const Alexa = require('alexa-sdk')
~~~

And i defined my ansers and some default phrases

~~~javascript
const languageStrings = {
    'en-US': {
        translation: {
            DAYS: {
                'monday':'Do a stuff.',
                'tuesday':'Go out.',
                'wednesday':'Get some sleep.',
                'thurday':'Go drunk yourself.',
                'friday':'Watch a movie.',
                'saturday':'Sleep a lot.',
                'sunday':'Sleep again.',
            },
            SKILL_NAME: 'My Tasks',
            GET_TASK_MESSAGE: "Here's your tasks for ",
            HELP_MESSAGE: 'You can say what is my tasks for monday, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};
~~~

In a futur, all there tasks will be load with an API like **Google Calendar** or **Wunderlist**, but I ran out of time to finish this...

Next I need to export my module 

~~~javascript
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
}
~~~

Here the **event** correspond to the request of the user, it's a object like 

~~~javascript
{
  "session": {
    "new": true,
    "sessionId": "SessionId.XXX",
    "application": {
      "applicationId": "amzn1.ask.skill.XXX"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.XXX"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.XXX",
    "intent": {
      "name": "WhatsMyTask",
      "slots": {
        "day": {
          "name": "day", 
          "value": "Monday" // here the day ask by the user
        }
      }
    },
    "locale": "en-US",
    "timestamp": "2017-12-10T19:26:18Z"
  },
  "context": {
    "AudioPlayer": {
      "playerActivity": "IDLE"
    },
    "System": {
      "application": {
        "applicationId": "amzn1.ask.skill.XXX"
      },
      "user": {
        "userId": "amzn1.ask.account.XXX"
      },
      "device": {
        "supportedInterfaces": {}
      }
    }
  },
  "version": "1.0"
}
~~~


And I need to defined what I do when I got this event

~~~javascript
const handlers = {
    'LaunchRequest': function () {
        this.emit('GetTask');
    },
    'GetNewFactIntent': function () {
        this.emit('GetTask');
    },
    'Unhandled': function () {
        this.emit('GetTask');
    },
    'GetTask': function () {
        // Use this.t() to get corresponding language data
        const tasksArr       = this.t('DAYS');
        // Get the request day value
        let day             = this.event.request.intent.slots.day.value.toLowerCase();
        const myTask        = tasksArr[day];

        // Create speech output
        const speechOutput = this.t('GET_TASK_MESSAGE') + day + " : " + myTask;
        this.emit(':tell', speechOutput, this.t('SKILL_NAME'), myTask);
    },
    
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt      = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};
~~~

I create differents events and some default functions witch retrun a question if Alexa doesn't anderstant or the response with the GetTask function


## Step 3 : Linking Skill with my Lambda function

Here I have to make sure that my function get the `Kit Alexa Skill` and can save it. In the Alexa console I reseigne the **ARN id** to make the link between Skill and Lambda.

![Alexa link](https://raw.githubusercontent.com/benjy344/alexa_getTask/master/img/img1.png)


## Step 4 : Testing

Finaly I can test my skill with the `Service Simulator` and appreciate the Alexa's anwser 😄

![Alexa testing](https://raw.githubusercontent.com/benjy344/alexa_getTask/master/img/img2.png)