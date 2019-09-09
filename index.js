const carlo = require('carlo');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const bootstrap = async () => {
  // Launch the browser.
  const app = await carlo.launch();

  // Terminate Node.js process on app window closing.
  app.on('exit', () => process.exit());

  // Expose 'env' function in the web environment.
  await app.exposeFunction('env', _ => process.env);

  // Navigate to the main page of your app.
  if (isProduction) {
    app.serveFolder(path.join('build'));
    await app.load('build/index.html');
  } else {
    await app.load('http://localhost:3000/');
  }
};

bootstrap();
