const ngrok = require('ngrok');
const { exec } = require('child_process');

(async function() {
  const url = await ngrok.connect({
    addr: 19006,
    subdomain: 'your-subdomain',
    authtoken: '2OgeBFkLWJROOW78UnzOCWj6QkS_7XGo9C8DvYc3HhPPvaJWu'
  });
  
  console.log(`ngrok forwarding is live: ${url}`);
  
  exec('expo start --web', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Expo: ${error}`);
      return;
    }
    console.log(`Expo output: ${stdout}`);
    console.error(`Expo error output: ${stderr}`);
  });
})();
