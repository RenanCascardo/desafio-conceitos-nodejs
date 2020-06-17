const express = require("express");

const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

// Armazena os repositórios criados.
const repositories = [];

// Lista todos os repositórios criados.
app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

// Cria um novo repositório.
app.post("/repositories", (request, response) => {
  
  // Recebe o request body informado na requisição.
  const { title, url, techs } = request.body;

  // Armazena o repositório a ser criado.
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  // Adiciona o repositório criado no array principal.
  repositories.push(repository);

  return response.json(repository);

});

// Atualiza o repositório de acordo com o ID informado.
app.put("/repositories/:id", (request, response) => {

  // Recebe os routes params informados na requisição.
  const { id } = request.params;

  // Recebe o request body informado na requisição.
  const { url, title, techs } = request.body;

  // Armazena o índice repositório a ser atualizado.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Verifica se o repositório informado existe.
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
}

// Armazena a quantidade de likes atual.
const repositoryLikes = repositories[repositoryIndex]['likes'];

// Armazena as informações novas do repositório.
const repository = {
    id,
    url,
    title,
    techs,
    likes: repositoryLikes,
    
};

// Altera a informação do repositório de acordo com o indice localizado.
repositories[repositoryIndex] = repository;

return response.json(repository);

});

// Deleta um repositório de acordo com o ID informado.
app.delete("/repositories/:id", (request, response) => {
  
  // Recebe os routes params informados na requisição.
  const { id } = request.params;

  // Armazena o índice do repositório a ser excluído.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Verifica se o repositório informado existe.
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'})
  }

  // Remove o repositório do array principal.
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

// Incrementa o número de likes de um repositório de acordo com o ID informado.
app.post("/repositories/:id/like", (request, response) => {
  
  // Recebe os routes params informados na requisição.
  const { id } = request.params;

  // Armazena o índice repositório a ser atualizado.
  const repository = repositories.find(repository => repository.id === id);

  // Verifica se o repositório informado existe.
  if(!repository) {
    return response.status(400).send();
  }

  // Altera a quantidade de likes.
  repository.likes += 1;

  return response.json(repository);


});

module.exports = app;
