import { redisClient } from "../config/redis";

export const fetchTutorials = async () => {
  try {
    const keys = await redisClient.keys("tutorial:*");

    if (keys.length >= 10) {
      const values = await Promise.all(keys.map(key => redisClient.get(key)));

      const tutorials = values
        .map(v => {
          try {
            return JSON.parse(v);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      return {
        status: "success",
        message: "OK (from cache)",
        data: {
          tutorials
        }
      };
    }

    const response = await fetch(`${process.env.API_DICODING}/tutorials`);
    const result = await response.json();

    const tutorials = result.data.tutorials;

    for (const t of tutorials) {
      await redisClient.set(
        `tutorial:${t.id}`,
        JSON.stringify(t),
        { EX: 3600 }
      );
    }

    return {
      status: "success",
      message: "OK (from API)",
      data: {
        tutorials
      }
    };

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

    if (result.status === "fail") {
      const err = new Error(result.message || "Tutorial not found");
      err.statusCode = 404;
      throw err;
    }

    const tutorial = await response.json();

    await redisClient.set(`tutorial:${id}`, JSON.stringify(tutorial), { EX: 3600 });
    return tutorial;
  } catch (error) {
    throw error;
  }
};
