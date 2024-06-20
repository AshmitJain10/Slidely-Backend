import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
const dbFilePath = "./db.json";

app.use(bodyParser.json());

const readDatabase = () => {
  const data = fs.readFileSync(dbFilePath, "utf8");
  return JSON.parse(data);
};

const writeDatabase = (data: any) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

app.get("/ping", (req: Request, res: Response) => {
  res.send(true);
});

app.post("/submit", (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  console.log(req.body);
  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  const db = readDatabase();
  db.submissions.push(newSubmission);
  writeDatabase(db);

  res.status(201).send(newSubmission);
});

app.get("/read", (req: Request, res: Response) => {
  const db = readDatabase();
  res.send(db.submissions);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
