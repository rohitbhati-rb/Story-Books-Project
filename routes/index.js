const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

// @description Login/Landing Page
// @route GET /
router.get('/', (req, res) => {
    let isLoggedIn = false
    let displayName = false
    if (req.isAuthenticated()) {
        isLoggedIn = true
        displayName = req.user.displayName
    }
    res.render('login', {
        isLoggedIn,
        displayName,
        layout: 'login'
    })
})

// @description Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    // console.log(req.user)
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router