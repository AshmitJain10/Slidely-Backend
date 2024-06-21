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
  const db = readDatabase();
  res.send(db.submissions);
});

app.delete("/delete", (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);
  const db = readDatabase();
  if (index >= 0 && index < db.submissions.length) {
    db.submissions.splice(index, 1);
    writeDatabase(db);
    res.status(200).send({ message: "Submission deleted successfully" });
  } else {
    res.status(404).send({ message: "Submission not found" });
  }
});

app.put("/edit", (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const db = readDatabase();

  if (index >= 0 && index < db.submissions.length) {
    db.submissions[index] = { name, email, phone, github_link, stopwatch_time };
    writeDatabase(db);
    res.status(200).send({ message: "Submission updated successfully" });
  } else {
    res.status(404).send({ message: "Submission not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
