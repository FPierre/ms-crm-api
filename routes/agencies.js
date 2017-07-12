const express = require('express')
const cote = require('cote')
const router = express.Router()

const requester = new cote.Requester({ name: 'agency requester', key: 'agency' })
const userRequester = new cote.Requester({ name: 'user requester', key: 'user' })

router.get('', (req, res, next) => {
  const promises = []

  requester.send({ type: 'index' }).then(agencies => {
    for (const agency of agencies) {
      const promise = userRequester.send({ type: 'show', id: agency._responsibleId })
        .then(user => agency['responsible'] = user)
        .catch(err => console.log(err))

      promises.push(promise)
    }

    Promise.all(promises)
      .then(() => res.send(agencies))
      .catch(err => console.log(err))
  })
})

router.get('/show', (req, res, next) => {
  requester.send({ type: 'show', id: req.body.id })
    .then(agency => res.send(agency))
    .catch(err => console.log(err))
})

router.post('/create', (req, res, next) => {
  requester.send({ type: 'create', agency: req.body.agency }, agency => {
    res.send(agency)
  })
})

router.post('/update', (req, res, next) => {
  requester.send({ type: 'update', agency: req.body.agency }, agency => res.send(agency))
})

router.post('/delete', (req, res, next) => {
  requester.send({ type: 'delete', agency: req.body.agency }, agency => res.send(agency))
})

module.exports = router
