# Automação QA

Esta documentação tem como objetivo auxiliar na compreensão da arquitetura do framework de automação.

**Seções:**

 [Automação QA](#automação-qa)
  - [Instalação e Execução do Projeto](#instalação-e-execução-do-projeto)
    - [Instalação NodeJs](#instalação-nodejs)
    - [Instalação Visual Studio Code](#instalação-visual-studio-code)
    - [Execução do Projeto](#execução-do-projeto)
      - [Extensões](#extensões)
  - [Sobre Padrão Page Object ("Serviços")](#sobre-padrão-page-object)
  - [Arquitetura do projeto e framework de automação](#arquitetura-do-projeto-e-framework-de-automação)
   

## Instalação e Execução do Projeto

Para realizar nossa automação, usamos o Cypress que é um framework de automação de testes E2E que usa como base o Javascript para a escrita do seu código. Com ele é possível configurar, escrever, rodar e debuggar os testes de forma simples e prática.

Para utilizar o Cypress, é necessário realizar as seguintes instalações:

- NodeJs (versão LTS)
- Visual Studio Code
- Cypress

### Instalação NodeJs

**1**. Acessar página <https://nodejs.org/en/> e recomenda-se baixar a versão mais estável;
**2**. Após download, abrir o instalador e clicar nos botões de _Next_ até o final e, por último, nos botões de _Install_ e _Finish_.
**Pronto, o NodeJs foi instalado!**

### Instalação Visual Studio Code

**1**. Acessar https://code.visualstudio.com/download e baixar a versão para Windows;

**2**. Após download, abrir o instalador e clicar nos botões de _Next_ até o final e, por último, no botão de _Finish_.
O Visual Studio Code abrirá automaticamente e pronto.
**Instalação concluída!**

### Execução do Projeto

Após as instalações do NodeJs e do VScode, vamos baixar o projeto do git.

**1**. Copiar o link para clonar esse repositório;

**2**. Na pasta de sua preferência, abrir o Prompt de Comando e executar o comando ```git clone + url copiada```;

**3**. Dentro do VScode, abrir a pasta clonada, acessar a raiz do projeto e executar no terminal o comando ```npm install```;

> Isso fará com que, na nossa estrutura de pastas, seja criado um _node_modules_ com várias dependências, incluindo o _cypress_.

**4**. A próxima etapa é executar o comando ```./node_modules/.bin/cypress open```  ou ``` npx cypress open ``` para abrir o Cypress.

**Pronto!** 

#### Extensões

Abaixo seguem alguns plugins que nos auxiliam na nossa automação. São eles:

- JavaScript (ES6) code snippets
- Commit Message Editor - **Formatador de commits**
- Markdown Preview Enhanced - **Visualizador de arquivos .md**
- Prettier - Code formatter - **Formatador de código**
- Material Icon Theme
- Cucumber (Gherkin) Full Support
- Cypress-cucumber-generator
- Snippets and Syntax Highlight for Gherkin (Cucumber)
- Bracket Pair Colorizer 2
- Add Only
- Cypress Snippets
- ES6 Mocha Snippets

## Entendendo o Padrão Page Object (no projeto de API vamos chamar de "Serviços")

O padrão Page Objects é muito utilizado nos projetos de automação de testes como uma forma de organizar melhor nosso código.

Ele serve para separar responsabilidades, ou seja:

- Vamos ter um local onde ficará descrita a **ação** da página que estamos trabalhando.

- E um outro local para os **elementos** dessa página.

## Arquitetura do projeto e framework de automação

- **integration/specs**: Nessa pasta guardaremos nossas specs como features, de acordo com a metodologia BDD.
- **integration/step_definitions**: Nessa pasta guardaremos os métodos steps associados ao BDD.
- **fixtures**: Arquivos de massas a serem usadas na automação, sendo estáticas ou dinâmicas.
- **Services**: Representa abstração de páginas, com métodos e seus elementos.