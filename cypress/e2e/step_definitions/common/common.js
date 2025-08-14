import {Given, When, Then, Before} from 'cypress-cucumber-preprocessor/steps';

import Rest from '../../../services/common/_rest_service';

Before(() => {
  cy.wrap({}).as('query')
  cy.wrap({}).as('body')
  cy.wrap({}).as('header')
  cy.wrap(null).as('id_recuperado')
});

Given(`que esteja com um token válido no {string} com o ms {string} e endpoint {string}`, (sistema, ms, endpoint)=>{
    var user = Cypress.env("users")[sistema];
    Rest.get_token(user.email, user.password, sistema, ms, endpoint)
})

Given(`que tenha o id com valor {string} para usar no endpoint no ead`, (valor) => {
  cy.wrap(valor).as('id_recuperado')
});

Given(`que tenha um path adicional {string} usando um id`, (path) => {
  cy.get('@id_recuperado').then((id) => {
    const path_extra = `/${path}/${id}`
    cy.wrap(path_extra).as('path_adicional')
  })
});

Given(`que tenha adicionado a propriedade {string} e o valor {int} no header`, (propriedade_adicional, valor) => {
  cy.get('@header').then((header) => {
    Rest.get_header(propriedade_adicional, valor, header).as('header')
  })
});

Given(`que tenha adicionado a propriedade {string} e o valor {string} no header`, (propriedade_adicional, valor) => {
  cy.get('@header').then((header) => {
    Rest.get_header(propriedade_adicional, valor, header).as('header')
  })
});

Given(`que tenha adicionado a propriedade {string} e o valor {string} em uma query`, (propriedade, valor) => {
  cy.get('@query').then((query) => {
    Rest.get_json(propriedade, valor, query).as('query')
  })
});

Given(`que tenha adicionado a propriedade {string} e o valor {int} em uma query`, (propriedade, valor) => {
  cy.get('@query').then((query) => {
    Rest.get_json(propriedade, valor, query).as('query')
  })
});

Given(`que tenha adicionado a propriedade {string} e o valor {int} em um body`, (propriedade, valor) => {
    cy.get('@body').then((body) => {
        Rest.get_json(propriedade, valor, body).as('body');
    })
});

Given(`que tenha adicionado a propriedade {string} e o valor {string} em um body`, (propriedade, valor) => {
    cy.get('@body').then((body) => {
        Rest.get_json(propriedade, valor, body).as('body');
    })
});

Given(`que tenha feito uma requisição do tipo {string} no ms de {string} no endpoint {string} no {string}`, (verbo, ms, endpoint, sistema) => {
  cy.get('@body').then((body) => {
    cy.get('@query').then((query) => {
      cy.get('@header').then((header) => {
        cy.get('@id_recuperado').then((id) => {
          Rest.obter_resposta(verbo, ms, sistema, endpoint, id, body, header, query).then((res) => {
            cy.wrap(res).as('response_pre_requisito')

            cy.wrap({"verbo": verbo, "ms": ms, "endpoint": endpoint, "sistema": sistema}).as('dados_endpoint');
          })
        })
      })
    })
  })
});

When(`fizer uma requisição do tipo {string} no ms de {string} no endpoint {string} no {string}`, (verbo, ms, endpoint, sistema) => {
  cy.get('@body').then((body) => {
    cy.get('@query').then((query) => {
      cy.get('@header').then((header) => {
        cy.get('@id_recuperado').then((id_recuperado) => {
          cy.log(id_recuperado)
          Rest.obter_resposta(verbo, ms, sistema, endpoint, id_recuperado, body, header, query).as('response');
          
          cy.wrap({"verbo": verbo, "ms": ms, "endpoint": endpoint, "sistema": sistema}).as('dados_endpoint');
        })
      })
    })
  })
});

When(`fizer uma requisição do tipo {string} no ms de {string} no endpoint {string} com path adicional no {string}`, (verbo, ms, endpoint, sistema) => {
  cy.get('@path_adicional').then((path_adicional) => {
    cy.get('@body').then((body) => {
      cy.get('@query').then((query) => {
        cy.get('@header').then((header) => {
          cy.get('@id_recuperado').then((id_recuperado) => {
            Rest.obter_resposta(verbo, ms, sistema, endpoint, id_recuperado, body, header, query, path_adicional).as('response');
            
            cy.wrap({"verbo": verbo, "ms": ms, "endpoint": endpoint, "sistema": sistema, "ie": ie}).as('dados_endpoint');
          })
        })
      })
    })
  })
});

Then(`deve retornar na resposta o status code {int}`, (status_code_esperado) => {
  cy.get('@response').then((res) => {
    Rest.validacao_status_code(res, status_code_esperado);
  });
});

Then(`deve retornar no corpo da resposta uma mensagem de erro`, () => {
  cy.get('@response').then((res) => {
    Rest.validacao_mensagem_erro_existe(res);
  });
});

Then(`deve retornar no corpo da resposta uma mensagem de erro com o texto {string}`, (mensagem_esperada) => {
  cy.get('@response').then((res) => {
    Rest.validacao_texto_mensagem_erro(res, mensagem_esperada);
  });
});

Then(`deve obter como resposta o schema {string} com status {int}`, (schema, status) => {
  cy.get('@response').then((res) => {
    cy.validacao_de_contrato(res, schema, status).then((valid) => {
      expect(valid).to.be.true;
    });
  });
});

Then(`deve obter um tempo de resposta menor que {int} segundos`, (tempo_limite) => {
  cy.get('@response').then((res) => {
    Rest.valida_tempo_resposta(res, tempo_limite);
  });
});

Then(`deve retornar no corpo da resposta o total de {int} registros`, (quantidade = 1) => {
  cy.get('@response').then((res) => {
    Rest.valida_quantidade_registros_no_corpo_da_resposta(res, quantidade);
  });
});

Then(`não deve retornar no corpo da resposta um objeto vazio`, (quantidade = 1) => {
  cy.get('@response').then((res) => {
    Rest.valida_corpo_da_resposta_nao_vazio(res, quantidade);
  });
});

Then(`deve retornar no corpo da resposta um objeto vazio`, () => {
  cy.get('@response').then((res) => {
    Rest.valida_corpo_da_resposta_vazio(res);
  });
});

Then(`não deve retornar no corpo da resposta nenhum registro`, () => {
  cy.get('@response').then((res) => {
    Rest.valida_corpo_da_resposta_vazio(res);
  });
});

Then(`deverá excluir com sucesso o novo cadastro`, () => {
  cy.get('@response').then((res) => {
    cy.get('@dados_endpoint').then((caminho) => {
      Rest.obter_resposta("DELETE", caminho.ms, caminho.sistema, caminho.endpoint, res.body.id).as('response_delete_after');
    });
  });

  cy.get('@response_delete_after').then((res_delete) => {
    Rest.validacao_status_code(res_delete);
  });
});

Then(`deverá excluir com sucesso o novo cadastro através da propriedade {string}`, (propriedade = "id") => {
  cy.get('@response').then((res) => {
    cy.get('@dados_endpoint').then((caminho) => {
      Rest.obter_resposta("DELETE", caminho.ms, caminho.sistema, caminho.endpoint, res.body[propriedade]).as('response_delete_after');
    });
  });

  cy.get('@response_delete_after').then((res_delete) => {
    Rest.validacao_status_code(res_delete);
  });
});
