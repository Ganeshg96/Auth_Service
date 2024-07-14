const express= require('express');

const UserController = require('../../controllers/user-controller');
const {AuthTRequestValidators} = require('../../middlewares/index');

const router= express.Router();

router.post(
    '/signup',
    AuthTRequestValidators.validateUserAuth,
    UserController.create
);

router.post(
    '/signin',
    AuthTRequestValidators.validateUserAuth,
    UserController.signIn
);

module.exports= router;