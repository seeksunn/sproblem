const mongoose = require('mongoose')
const dbName = 'mongodb://localhost:27017/spdb'
mongoose.connect(dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})