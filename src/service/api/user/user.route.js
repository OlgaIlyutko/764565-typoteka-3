'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

const validatorDate = require(`../../middlewares/validator-data`);
const registerUserValidator = require(`./validators/user-register.validator`);
const emailExist = require(`./validators/email-exists`);

const passwordUtils = require(`../../lib/password`);

module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, [validatorDate(registerUserValidator), emailExist(userService)], async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await userService.create(data);

    delete result.passwordHash;

    res.status(HttpCode.CREATED)
      .json(result);
  });
};
