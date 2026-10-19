import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Futura server listening on http://localhost:${config.port}`);
  console.log(`Environment: ${config.env}`);
});
