export default class Rest{

    //Para teste local você pode mudar o método do cypress usando o plugin cy.api()
  
    static http_request_with_body(method, endpoint, body, headers = {}, qs = {}, failOnStatusCode = false, timeout = 40000){
      return cy.request({
        method: method,
        url: endpoint,
        body: body,
        headers: headers,
        failOnStatusCode: failOnStatusCode,
        timeout: timeout,
        qs : qs
      });
    }
  
    static http_request_without_body(method, endpoint, headers = {}, qs = {}, failOnStatusCode = false, timeout = 40000){
      return cy.request({
        method: method,
        url: endpoint,
        headers : headers,
        failOnStatusCode: failOnStatusCode,
        timeout: timeout,
        qs : qs
      });
    }

    static get_token(user, passwd, sistema, ms, endpoint){
      let body = {email: user, redirecionar: false, senha: passwd}

      const caminho = this.get_valor_base_ms(sistema, ms)

      this.http_request_with_body('POST',  caminho + '/' + endpoint, body)
          .its('body.token')
          .should('not.be.empty')
          .then(token => {
              Cypress.env('token', token)
              cy.log("token env" + Cypress.env('token'))
          })
  }
  
    static verificar_versao_endpoint(base, endpoint){
      if(endpoint.includes("v2") || endpoint.includes("v3")) base = base.replace("/v1", "");
      return base;
    }
  
    static enviar_requisicao(verbo, endpoint, body = {}, header = {}, query = {}){
      if(verbo != "GET" && verbo != "DELETE")
        return this.http_request_with_body(verbo, endpoint, body, header);
          
      return this.http_request_without_body(verbo, endpoint, header, query);
    }
  
    static get_valor_base_ms(sistema, ms) {
      const minhaVariavel = Cypress.env(sistema);
      const valorPropriedade = minhaVariavel[ms];
      return valorPropriedade;
    }
  
    static get_quantidade_registros(ms, sistema, endpoint, header, propriedade = undefined){
      const base = this.get_valor_base_ms(sistema, ms);
  
      return this.http_request_without_body('GET', base + "/" + endpoint, header)
        .then(async (res) => {
          if(!propriedade){
            return res.body.length;
          }else{
            return res.body[propriedade].length;
          }
        });
    }
  
    static get_header(propriedade_adicional, valor, json){
      if(Object.keys(json).length === 0)
        json = this.header();
  
      json[propriedade_adicional] = valor;
      return cy.wrap(json);
    }
  
    static get_json(propriedade, valor, query = null){
      query[propriedade] = valor;
      return cy.wrap(query);
    }
  
    static filtrar_array_por_valor_igual(array, propriedade, valor){
      return array.body.filter(function(objeto) {
        return objeto[propriedade] === valor;
      });
    }
  
    static filtrar_array_por_valor_diferente_de(array, propriedade, valor){
      return array.body.filter(function(objeto) {
        return objeto[propriedade] !== valor;
      });
    }
  
    static obter_resposta(verbo = "GET", ms, sistema, endpoint, id = null, body = {}, header = {}, query ={}, path_adicional = ""){
      cy.log("id recuperado: " + id)
  
      let base = this.get_valor_base_ms(sistema, ms);
      
      if(id == null)
        var caminho = base + "/" + endpoint + path_adicional;
      else
        var caminho = base + "/" + endpoint + "/" + id + path_adicional;
  
        if(Object.keys(header).length === 0 && header.constructor === Object){
            return this.enviar_requisicao(verbo, caminho, body, this.header(), query);
        }else{
            return this.enviar_requisicao(verbo, caminho, body, header, query);
        }
    }
  
    static validacao_status_code(res, status_code_esperado = 200) {
      expect(res.status).to.equal(status_code_esperado);
    }
  
    static validacao_mensagem_erro_existe(res){
      if(res.body.hasOwnProperty('message')){
        expect(res.body.message).to.be.not.empty;
      }else{
        expect(res.body.error).to.have.deep.property('message').and.not.empty;
      }
    }
  
    static validacao_texto_mensagem_erro(res, mensagem_esperada = ""){
      if(res.body.hasOwnProperty('message')){
        expect(res.body.message).to.contain(mensagem_esperada);
      }else{
        expect(res.body.error).to.have.deep.property('message', mensagem_esperada);
      }
    }
  
    static valida_tempo_resposta(res, limite = 5000){
      limite = limite * 1000;
      expect(res.duration).to.be.lte(limite); 
    }
  
    static header(){
        if(Cypress.env('token')){
            const header = {
                Authorization: `JWT ${Cypress.env('token')}`
            }

            return header;
        }

      return {};
    }
  
    static valida_corpo_da_resposta_vazio(res){
      expect(res.body).to.be.empty;
    }
  
    static valida_corpo_da_resposta_nao_vazio(res){
      expect(res.body).to.be.not.empty;
    }
  
    static valida_valor_propriedade_no_corpo_da_resposta(res, propriedade, valor = null){
      if (Array.isArray(res.body) && res.body.length > 0 && typeof res.body[0] === 'object') 
        var body = res.body[0][propriedade];
      else
        var body = res.body[propriedade];
  
      expect(body).to.be.eq(valor);
    }
  
    static valida_array_propriedade_no_corpo_da_resposta(res, propriedade, valor = null){
      if (Array.isArray(res.body) && res.body.length > 0 && typeof res.body[0] === 'object'){
        expect(res.body.map((e)=>e[propriedade])).to.include(valor);
      } 
      else{
        if(this.valida_corpo_da_resposta_nao_vazio()){
          expect(res.body[propriedade]).to.be.eq(valor);
        }
      }
    }
  
    static valida_quantidade_registros_no_corpo_da_resposta(res, quantidade, propriedade = undefined){
      cy.log(quantidade);
      if(!propriedade)
        expect(res.body).to.have.length(quantidade);
      else{
        expect(res.body[propriedade]).to.have.length(quantidade);
      }
    }
  
    static valida_propriedade_nao_vazia_no_corpo_da_resposta(res, propriedade = undefined){
      expect(res.body[propriedade]).to.be.not.empty;
    }
  
    static valida_corpo_da_resposta_array(res){
      expect(res.body).to.be.an('array');
    }
  
    static valida_propriedade_booleano_no_corpo_da_resposta(res, propriedade, valor = null){
      if (Array.isArray(res.body) && res.body.length > 0 && typeof res.body[0] === 'object') 
        var body = res.body[0][propriedade];
      else
        var body = res.body[propriedade];
  
      expect(body).to.be.an('boolean');
          
      if(valor != null){
        var boolean = (valor === 'true');
        expect(body).to.be.eq(boolean);
      }  
    }
  
    static valida_quantidade_caracteres_propriedade_corpo_da_resposta(res, propriedade, qtde){
      if (Array.isArray(res.body) && res.body.length > 0 && typeof res.body[0] === 'object'){
        res.body.forEach((e) => {
          if (e[propriedade].length != "") {
            const numeroString = e[propriedade].toString();
            expect(numeroString).to.have.length(qtde);
          }
        });
      }
      else{
        const numeroString = res.body[propriedade].toString();
        expect(numeroString).to.have.length(qtde);
      }
    }
  
  }