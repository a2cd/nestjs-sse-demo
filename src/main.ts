// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
import { parse } from '@iarna/toml';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  loadCfg();
  // const app = await NestFactory.create(AppModule);
  // app.enableCors(); // 允许跨域
  // await app.listen(3000);
}

bootstrap();

function loadCfg() {
  const projectRoot = process.cwd();
  console.log('projectRoot=' + projectRoot);
  // 加载主配置
  const mainFileContent =
  const mainCfg: any = parse(mainFileContent);
  // 加载指定配置
  const specificFileContent = fs.readFileSync(
    path.join(projectRoot, 'cfg', `${mainCfg.server.use}.toml`),
    'utf8',
  );
  console.log(specificFileContent);
}

function readFile(filePath: string):string {
  return fs.readFileSync(
    filePath
    ,
    'utf8',
  );
}
