const { isUuid } = require("uuidv4");

module.exports = (req, res, next) => {
  const { id } = req.params

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID, repository not found' })
  }

  return next()
}