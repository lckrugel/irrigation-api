# Irrigation API

Este repositório contém uma API desenvolvida para o desafio técnico da Irriga Global.

Desenvolvido por [Leonardo Krügel](https://www.linkedin.com/in/leonardo-krugel/).

## Informações

- Projeto utiliza como base o preset **slim** do [Adonisjs 6](https://adonisjs.com/)
- Autenticação via JWT foi desenvolvida de forma manual, utilizando a biblioteca [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) para emitir os tokens
- Projeto foi desenvolvido procurando seguir os princípios **SOLID**, dentro do que faz sentido para a complexidade do projeto
- Todos os dados são armazenados em memória apenas e, portanto, são perdidos quando a aplicação é reiniciada
- Foram desenvolvidos testes funcionais para os endpoints da aplicação
- Foi utilizado o [Zod](https://zod.dev/) como biblioteca de validação de dados
- O projeto busca seguir as melhores práticas de progamação usando Typescript

## Requisitos

- Node: `v22`

## Instalação

Instale o projeto usando npm:

```sh
npm install
```

## Configuração

Configurando o `.env`, execute o comando:

```sh
cp .env.example .env
```

Ou copie manualmente o conteúdo do `.env.example` e cole num arquivo chamado `.env` na raíz do projeto.

Após isso, gere a chave da aplicação com:

```sh
node ace generate:key
```

## Execução

Para executar o projeto em mode de desenvolvimento use:

```sh
npm run dev
```

### Executando testes

Para executar os tests desenvolvidos utilize o comando:

```sh
npm run test
```

### Fazendo requisições com `curl`

Deixei alguns scripts bash com comandos pré-prontos para executar requisições aos endpoints da API.

Para executá-los garanta que esteja em um ambiente bash e execute os comandos conforme o exemplo:

```sh
./curl-commands/register.sh
```

Alguns endpoints vão exigir que sejam alteradas variáveis dentro dos scripts.

Estas variáveis são: `USER_TOKEN` - JWT do usuário autenticado, `PIVOT_ID` - UUID do pivô e `IRRIGATION_ID` - UUID da irrigação.
