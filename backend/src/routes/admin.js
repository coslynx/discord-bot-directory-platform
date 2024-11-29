const express = require('express');
const router = express.Router();
const passport = require('passport');
const { adminService } = require('../services');


router.get('/dashboard', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const dashboardData = await adminService.getDashboardData();
        res.json(dashboardData);
    } catch (error) {
        next(error);
    }
});

router.get('/bots', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { searchQuery, status } = req.query;
        const bots = await adminService.getBots(searchQuery, status);
        res.json(bots);
    } catch (error) {
        next(error);
    }
});

router.get('/bots/:botId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const bot = await adminService.getBot(req.params.botId);
        res.json(bot);
    } catch (error) {
        next(error);
    }
});


router.put('/bots/:botId/approve', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const updatedBot = await adminService.approveBot(req.params.botId);
        res.json(updatedBot);
    } catch (error) {
        next(error);
    }
});

router.put('/bots/:botId/reject', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const updatedBot = await adminService.rejectBot(req.params.botId);
        res.json(updatedBot);
    } catch (error) {
        next(error);
    }
});

router.put('/bots/:botId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const updatedBot = await adminService.updateBot(req.params.botId, req.body);
        res.json(updatedBot);
    } catch (error) {
        next(error);
    }
});

router.delete('/bots/:botId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        await adminService.deleteBot(req.params.botId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

router.get('/users', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { searchQuery, role } = req.query;
        const users = await adminService.getUsers(searchQuery, role);
        res.json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const user = await adminService.getUser(req.params.userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const updatedUser = await adminService.updateUser(req.params.userId, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

router.delete('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        await adminService.deleteUser(req.params.userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});


module.exports = router;
```