// ***********************************************
// Custom commands for API testing
// ***********************************************

Cypress.Commands.add('getToken', () => {
  cy.request({
    method: 'POST',
    url: 'https://barrigarest.wcaquino.me/signin',
    body: {
      email: 'caio@caio',
      senha: '123'
    },
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.eq(200);
    expect(response.body.token).to.not.be.empty;
    Cypress.env('token', response.body.token);
  });
});

Cypress.Commands.add('resetRest', () => {
  cy.request({
    method: 'GET',
    url: 'https://barrigarest.wcaquino.me/reset',
    headers: {
      Authorization: `JWT ${Cypress.env('token')}`
    },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('apiRequest', (method, endpoint, options = {}) => {
  const defaults = {
    method,
    url: `https://barrigarest.wcaquino.me/${endpoint}`,
    headers: {
      Authorization: `JWT ${Cypress.env('token')}`
    },
    failOnStatusCode: false
  };

  return cy.request({ ...defaults, ...options });
});