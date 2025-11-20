import { redisClient } from "../config/redis";

export const fetchTutorials = async (id) => {
  try {
    const cachedTutorials = await redisClient.get(`tutorials`);

    if (cachedTutorials) {
      return JSON.parse(cachedTutorials);
    }

    const response = await fetch(`${process.env.API_DICODING}/tutorials`);
    const tutorials = await response.json();

    await redisClient.set(`tutorials`, JSON.stringify(tutorials), { EX: 3600 });
    return tutorials;
  } catch (error) {
    throw error;
  }
}

export const fetchTutorialId = async (id) => {
  try {
    const cachedTutorial = await redisClient.get(`tutorial:${id}`);

    if (cachedTutorial) {
      return JSON.parse(cachedTutorial);
    }

    const response = await fetch(`${process.env.API_DICODING}/tutorials/${id}`);
    const tutorial = await response.json();

    await redisClient.set(`tutorial:${id}`, JSON.stringify(tutorial), { EX: 3600 });
    return tutorial;
  } catch (error) {
    throw error;
  }
};
