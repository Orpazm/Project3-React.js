const express = require('express')
const app = express()

require('./db')
require ('dotenv').config()
const port = process.env.PORT || 1000

//middleweres
app.use(require('cors')())
app.use(express.json())
app.use('/auth', require('./routes/auth'))
app.use('/vacations', require('./routes/vacations'))
app.use('/reports', require('./routes/reports'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})









