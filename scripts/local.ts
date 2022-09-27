import { app } from '../src/api/app';

app.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
