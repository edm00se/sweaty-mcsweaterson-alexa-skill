'use strict';
const Alexa = require('ask-sdk-core');
const sweaty = require('./sweaty');
const ALEXA_SKILL_ID = process.env.MY_ALEXA_APP_ID;

const messages = {
  WELCOME:
    "Welcome to the Sweaty McSweaterson Skill; a skill for those who sweat easily in high humidity with warm weather.  Try asking me whether you'll get sweaty today.",
  WHAT_DO_YOU_WANT: 'What do you want to ask?',
  NOTIFY_MISSING_PERMISSIONS:
    'Please enable Location permissions in the Amazon Alexa app.',
  NO_ADDRESS:
    "It looks like you don't have either postal code or country set for your address. You can set your address from the companion app.",
  SWEATY_WEATHER: "Bring a towel, because you're going swimming. ",
  NOT_SO_SWEATY_WEATHER: 'You lucked out today. ',
  ERROR: 'Uh Oh. It looks like something went wrong.',
  LOCATION_FAILURE:
    'There was an error with the Device Address API. Please try again.',
  GOODBYE: 'Bye! Thanks for using the Sweaty McSweaterson Skill!',
  UNHANDLED: "This skill doesn't support that. Please ask something else.",
  HELP: 'You can use this skill by asking something like: will I sweat today?',
  STOP: 'Bye! Thanks for using the Sweaty McSweaterson Skill!'
};

const PERMISSIONS = ['read::alexa:device:all:address:country_and_postal_code'];

const LaunchRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.WELCOME)
      .reprompt(messages.WHAT_DO_YOU_WANT)
      .getResponse();
  }
};

const GetSweatyIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'GetSweatyIntent'
    );
  },
  async handle(handlerInput) {
    const {
      requestEnvelope,
      serviceClientFactory,
      responseBuilder
    } = handlerInput;

    const consentToken =
      requestEnvelope.context.System.user.permissions &&
      requestEnvelope.context.System.user.permissions.consentToken;
    if (!consentToken) {
      return responseBuilder
        .speak(messages.NOTIFY_MISSING_PERMISSIONS)
        .withAskForPermissionsConsentCard(PERMISSIONS)
        .getResponse();
    }
    try {
      const { deviceId } = requestEnvelope.context.System.device;
      const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
      const {
        countryCode,
        postalCode
      } = await deviceAddressServiceClient.getCountryAndPostalCode(deviceId);

      let response;
      if (postalCode === null || countryCode === null) {
        response = responseBuilder.speak(messages.NO_ADDRESS).getResponse();
      } else {
        console.log('Address successfully retrieved, now responding to user.');
        const sweatyFactor = await sweaty.bringTowel(postalCode, countryCode);
        let SWEATY_MESSAGE = null;
        if (true === sweatyFactor.yn) {
          SWEATY_MESSAGE = `${messages.SWEATY_WEATHER} The high today is ${
            sweatyFactor.high
          } and the humidity will only reach ${sweatyFactor.humidity}.`;
        } else {
          SWEATY_MESSAGE = `${
            messages.NOT_SO_SWEATY_WEATHER
          } The high today is ${
            sweatyFactor.high
          } and the humidity will reach ${sweatyFactor.humidity}.`;
        }
        response = responseBuilder.speak(SWEATY_MESSAGE).getResponse();
      }
      return response;
    } catch (error) {
      if (error.name !== 'ServiceError') {
        const response = responseBuilder.speak(messages.ERROR).getResponse();
        return response;
      }
      throw error;
    }
  }
};

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const UnhandledIntent = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.UNHANDLED)
      .reprompt(messages.UNHANDLED)
      .getResponse();
  }
};

const HelpIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.HELP)
      .reprompt(messages.HELP)
      .getResponse();
  }
};

const CancelIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.CancelIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(messages.GOODBYE).getResponse();
  }
};

const StopIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.StopIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(messages.STOP).getResponse();
  }
};

const GetAddressError = {
  canHandle(handlerInput, error) {
    return error.name === 'ServiceError';
  },
  handle(handlerInput, error) {
    if (error.statusCode === 403) {
      return handlerInput.responseBuilder
        .speak(messages.NOTIFY_MISSING_PERMISSIONS)
        .withAskForPermissionsConsentCard(PERMISSIONS)
        .getResponse();
    }
    return handlerInput.responseBuilder
      .speak(messages.LOCATION_FAILURE)
      .reprompt(messages.LOCATION_FAILURE)
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    GetSweatyIntent,
    SessionEndedRequest,
    HelpIntent,
    CancelIntent,
    StopIntent,
    UnhandledIntent
  )
  .addErrorHandlers(GetAddressError)
  .withApiClient(new Alexa.DefaultApiClient())
  .withSkillId(ALEXA_SKILL_ID)
  .lambda();
