const fs = require('fs');
const l = fs.readFileSync('C:/Users/teck/Desktop/TypedPress/apps/api/src/server.ts','utf8').split(/\r?\n/);
for (let i=0; i<70; i++) console.log(i+1, JSON.stringify(l[i]));