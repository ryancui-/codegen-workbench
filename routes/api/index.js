const router = require('koa-router')();
const gitlab = require('./gitlab');

router.use('/api', gitlab.routes(), gitlab.allowedMethods());

module.exports = router;
