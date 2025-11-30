import { redisClient } from "../config/redis";

export const fetchAllTutorialsFromCache = async () => {
  try {
    const keys = await redisClient.keys("tutorial:*");

    if (!keys.length) {
      return []; 
    }

    const values = await Promise.all(keys.map(key => redisClient.get(key)));

    const tutorials = values
      .map(val => {
        try {
          return JSON.parse(val);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    return tutorials;

  } catch (error) {
    throw error;
  }
};

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
