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
  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  const db = readDatabase();
  db.submissions.push(newSubmission);
  writeDatabase(db);

  res.status(201).send(newSubmission);
});

app.get("/read", (req: Request, res: Response) => {
  const { index } = req.query;
  const db = readDatabase();

  if (index !== undefined) {
    const submissionIndex = parseInt(index as string, 10);
    if (submissionIndex >= 0 && submissionIndex < db.submissions.length) {
      res.send(db.submissions[submissionIndex]);
    } else {
      res.status(404).send({ error: "Submission not found" });
    }
  } else {
    res.send(db.submissions);
  }
});

app.delete("/delete", (req: Request, res: Response) => {
  const { index } = req.query;
  const submissionIndex = parseInt(index as string, 10);
  const db = readDatabase();

  if (submissionIndex >= 0 && submissionIndex < db.submissions.length) {
    db.submissions.splice(submissionIndex, 1);
    writeDatabase(db);
    res.send({ success: true });
  } else {
    res.status(404).send({ error: "Submission not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
