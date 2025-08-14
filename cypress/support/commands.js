// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    if(options.length === 1){
        if(Cypress.env('token')){
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}`
            }
        }
    }

    return originalFn(...options)
})

Cypress.Commands.add('step_not_implemented', () => { 
    console.log('O step não foi implementado!')
    cy.log('O step não foi implementado!')
})

import Ajv from 'ajv'

//strict true dando erro...
const ajv = new Ajv();

Cypress.Commands.add('validacao_de_contrato', (resposta, schema, status) => {
    cy.fixture(`${schema}/${status}.json`).then( schema => {
        //schema que será usado para validação
        const validate = ajv.compile(schema)
        console.log(validate)

        const valid = validate(resposta.body)
        //caso tenha dado algum erro
        if(!valid){
            var errors = ''
            
            //tentativa com of mas é usado o in
            for(let each in validate.errors){
                let err = validate.errors[each]

                //instancePath = em qual linha da resposta que obtive está o erro
                //err.message = o que era pra ter recebido (string, int, boolean, etc)
                //err.data = o tipo de dado que eu recebi
                errors += `\n${err.instancePath} ${err.message}, but receive ${typeof err.data}`
            }

            throw new Error('Contract validation error, please verify!' + errors)
            Cypress.runner.stop()
        }

        //caso tenha dado tudo certo
        return true;
    })
});