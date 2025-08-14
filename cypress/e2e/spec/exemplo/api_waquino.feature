#language: pt

@exemplo
Funcionalidade: [regressão] API - Exemplo WCAquino
    Como cliente da aplicação
    Quero ter acesso a todas as rotas acessíveis para o meu nível de usuário

    Contexto:
        Dado que esteja com um token válido no "exemplo" com o ms "wcaquino" e endpoint 'signin'
        E que tenha feito uma requisição do tipo "GET" no ms de "wcaquino" no endpoint "reset" no "exemplo"

    @api_criar_conta
    Esquema do Cenario: Criar conta para movimentação
        Dado que tenha adicionado a propriedade "nome" e o valor "<nome_conta>" em um body
        Quando fizer uma requisição do tipo "POST" no ms de "wcaquino" no endpoint "contas" no "exemplo"
        Então deve obter como resposta o schema "exemplo/schema/conta_movimentacao/post" com status <status>
        Então deve retornar na resposta o status code <status>
        Exemplos:
            | nome_conta         | status | propriedade | valor                              |
            | Conta qualquer 5   | 201    | nome        | Conta qualquer 5                   |
            | Conta para alterar | 400    | error       | Já existe uma conta com esse nome! |