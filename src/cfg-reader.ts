import * as path from 'path';
import { parse } from '@iarna/toml';
import * as fs from 'fs';
import * as _ from 'loadsh';

function loadCfg(): any {
  const projectRoot = process.cwd();
  console.log('projectRoot=' + projectRoot);
  const cfgPath = path.join(projectRoot, 'cfg');
  // 加载主配置
  const mainFilePath = path.join(cfgPath, 'main.toml');
  let mainFileContent;
  try {
    mainFileContent = readFile(mainFilePath);
  } catch (e) {
    throw new Error(`main.toml 文件异常: ${e}`);
  }
  let mainCfg: any;
  try {
    mainCfg = parse(mainFileContent);
  } catch (e) {
    throw new Error(`解析main.toml 文件异常: ${e}`);
  }
  // 加载指定配置
  const specificFilePath = path.join(cfgPath, `${mainCfg.server.use}.toml`);
  let specificFileContent;
  try {
    specificFileContent = readFile(specificFilePath);
  } catch (e) {
    throw new Error(`${mainCfg.server.use}.toml 文件异常: ${e}`);
  }
  let specificCfg: any;
  try {
    specificCfg = parse(specificFileContent);
  } catch (e) {
    throw new Error(`解析${mainCfg.server.use}.toml 文件异常: ${e}`);
  }
  // 合并主配置与指定配置
  return _.merge(mainCfg, specificCfg);
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export default loadCfg();
