import { createApp } from './app';
import { DEFAULT_PORT } from './constants';

async function startServer() {
    const app = await createApp();
    const port = process.env.PORT || DEFAULT_PORT;
    app.listen(port, () => {
        console.info(`Server is running on port http://localhost:${port}/graphql`);
    });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});
