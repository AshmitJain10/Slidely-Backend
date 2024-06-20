"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
const dbFilePath = "./db.json";
app.use(body_parser_1.default.json());
const readDatabase = () => {
    const data = fs_1.default.readFileSync(dbFilePath, "utf8");
    return JSON.parse(data);
};
const writeDatabase = (data) => {
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};
app.get("/ping", (req, res) => {
    res.send(true);
});
app.post("/submit", (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    const db = readDatabase();
    db.submissions.push(newSubmission);
    writeDatabase(db);
    res.status(201).send(newSubmission);
});
app.get("/read", (req, res) => {
    const index = parseInt(req.query.index, 10);
    const db = readDatabase();
    if (isNaN(index) || index < 0 || index >= db.submissions.length) {
        res.status(400).send({ error: "Invalid index" });
    }
    else {
        res.send(db.submissions[index]);
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
