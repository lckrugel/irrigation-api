# Irrigation API

Este repositório contém uma API desenvolvida para o desafio técnico da Irriga Global.

Desenvolvido por [Leonardo Krügel](https://www.linkedin.com/in/leonardo-krugel/).

## Informações

- Projeto utiliza como base o preset **slim** do [Adonisjs 6](https://adonisjs.com/)
- Autenticação via JWT foi desenvolvida de forma **manual**, utilizando a biblioteca [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) para emitir os tokens
- Projeto foi desenvolvido procurando seguir os princípios **SOLID**, dentro do que faz sentido para a complexidade do projeto
- Todos os dados são **armazenados em memória** apenas e, portanto, são perdidos quando a aplicação é reiniciada
- Foram desenvolvidos **testes funcionais** para os endpoints da aplicação
- Foi utilizado o [Zod](https://zod.dev/) como biblioteca de validação de dados
- O projeto busca seguir as melhores práticas de progamação usando **Typescript**

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

Para executar o projeto em modo de desenvolvimento use:

```sh
npm run dev
```

A partir daí o projeto estará em execução em `http://localhost:3333/` ou em outra porta que tenha sido configurada.

### Executando testes

Para executar os testes desenvolvidos utilize o comando:

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

## Em produção

O projeto pode ser executado em modo de produção dentro de um container usando docker e docker-compose.

### Configurando o ambiente

Primeiramente, precisamos criar as configuração em um `.env.production`. Pra isso execute:

```sh
cp .env.production.example .env.production
```

Ou simplesmente copie o conteúdo do arquivo `env.production.example` dentro de um arquivo chamado `.env.production` na raíz do projeto.

Crie uma chave para a aplicação usando:

```sh
node ace generate:key --show
```

Copie a chave do terminal e cole no campo `APP_KEY` no `env.production`

### Executando o docker-compose

Execute o projeto com o comando:

```sh
docker compose up
```

Então o projeto será instalado e iniciará em modo de produção. A partir daí o projeto estará acessível em `http://127.0.0.1:3333` ou onde você tiver configurado.
