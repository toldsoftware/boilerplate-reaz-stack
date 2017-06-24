import { app } from "./_app";

declare const global: any;
global.__app_handler = app;
module.exports = global.__app_handler;

