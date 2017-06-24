import { createHandler } from 'azure-function-express';
import { app } from './_app';

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});
