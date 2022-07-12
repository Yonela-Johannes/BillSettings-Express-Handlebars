const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const SettingBill = require('./BillFactoryFunction/settings-bill')

const settingsBill = SettingBill()

console.log("Instance", settingsBill.getSettings())

const handlebars = require('express-handlebars')
app.set('view engine', 'hbs')


app.engine('hbs', handlebars.engine({
    layoutsDir: `${__dirname}/views/layouts`,
    extname: 'hbs',
    defaultLayout: 'main',
}))

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals()
    })
    console.log(settingsBill.getSettings())
})

app.post('/settings', (req, res) => {
    console.log(req.body)
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
    res.redirect('/')
})

app.post('/action', (req, res) => {
    console.log(req.body.actionType)
    settingsBill.recordAction(req.body.actionType)
    const totals = settingsBill.totals()
    res.redirect('/')
})

app.get('/actions', (req, res) => {
    res.render('actions', {
        actions: settingsBill.actions
    })
})

app.get('/actions/:actionType', (req, res) => {
    const actionType = req.params.actionType;
    res.render('actions', {
        actions: settingsBill.actionsFor(actionType)
    })
})


app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})