const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
    await new Promise((resolve, reject) => {
        subscribers.push(resolve);
    }).then ((res) => {ctx.body=res;} );
});

router.post('/publish', async (ctx, next) => {
    if (!ctx.request.body.message) {
        return next();
    }
    subscribers.forEach(
        resolve => resolve(ctx.request.body.message)
    )
    subscribers = [];
    ctx.status = 201;
    ctx.body="OK";
});

app.use(router.routes());

module.exports = app;
