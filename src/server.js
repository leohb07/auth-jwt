import express from "express";
import jwt from "jsonwebtoken";

const SECRET = "3a2a53df14340f073a35e14872ca2351";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"].split(" ");
  console.log(token);

  jwt.verify(token[1], SECRET, (err, decoded) => {
    if (err) return res.status(401).end();

    req.userId = decoded.userId;
    next();
  });
}

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "Health Check!" });
});

app.get("/customers", verifyToken, (_, res) => {
  res.json([{ id: 1, name: "Leonardo" }]);
});

app.post("/login", (req, res) => {
  if (req.body.user === "leonardo" && req.body.password === "123") {
    const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 300 });
    return res.json({
      token,
    });
  }

  return res.status(401).end();
});

app.post("/logout", (_, res) => {
  res.end();
});

app.listen(3333, () => {
  console.log("Running server on PORT: 3333");
});
