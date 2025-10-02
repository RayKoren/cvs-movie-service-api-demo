import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema/typeDefs';
import { resolvers } from './graphql/resolvers';
import type { GraphQLFormattedError } from 'graphql';

export async function createApp() {
    dotenv.config();

    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (formattedError: GraphQLFormattedError, _error: unknown) => {
            const isProd = process.env.NODE_ENV === 'production';
            const message = formattedError.message || 'Unexpected error';
            const path = formattedError.path;
            const code = (formattedError.extensions && (formattedError.extensions as any).code) || 'INTERNAL_SERVER_ERROR';
            if (!isProd) {
                return { message, path, code, extensions: formattedError.extensions };
            }
            return { message, path, code };
        }
    });
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    // 404 handler
    app.use((req, res, next) => {
        res.status(404).json({ error: 'Not Found' });
    });

    // Centralized error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        const status = err.status || 500;
        const isProd = process.env.NODE_ENV === 'production';
        const payload: any = { error: err.message || 'Internal Server Error' };
        if (!isProd) {
            payload.stack = err.stack;
        }
        res.status(status).json(payload);
    });

    return app;
}

// Process-level safety nets
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
