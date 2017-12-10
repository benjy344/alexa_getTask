/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

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
            GET_TASK_MESSAGE: "Here's your tasks: ",
            HELP_MESSAGE: 'You can say what is my tasks for monday, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};

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
        const speechOutput = this.t('GET_TASK_MESSAGE') + myTask;
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

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
