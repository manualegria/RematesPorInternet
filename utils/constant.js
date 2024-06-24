const getDateDetails = () => new Date()

const removeSpace = (body) => {
  for (const key in body) {
    if (typeof body[key] === 'string') body[key] = body[key].trim()
  }
}

module.exports = { getDateDetails, removeSpace }
