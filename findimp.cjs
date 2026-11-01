const fs = require('fs');
const l = fs
  .readFileSync('C:/Users/teck/Desktop/TypedPress/apps/api/src/server.ts', 'utf8')
  .split(/\r?\n/);
for (let i = 4; i < 13; i++) console.log(i + 1, l[i]);
