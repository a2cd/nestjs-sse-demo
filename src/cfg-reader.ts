import * as path from 'path';
import { parse } from '@iarna/toml';
import * as fs from 'fs';
import * as _ from 'loadsh';

function loadCfg(): any {
  const projectRoot = process.cwd();
  console.log('projectRoot=' + projectRoot);
  // 加载主配置
  const mainPath = path.join(projectRoot, 'cfg', 'main.toml');
  const mainFileContent = readFile(mainPath);
  const mainCfg: any = parse(mainFileContent);
  // 加载指定配置
  const specificFileContent = readFile(
    path.join(projectRoot, 'cfg', `${mainCfg.server.use}.toml`),
  );
  const specificCfg: any = parse(specificFileContent);
  console.log(specificCfg);
  return _.merge(mainCfg, specificCfg);
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export default loadCfg();
