const passwordValidator = require('password-validator');
const { loginUser } = require('../apis/user');
const { readFile, writeFile, createDirectory } = require('./file-utlis');
const { validateEmail } = require('../utils/inquirerUtils');
const { logger } = require('./logger');
const chalk = require('chalk');
const _ = require('lodash');
const fs = require('fs');
const generateConfigJSON = (configObj, targetDir) => {
  try {
    const JSONObj = {
      theme: {
        colors: configObj.colors || {
          primary_color: '',
          secondary_color: '',
          accent_color: '',
          link_color: '',
          button_secondary_color: ''
        },
        styles: configObj.styles || {},
        font: configObj.font || {
          variants: {
            light: {
              name: '300',
              file:
                'http://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLDz8V1tvFP-KUEg.ttf'
            },
            regular: {
              name: 'regular',
              file:
                'http://fonts.gstatic.com/s/poppins/v9/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf'
            },
            medium: {
              name: '500',
              file:
                'http://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLGT9V1tvFP-KUEg.ttf'
            },
            semi_bold: {
              name: '600',
              file:
                'http://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.ttf'
            },
            bold: {
              name: '700',
              file:
                'http://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLCz7V1tvFP-KUEg.ttf'
            }
          },
          family: 'Poppins'
        }
      }
    };
    writeFile(
      targetDir + '/config.json',
      JSON.stringify(JSONObj, undefined, 2)
    );
    return configObj;
  } catch (error) {
    return Promise.reject(error.message);
  }
};

const setContext = contextName => {
  let contextData = JSON.parse(readFile('./.fdk/context.json'));
  if (contextData.contexts[contextName]) {
    contextData.current_context = contextName;
    writeFile('./.fdk/context.json', JSON.stringify(contextData, undefined, 2));
  } else {
    return Promise.reject('No matching context found');
  }
};
const getActiveContext = () => {
  let contextData = JSON.parse(readFile('./.fdk/context.json'));
  if (
    contextData.current_context.length > 0 &&
    contextData.contexts[contextData.current_context]
  ) {
    const currentContext = contextData.current_context;
    const currentContextObj = contextData.contexts[currentContext];
    return currentContextObj;
  } else {
    return Promise.reject('No active context set');
  }
};

const getActiveContextName = () => {
  let contextData = JSON.parse(readFile('./.fdk/context.json'));
  if (
    contextData.current_context.length > 0 &&
    contextData.contexts[contextData.current_context]
  ) {
    return contextData.current_context;
  } else {
    return Promise.reject('No active context set');
  }
};


const writeContextData = (contextName, newContext, targetDir, upsert=false) => {
  targetDir = targetDir || './.fdk/context.json';
  const contextData = JSON.parse(readFile(targetDir) || '{}');
  if (contextData.contexts && contextData.contexts[contextName] && !upsert) {
    return Promise.reject('Context with the same name already exists');
  }
  _.set(contextData, `contexts.${contextName}`, newContext);
  if (Object.keys(contextData.contexts).length === 1) {
    contextData.current_context = contextName;
  }
  writeFile(targetDir, JSON.stringify(contextData, undefined, 2));
};
const removeContextData = contextName => {
  const contextData = JSON.parse(readFile('./.fdk/context.json'));
  if (Object.keys(contextData.contexts).length > 1) {
    if (
      contextData.contexts[contextName] &&
      contextData.current_context !== contextName
    ) {
      delete contextData.contexts[contextName];
      writeFile(
        './.fdk/context.json',
        JSON.stringify(contextData, undefined, 2)
      );
    } else {
      return Promise.reject(
        'Context does not exists or active context is being deleted'
      );
    }
  } else {
    return Promise.reject('Alteast one context is need');
  }
};
const readCookie = () => {
  const cwd = process.cwd();
  let cookie = '';
  if (fs.existsSync(cwd + '/.fdk/context.json')) {
    const activeContext = getActiveContext();
    cookie = activeContext.cookie;
  } else {
    // cookie = readFile(cwd + '/.fdk/cookie.txt');
  }
  return cookie;
};

const loginUserWithEmail = async (emailId, password, host, verbose) => {
  if (verbose) {
    logger('Login User API Call Initiated', true);
  }
  const response = await loginUser(emailId, password, host, verbose);
  if (verbose) {
    logger('Login User API Call completed', true);
  }
  const cookie = response.headers['set-cookie'][0];
  return cookie;
};

module.exports = {
  generateConfigJSON,
  readCookie,
  loginUserWithEmail,
  getActiveContextName,
  writeContextData,
  removeContextData,
  setContext,
  getActiveContext
};
