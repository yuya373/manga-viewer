const Store = require('electron-store');
Store.initRenderer();

require("ts-node").register({
  project: './backend/tsconfig.json',
});
require("./backend");
