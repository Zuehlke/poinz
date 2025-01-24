import {execSync} from 'child_process';

export function getGitInformation() {
  const gitExecOptions = {cwd: __dirname, timeout: 1000, encoding: 'utf-8'};
  const abbrev = execSync('git rev-parse --abbrev-ref HEAD', gitExecOptions);
  const short = execSync('git rev-parse --short HEAD', gitExecOptions);

  return {
    branch: abbrev.split('\n').join(''),
    hash: short.split('\n').join('')
  };
}
