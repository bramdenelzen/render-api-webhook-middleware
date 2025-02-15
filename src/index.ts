import express, { Request, Response } from "express";
import dotenv from "dotenv";
import fetch, { Response as FetchResponse } from "node-fetch";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const RENDER_TOKEN = process.env.RENDER_TOKEN;
const RENDER_ENDPOINT = process.env.RENDER_ENDPOINT;

app.post("/redeploy", (req: Request, res: Response) => {
  if (req.headers.authorization === `Bearer ${RENDER_TOKEN}`) {
    if (!RENDER_TOKEN || !RENDER_ENDPOINT) {
      res
        .send("Missing RENDER_TOKEN or RENDER_ENDPOINT env variables")
        .status(500);
      return;
    }

    fetch(RENDER_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${RENDER_TOKEN}`,
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        clearCache: "clear",
      }),
    }).then((response: FetchResponse) => {
      console.log(response);
      if (response.ok) {
        res.send("Redeployed");
      } else {
        console.error("Error in fetch request: " + response);
        res.send("Failed to redeploy").status(500);
      }
    });
  } else {
    res.send("Unauthorized").status(401);
  }
});

app.get("/health", (req: Request, res: Response) => {
  res.send("OK").status(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
