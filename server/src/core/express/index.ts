import express, { Request, Response, json } from "express";
import { History, User } from "../../entities";
import { database } from "../database";
import { isNumber } from "../utils";
import cors from 'cors';

const APP = express();

APP.use(cors());
APP.use(json());

APP.post('/history', async (request: Request, response: Response) => {
  const { userId, term } = request.body;
  if (!isNumber(userId)) {
    return response.status(400).send({
      message: 'Missing or incorrect userId type'
    });
  }

  if (!term) {
    return response.status(400).send({
      message: 'Missing or incorrect term'
    });
  }

  const user = await database.getRepository(User).findOneBy({ id: userId });
  if (!user) {
    return response.status(404).send({
      message: `User with id ${userId} was not found`
    });
  }

  const historyEntity = new History();
  historyEntity.user = user;
  historyEntity.term = term;
  const history = await database.manager.save(historyEntity);
  return response.status(200).send({
    history
  });
});

APP.get('/history/:userId', async (request: Request, response: Response) => {
  const { userId } = request.params;
  if (!isNumber(userId)) {
    return response.status(400).send({
      message: 'Missing or incorrect userId type'
    });
  }

  const history = await database.getRepository(History).createQueryBuilder().where("userId = :userId", { userId }).getMany();

  return response.status(200).send({
    history: history.map(({ term }) => term)
  });
});

APP.delete('/history/:userId', async (request: Request, response: Response) => {
  const { userId } = request.params;

  if (!isNumber(userId)) {
    return response.status(200).send({
      message: 'Missing or incorrect userId type'
    });
  }

  await database.getRepository(History).createQueryBuilder().delete().where("userId = :userId", { userId }).execute();

  return response.status(200).send({
    message: `History from user ${userId} was deleted`
  })
});

APP.post('/users', async (request: Request, response: Response) => {
  const user = new User();
  const { id } = await database.manager.save(user);
  response.status(200).send({
    message: "User created",
    id
  });
});

export default APP;
