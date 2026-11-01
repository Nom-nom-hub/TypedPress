const fs = require('fs');
const s = fs.readFileSync('C:/Users/teck/Desktop/TypedPress/apps/admin/app/globals.css','utf8');
console.log(s.slice(0,700));