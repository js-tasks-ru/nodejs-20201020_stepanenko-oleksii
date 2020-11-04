const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

app.use (async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        ctx.status = 500;
        ctx.body=err.message;
    }

})

const Router = require('koa-router');
const router = new Router();
let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
    ctx.body=await new Promise((sendNewMessage) => {
        subscribers.push(sendNewMessage);
    });
});

router.post('/publish', async (ctx, next) => {
    if (!ctx.request.body.message) {
        ctx.throw(400, 'message is required');
    }
    subscribers.forEach(
        sendNewMessage => sendNewMessage(ctx.request.body.message)
    )
    subscribers = [];
    ctx.status = 201;
    ctx.body="OK";
});

app.use(router.routes());

module.exports = app;
