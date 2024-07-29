import { utilService } from './util.service.js'
import fs from 'fs'
// import { storageService } from './async-storage.service.js'

// _createToys()

export const toyService = {
    query,
    get,
    remove,
    save,
    getToy,
    getDefaultFilter,

}
const toys = utilService.readJsonFile('data/toy.json')
// For Debug (easy access from console):
// window.cs = toyService

function query(filterBy = {}) {
    let filteredToys = toys
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredToys = filteredToys.filter(toy => regExp.test(toy.txt))
    }
    if (filterBy.inStock !== '') {
        filteredToys = filteredToys.filter(toy => {
            if (filterBy.inStock === 'true') return toy.inStock === true
            if (filterBy.inStock === 'false') return toy.inStock === false
            return true
        })
    }
    return Promise.resolve(filteredToys)
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('Toy not found')
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')
    const removedToy = toys.splice(idx, 1)
    console.log('Removed toy:', removedToy)
    return _saveToysToFile().then(() => `Toy ${toyId} deleted successfully`)
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(t => t._id === toy._id);
        if (idx === -1) return Promise.reject('Toy not found')
        toys[idx] = { ...toys[idx], ...toy, updatedAt: Date.now() }
        console.log('Updated toy:', toys[idx])
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = toy.updatedAt = Date.now()
        toy.txt = utilService.makeLorem(1)
        toy.price = utilService.getRandomIntInclusive(5, 80)
        toy.inStock = toy.inStock ? true : false
        toy.label = utilService.getRandomLabel()
        toys.push(toy)
        console.log('Created new toy:', toy)
    }
    return _saveToysToFile().then(() => toy)
}

function getToy() {
    return { txt: '', price: '', inStock: '', label: '' }
}

function getDefaultFilter() {
    return { txt: '', price: '', inStock: ''}
}

function _createToys() {
    let toys = utilService.loadFromStorage(TOY_KEY)
    if (!toys || !toys.length) {
        toys = []
        const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']
        for (var i = 0; i < 20; i++) {
            // toys.push(_createToy())
            toys.push(_createToy(null, null, Math.random() > 0.5))
        }
        // for (let i = 0; i < 20; i++) {
        //     const toy = toys[utilService.getRandomIntInclusive(0, txts.length - 1)]
        //     toys.push(_createToy(toy + (i + 1), utilService.getRandomIntInclusive(1, 10)))
        // }
        utilService.saveToStorage(TOY_KEY, toys)
    }
}

function _createToy(txt, price, inStock) {
    const toy = getToy(txt, price, inStock)
    toy.txt = utilService.makeLorem(1)
    toy.price = utilService.getRandomIntInclusive(5, 80)
    toy.inStock = inStock ? true : false
    toy._id = utilService.makeId()
    toy.createdAt = toy.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
    toy.label = utilService.getRandomLabel()
    return toy
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, err => {
            if (err) {
                return console.log(err)
            }
            console.log('Toys saved to file')
            resolve()
        })
    })
}
// const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
//     'Outdoor', 'Battery Powered']
// const toy = {
//     _id: 't101',
//     name: 'Talking Doll',
//     price: 123,
//     labels: ['Doll', 'Battery Powered', 'Baby'],
//     createdAt: 1631031801011,
//     inStock: true,
// }
