import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'
// import { utilService } from './services/util.service.js'

const app = express()
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',

        'http://127.0.0.1:5173',
        'http://localhost:5173',

        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],
    credentials: true
}
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))

// Express Routing:

app.get('/api/toy', (req, res) => {
    const { filterBy = {} } = req.query
    toyService.query(filterBy)
        .then(toys => {
            res.send(toys)
        })
        .catch(err => {
            loggerService.error('Cannot load toys', err)
            res.status(400).send('Cannot load toys')
        })
})

app.put('/api/toy/:id', (req, res) => {
    const { txt, price, _id, label } = req.body
    const toy = {
        txt,
        price: +price,
        _id,
        label
    }
    toyService.save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot update toy', err)
            res.status(400).send('Cannot update toy')
        })
})

app.post('/api/toy/', (req, res) => {
    const { txt, price, label } = req.body
    const toy = {
        txt,
        price: +price,
        label
    }
    console.log('Received new toy data:', toy)
    toyService.save(toy)
        .then(savedToy => {
            console.log('Toy saved:', savedToy)
            res.send(savedToy)
        })
        .catch(err => {
            console.log('Error saving toy:', err)
            loggerService.error('Cannot add toy', err)
            res.status(400).send('Cannot add toy')
        })
})

app.get('/api/toy/:id', (req, res) => {
    const { toyId } = req.params
    toyService.get(toyId)
        .then(toy => {
            res.send(toy)
        })
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send(err)
        })
})

app.delete('/api/toy/:id', (req, res) => {
    const { id: toyId } = req.params
    toyService.remove(toyId)
        .then(msg => {
            console.log('Toy deleted:', msg)
            res.send({ msg, toyId })
        })
        .catch(err => {
            console.log('Error deleting toy:', err)
            loggerService.error('Cannot delete toy', err)
            res.status(400).send('Cannot delete toy, ' + err)
        })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = 3030
app.listen(PORT, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
})
