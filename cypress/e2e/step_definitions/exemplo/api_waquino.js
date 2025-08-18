import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
  cy.wrap({}).as('query');
  cy.wrap({}).as('body');
  cy.wrap({}).as('header');
  cy.wrap(null).as('id_recuperado');
});

Given(`que esteja com um token válido no {string} com o ms {string} e endpoint {string}`, (sistema, ms, endpoint) => {
  cy.getToken();
});

Given(`que tenha adicionado a propriedade {string} e o valor {string} em um body`, (propriedade, valor) => {
  cy.get('@body').then((body) => {
    body[propriedade] = valor;
    cy.wrap(body).as('body');
  });
});

Given(`que tenha feito uma requisição do tipo {string} no ms de {string} no endpoint {string} no {string}`, (verbo, ms, endpoint, sistema) => {
  cy.get('@body').then((body) => {
    cy.apiRequest(verbo, endpoint, { body }).then((res) => {
      cy.wrap(res).as('response_pre_requisito');
      cy.wrap({ verbo, ms, endpoint, sistema }).as('dados_endpoint');
    });
  });
});

When(`fizer uma requisição do tipo {string} no ms de {string} no endpoint {string} no {string}`, (verbo, ms, endpoint, sistema) => {
  cy.get('@body').then((body) => {
    cy.apiRequest(verbo, endpoint, { body }).then((res) => {
      cy.wrap(res).as('response');
      cy.wrap({ verbo, ms, endpoint, sistema }).as('dados_endpoint');
    });
  });
});

Then(`deve retornar na resposta o status code {int}`, (status_code_esperado) => {
  cy.get('@response').then((res) => {
    expect(res.status).to.equal(status_code_esperado);
  });
});

Then(`deve retornar no corpo da resposta uma mensagem de erro`, () => {
  cy.get('@response').then((res) => {
    expect(res.body.error || res.body.message).to.not.be.empty;
  });
});

Then(`deve retornar no corpo da resposta uma mensagem de erro com o texto {string}`, (mensagem_esperada) => {
  cy.get('@response').then((res) => {
    const mensagem = res.body.error ? res.body.error.message : res.body.message;
    expect(mensagem).to.contain(mensagem_esperada);
  });
});