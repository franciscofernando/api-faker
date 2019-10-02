const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const koaRouter = require('koa-router');
const app = new Koa();
const router = new koaRouter();

const port = Number(process.argv.slice(2));

if (!port) {
 throw `Port argument not found or not a number.`;
}

const mocksPath = path.resolve(__dirname, 'mocks');

fs.readdirSync(mocksPath).forEach((fileName) => {
	if ( /\.json$/.test(fileName) ) {
		const config = require(path.resolve(mocksPath, fileName));

		console.log(`Mocks of "${fileName}" loaded!`);

		Object.keys(config).forEach((endpoint) => {
			const endpointConfig = config[endpoint];

			Object.keys(endpointConfig).forEach((methodName) => {
				const methodConfig = endpointConfig[methodName];

				router[methodName](endpoint, (ctx) => {
					console.log(`${endpoint}[${methodName}] mocked!`);
					ctx.response.body = methodConfig.response.body;
					ctx.response.status = methodConfig.response.status || 200;
					ctx.response.headers = methodConfig.response.headers || ctx.response.headers;
				});
				
			});
		});
	}
});

app.use(router.routes());
module.exports = app.listen(port);

console.log(`Mock server is running on port ${port}!`);