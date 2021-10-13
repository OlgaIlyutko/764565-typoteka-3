'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const articleValidator = require(`../../middlewares/article-validator`);
const articleExist = require(`../../middlewares/article-exists`);
const commentValidator = require(`../../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const categories = await articleService.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);
    if (article) {
      return res.status(HttpCode.OK)
        .json(articleId);
    } else {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${articleId}`);
    }
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articleService.findOne(articleId);

    if (existArticle) {
      res.status(HttpCode.OK)
        .json(existArticle);
      const updatedArticle = await articleService.update(articleId, req.body);
      return res.status(HttpCode.OK)
        .json(updatedArticle);
    } else {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (article) {
      return res.status(HttpCode.OK)
        .json(article);
    } else {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(article, commentId);

    if (deletedComment) {
      return res.status(HttpCode.OK)
        .json(deletedComment);
    } else {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {offer} = res.locals;
    const comment = await commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

};