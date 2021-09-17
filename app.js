require("dotenv").config();

const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const cors = require("cors");
var fs = require("fs");
var jsyaml = require("js-yaml");
var spec = fs.readFileSync("ApiDoc.yml", "utf8");
const swaggerUI = require("swagger-ui-express");
const openApiDocumentation = jsyaml.load(spec);

// Connect with mongodb database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// Allow CORS policy
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Route to player controller
const playerRouter = require("./routes/player");
app.use("/player", playerRouter);

// Connect with documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openApiDocumentation));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
