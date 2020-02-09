const express = require('express');

var requests = 0;
const projects = [];

const server = express();

server.use(express.json());

server.use(countRequests);

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/projects', (req, res) => {
  const project = req.body;
  projects.push(project);
  return res.json(projects)
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects[id].title = title;
  return res.json(projects[id]);
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  projects.slice(id, 1);
  return res.json();
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const taskTitle = req.body.title;
  projects[id].tasks.push(taskTitle);
  return res.json(projects[id]);
})

server.listen(3000);

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  if (!projects[id]){
    return res.status(400).json({"error" : "Project not found."});
  }

  return next();
}

function countRequests(req, res, next) {
  requests++;
  console.log(`Total requests: ${requests}`)
  return next();
}