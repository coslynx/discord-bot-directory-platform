const express = require('express');
const router = express.Router();
const passport = require('passport');
const { userService } = require('../services');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const user = await userService.findUserById(req.user.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/profile', passport.authenticate('jwt', { session: false }), upload.single('profileImage'), async (req, res, next) => {
    try {
        const updatedUser = await userService.updateProfile(req.user.id, req.body, req.file);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});


router.post('/register', async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userService.findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await userService.comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
```