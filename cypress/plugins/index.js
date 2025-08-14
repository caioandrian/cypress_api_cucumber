/// <reference types="cypress" />

// Importa o preprocessor do cypress-cucumber
const cucumber = require('cypress-cucumber-preprocessor').default
// Importa hooks do cypress-mochawesome-reporter
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
// Importa exec para executar comandos shell
const exec = require('child_process').execSync;

// Importa módulos fs-extra e path
const fs = require('fs-extra');
const path = require('path');

// Função para obter configuração por arquivo
function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve(
    './cypress/config-files',
    `${file}.json`
  );

  return fs.readJson(pathToConfigFile);
}

// Exporta a configuração do plugin
module.exports = (on, config) => {
  // Configura o preprocessor para cucumber
  on('file:preprocessor', cucumber())
  // Configurações específicas para o navegador
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // Adiciona argumento para desativar uso de /dev/shm
      launchOptions.args.push('--disable-dev-shm-usage')
    }

    if (browser.name == 'chrome') {
      // Adiciona argumento para desativar GPU
      launchOptions.args.push('--disable-gpu')
    }

    return launchOptions
  })

  // Hook antes da execução
  on('before:run', async (details) => {
    await beforeRunHook(details);
    await exec("node ./cypress/support/clear.js")
  });

  // Hook após a execução
  on('after:run', async (results) => {
    if (results) {
      await fs.mkdirSync("cypress/run", { recursive: true });
      await fs.writeFile("cypress/run/results.json", JSON.stringify(results));
    }

    await exec("node ./cypress/support/reporter.js")
    await exec("npx jrm ./cypress/reports/junitreport.xml ./cypress/reports/junit/*.xml");
    await afterRunHook();
  });

  // Retorna configuração baseada no arquivo
  const file = config.env.fileConfig || 'hmg';
  return getConfigurationByFile(file);
}