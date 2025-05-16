"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const duration_interceptor_1 = require("./interceptors/duration.interceptor");
const dotenv = require("dotenv");
const config_1 = require("@nestjs/config");
const bodyParser = require("body-parser");
const path_1 = require("path");
const redis_io_adapter_1 = require("./socket/redis-io.adapter");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    if (configService.get("NODE_ENV") == "production") {
        const redisIoAdapter = new redis_io_adapter_1.RedisIoAdapter(app);
        await redisIoAdapter.connectToRedis();
        app.useWebSocketAdapter(redisIoAdapter);
    }
    app.enableCors();
    app.setBaseViewsDir((0, path_1.join)(__dirname, 'views'));
    app.setViewEngine('hbs');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new duration_interceptor_1.DurationInterceptor());
    await app.listen(configService.get("APP_PORT", "0.0.0.0"));
}
bootstrap();
//# sourceMappingURL=main.js.map