/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/test'
})
const controllers = require('../controllers')

// --- ---------------------------- //

router.post('/generate', controllers.generate.post)
router.get('/generate', controllers.generate.get)

module.exports = router
