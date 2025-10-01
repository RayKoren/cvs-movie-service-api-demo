import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema/typeDefs';
import { resolvers } from './graphql/resolvers';

async function startServer() {
    dotenv.config();

    const app = express();
    const port = process.env.PORT || 4000;

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.listen(port, () => {
        console.info(`Server is running on port http://localhost:${port}/graphql`);
    });
}

startServer().catch(error => {
    console.error('Error starting server:', error);
    process.exit(1);
});
