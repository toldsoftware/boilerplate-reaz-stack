import { createHandler } from 'azure-function-express';
import { app } from './_app';

// Binds Express App to Azure Functions Node Context
declare const global: any;
global.__app = app;
global.__app_handler = createHandler(app);
module.exports = global.__app_handler;


