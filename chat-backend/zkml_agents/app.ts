import express, { Express, Request, Response } from 'express';
import { handleRequest } from './chat';
import bodyParser from 'body-parser';
import cors from 'cors';

interface MessageRequest {
    question: string,
    chatId: string,
  }

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));

// Configure body-parser to handle JSON bodies
app.use(bodyParser.json());
app.post('/*', async (req: Request<MessageRequest>, res: Response) => {
     const response = await handleRequest(req.body);
     res.send(response);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
