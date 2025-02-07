# Caju - Desafio Técnico
![Desafio Caju](https://i.imgur.com/xxbE0Hj.png)

## Introdução

Este é o desafio técnico para a Caju para a posição de Software Engineer Pleno. O objetivo principal é construir uma API que possibilita criar um autorizador de transações de cartão de crédito. A entrevista inicial foi realizada no dia 5/Fevereiro, sendo o projeto entregue no dia 7/Fevereiro e com prazo de entrega até o dia 12/Fevereiro.

## Como Rodar o Projeto?
![Swagger](https://i.imgur.com/Lz7QkoQ.png)

Inicialmente, é necessário que você tenha o Docker e o Node.js instalados em sua máquina.

**IMPORTANTE:** Após clonar o repositório e acessar a pasta do projeto, você deve criar um arquivo de variáveis de ambiente (.env). Para isso, basta renomear o arquivo de exemplo (.env.example) para .env.

Em seguida, execute os seguintes comandos para instalar as dependências e iniciar o projeto:

```sh
npm install
npx prisma generate
docker compose up -d
```

Depois, execute as migrations do banco de dados com o seguinte comando:

```sh
docker compose run backend npx prisma migrate dev
```

Se desejar ter alguns dados padrão cadastrados no banco de dados (como os MCCs 5411, 5412, etc.) para realizar testes manuais, execute o comando de seed. Ele adicionará automaticamente alguns registros ao banco:

```sh
docker compose run backend npx prisma db seed
```

Agora, você já pode acessar a documentação da API por meio do Swagger em http://localhost:3000/api. Nela, estão detalhados todos os inputs e outputs esperados para cada endpoint desenvolvido.

Para rodar os testes automatizados, basta executar o seguinte comando após iniciar o projeto:

```sh
docker compose run backend npm run test
```

## Decisões Técnicas

- **TypeScript:** O TypeScript foi utilizado por ser a linguagem na qual tenho maior domínio técnico, o que me permitiria desenvolver o projeto com mais agilidade dentro do prazo estipulado. Além disso, o TypeScript foi escolhido em vez do JavaScript por oferecer diversas vantagens, principalmente a tipagem, que possibilita uma melhor manutenção do código.
- **NestJS:** O NestJS foi escolhido como framework web para a aplicação principalmente por fornecer uma estrutura padronizada com boas práticas, como separação clara de responsabilidades, testes, entre outros. Além disso, ele facilita a integração com outras bibliotecas, como Swagger, Jest e Prisma.
- **Outras Bibliotecas:** Também foram utilizadas as bibliotecas Jest para testes, Prisma como ORM, Swagger para documentação da API e ESLint como analisador de código. Todas foram escolhidas com o objetivo de simplificar e facilitar o desenvolvimento, além de melhorar a manutenção a longo prazo.
- **PostgreSQL:** O PostgreSQL foi utilizado por ser um banco de dados relacional, uma vez que precisamos criar relacionamentos entre nossos dados.
- **Docker:** O Docker foi utilizado para facilitar o desenvolvimento, isolar o projeto e permitir um setup mais simples. Dessa forma, por exemplo, não é necessário ter o PostgreSQL instalado na máquina para rodar o projeto.
- **PGWeb:** Interface gráfica para visualizar o banco de dados PostgreSQL, facilitando o desenvolvimento e a inspeção dos dados.

## Design do Banco de Dados Relacional

Ao analisar uma transação, é possível identificar algumas entidades:

- **Transaction:** A própria transação.
- **User:** O usuário, que pode possuir várias contas.
- **Company:** A empresa contratante da Caju.
- **Account:** A conta de um colaborador em uma empresa. Por exemplo, o usuário “Yuri” fez parte de duas empresas da Caju: “Cajuzinho” e “Cajuzão”. Assim, ele terá duas contas, mas será um único usuário.
- **BalanceType:** Os tipos de saldo existentes na Caju (FOOD, MEAL, CASH, etc.).
- **AccountBalance:** O saldo atual da conta para determinado tipo de saldo (FOOD, MEAL, CASH, etc.).
- **MCC:** Representa a relação entre a classificação do estabelecimento e o tipo de saldo que deve ser utilizado. Uma abordagem possível seria armazenar essa relação em uma variável constante (como um objeto/hashmap) dentro do código. No entanto, essa solução não é escalável, pois exigiria alterações no código a cada novo MCC cadastrado.
- **Merchant:** Como citado no desafio L3, é necessário levar em consideração o estabelecimento, além do MCC. Dessa forma, é essencial criar uma tabela de **Merchants**, permitindo definir qual MCC cada estabelecimento atende.

![Modelagem](https://i.imgur.com/NKwvMXl.png)

### Observações

- Como o foco do desafio são as transações, para simplificar o desenvolvimento, adicionei apenas os atributos “fullname” e “cpf” em **User** e “name” e “cnpj” em **Company**. No entanto, em um cenário real, seria necessário incluir mais informações.
- Pesquisando na internet, é possível verificar que um **Merchant** pode ter mais de um **MCC** associado a ele (por exemplo, um posto de combustíveis que também possui uma loja de conveniência). Porém, para simplificar o desenvolvimento, vamos atrelar apenas um MCC padrão a cada **Merchant** (representado pela coluna mccId na tabela **Merchant**). Caso seja necessário permitir vários MCCs para um mesmo **Merchant**, seria preciso criar uma tabela auxiliar **MerchantMCC**, contendo os atributos merchantId e mccId.

### Discussões Técnicas do Design

- O nome do **Merchant** foi definido como um índice para reduzir o tempo de execução de uma query no banco de dados. Caso não fosse indexado, a busca seria linear (O(n)). Com a indexação, reduzimos a busca para uma complexidade logarítmica (O(log n)), o que evita um aumento significativo na latência da requisição ao incluir a verificação do **Merchant** na aplicação. A mesma lógica foi aplicada ao código do **MCC**.
- O nome do **Merchant** foi salvo como **plain text** na tabela **Transaction**, pois nem todos os **Merchants** necessariamente existirão (ou precisarão existir) no banco de dados.
- O código do **MCC** não foi salvo diretamente na **Transaction**. Em vez disso, foi criada uma relação com a linha correspondente na tabela **MCC**, garantindo que apenas códigos válidos existam no banco de dados e evitando transações com MCCs inválidos.
- Optei por criar uma tabela específica para os tipos de saldo. No entanto, outra abordagem seria armazená-los como um **Enum**, já que são dados relativamente estáveis ao longo do tempo. Escolhi a abordagem da tabela para garantir a integridade dos dados. Esse trade-off pode ser analisado sob a perspectiva da [normalização vs. desnormalização de dados](https://medium.com/analytics-vidhya/database-normalization-vs-denormalization-a42d211dd891).
- Criei a tabela auxiliar **AccountBalance** para armazenar separadamente o saldo de cada tipo, permitindo maior flexibilidade para a adição de novos tipos de saldo no futuro. Outra abordagem seria adicionar colunas específicas para cada tipo de saldo na tabela **Account** (ex.: `cashBalance`, `foodBalance`, etc.), o que simplificaria o desenvolvimento e reduziria a complexidade da modelagem do banco, mas tornaria a estrutura menos flexível para mudanças futuras.
- Mantive o padrão **"columnNameId"** para permitir o uso da expressão **USING** no PostgreSQL.

## Endpoints

Todos os endpoints estão documentados no Swagger da aplicação, acessível em [**http://localhost:3000/api#/**](http://localhost:3000/api#/).

O endpoint principal para realizar uma transação é **`[POST] /transactions/`**. No entanto, para facilitar os testes manuais da aplicação, também criei endpoints auxiliares que ajudam na execução e validação do projeto:

- **`[POST] /transactions/`** - Cria uma nova transação (**endpoint principal do projeto**).
- **`[POST] /users/`** - Cria um novo usuário (**auxiliar**).
- **`[POST] /companies/`** - Cria uma nova empresa contratante da Caju (**auxiliar**).
- **`[POST] /balance_types/`** - Cria um novo tipo de saldo (**auxiliar**).
- **`[POST] /mccs/`** - Cria um novo MCC (**auxiliar**).
- **`[POST] /merchants/`** - Cria um novo Merchant (**auxiliar**).
- **`[POST] /accounts/`** - Cria uma nova conta (**auxiliar**).
- **`[POST] /account-balances/`** - Adiciona créditos ao saldo do usuário (**auxiliar**).

Como o foco principal do projeto são as transações, e os demais endpoints servem apenas para auxiliar na execução e nos testes, não foram criados endpoints como **DELETE** ou **PATCH** para **companies**, **users**, etc.

## Discussão do Desafio L4

**Cenário de transações simultâneas diferentes:** Para lidar com transações simultâneas de forma síncrona, é necessário aplicar um **lock** no banco de dados durante a execução da transação. Dessa forma, conseguimos bloquear temporariamente o saldo do usuário, evitando cenários em que duas transações concorrentes sejam processadas simultaneamente e causem inconsistências.

**Cenário de transações iguais (duplicadas):** Para evitar que duas transações idênticas (duplicadas) sejam processadas, podemos verificar no banco de dados se já existe uma transação recente com os mesmos dados (**merchant**, **totalAmount** e **account**) criada nos últimos **60 segundos**. No entanto, essa abordagem pode impactar a performance. Para otimizar o desempenho, podemos utilizar um mecanismo de **caching**.

**Cache:** Como citado anteriormente, a **latência** (que deve ser inferior a **100ms**) é um fator crítico. Uma forma eficiente de verificar transações duplicadas é armazenar as transações realizadas nos últimos **60 segundos** em **cache** (por exemplo, utilizando **Redis**). Após esse período, a transação pode ser expirada. Dessa forma, antes de inserir uma nova transação no banco, verificamos se já existe uma transação recente com os mesmos dados no cache. Se **não existir**, a transação é criada no banco normalmente. Se **existir**, retornamos um código de erro ao usuário, pois uma transação idêntica já foi processada recentemente. O uso de **caching** traz um **trade-off**: aumenta a complexidade e o custo da aplicação, mas reduz significativamente a latência, melhorando a experiência do usuário.

![Desafio L4](https://i.imgur.com/xmvM4Ty.png)

## Pitacos Técnicos

- **Cache:** Poderíamos utilizar **cache** na aplicação (como um banco de dados em memória, por exemplo, **Redis**) para reduzir a latência. Dados como a relação de **MCCs**, informações de **Merchants** mais populares (ex.: **Uber Eats**) e o **saldo atual dos usuários** poderiam ser armazenados em cache. Isso reduziria consideravelmente a latência da aplicação, pois bancos **em memória** são muito mais rápidos do que bancos **em disco** (como o **Postgres**). No entanto, como **trade-off**, a aplicação se tornaria mais complexa, pois seria necessário garantir a **consistência dos dados** entre o Redis e o Postgres (para evitar discrepâncias no saldo do usuário). Além disso, o custo em **cloud** aumentaria devido à adição de um novo componente à arquitetura.
- **Message Queues e Assincronismo:** Atualmente, ao criar um novo tipo de saldo (por exemplo, "Entretenimento"), todas as contas recebem imediatamente esse novo tipo de saldo de forma **síncrona** (criando uma nova linha na tabela **userBalance** com saldo **0**). No entanto, em um **cenário real**, essa operação deveria ser **assíncrona**, pois processar **milhões de contas** em uma única requisição pode levar a **timeouts** e dificultar o reprocessamento de falhas individuais. Assim, eu utilizaria **Message Queues** para processar novos tipos de saldo e implementaria um **Dead Letter Queue (DLQ)** para reprocessar tarefas que falharam.
- **GitHub Actions:** Como trabalhei no projeto sozinho, não houve necessidade de implementar um fluxo de **CI/CD**. No entanto, caso o projeto fosse desenvolvido por mais de uma pessoa e precisasse de um fluxo de **deploy**, eu recomendaria o uso de **GitHub Actions** para validar testes e automatizar o processo de implantação.
- **Logging:** Como o projeto é simples, não foi necessário registrar logs da aplicação. No entanto, em projetos mais complexos, a implementação de logs é essencial para **monitorar erros e bugs**, facilitando a depuração e a manutenção.
- **Retorno da API:** Para erros, utilizaria **códigos HTTP 4xx**, seguindo boas práticas e facilitando o tratamento de erros pelo cliente da API. Além do código, retornaria uma **mensagem em inglês** explicando o motivo do erro, o que ajudaria os desenvolvedores que consumirem a API a entenderem a causa do problema.
- **Finalização e Soft Delete:** Como o foco do projeto foi a funcionalidade de **transactions**, não implementei rotas **PATCH** e **DELETE** para outras entidades. Caso a aplicação fosse expandida, utilizaria **soft delete** com colunas **updated_at** e **deleted_at** para rastrear alterações e remoções. Além disso, implementaria **paginação** para otimizar consultas.
