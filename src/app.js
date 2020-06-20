const express = require("express")
const cors = require("cors")

const { uuid } = require("uuidv4")

const app = express()

const idAuthMiddleware = require('./app/middlewares/idAuth')

app.use(express.json())
app.use(cors())

app.use('/repositories/:id', idAuthMiddleware)

const repositories = []

app.get("/repositories", (request, response) => {
  try {
    const { title } = request.query

    const results = title
      ? repositories.filter(repo => repositories.title.includes(title))
      : repositories

    return response.json(results)
  } catch (error) {
    response.status(400).send({ error: 'Error while loading repositories' })
  }
})

app.post("/repositories", (request, response) => {
  try {
    const { title, url, techs } = request.body

    const repo = { id: uuid(), title, url, techs, likes: 0 }

    repositories.push(repo)

    return response.json(repo)
  } catch (error) {
    response.status(400).send({ error: 'Error while creating a new repository' })
  }

})

app.put("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params
    const { title, url, techs } = request.body

    const repoIndex = repositories.findIndex(repo => repo.id === id)

    if (repoIndex < 0) {
      return response.status(400).send({ error: 'Repository not found.' })
    }

    var firstRepo = repositories[repoIndex]

    const likes = firstRepo.likes

    const repo = {
      id,
      title,
      url,
      techs,
      likes
    }

    firstRepo = repo

    return response.json(repo)

  } catch (error) {
    response.status(400).send({ error: 'Error while updating the repository' })
  }
})

app.delete("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params

    const repoIndex = repositories.findIndex(repo => repo.id === id)

    if (repoIndex < 0) {
      return response.status(400).send({ error: 'Repository not found.' })
    }

    repositories.splice(repoIndex, 1)

    return response.status(204).send()
  } catch (error) {
    response.status(400).send({ error: 'Error while deleting the repository' })
  }
})

app.post("/repositories/:id/like", (request, response) => {
  try {
    const { id } = request.params

    const repoIndex = repositories.findIndex(repo => repo.id === id)

    if (repoIndex < 0) {
      return response.status(400).send({ error: 'Repository not found.' })
    }

    repositories[repoIndex].likes += 1

    return response.json(repositories[repoIndex])
  } catch (error) {
    response.status(400).send({ error: 'Error while adding a like to the repository' })
  }
})

module.exports = app
