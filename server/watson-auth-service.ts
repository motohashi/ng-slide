import * as watson from 'watson-developer-cloud';
import * as path from 'path';
import * as fs from 'fs';

const secret = JSON.parse(fs.readFileSync(path.join(__dirname, 'credential.json'), 'utf8'));
const authConfig = {
  version: 'v1',
  url: secret.url,
  username: secret.username,
  password: secret.password
};
const watsonAuthService = watson.authorization(authConfig);
export function getAuthToken(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    watsonAuthService.getToken({ url: authConfig.url }, (err, token: string) => {
      if (err) { reject(err); }
      resolve(token);
    });
  });
}