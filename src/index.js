const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const expressHBS = require("express-handlebars");

const app = express();

const hbs = expressHBS.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials")
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

let limit = 10;

app.get("/", async (request, response) => {
  try {
    let page = 1;
    const res = await fetch(
      `http://www.pinkvilla.com/photo-gallery-feed-page/page?_limit=${limit}&_page=${page}`
    );
    let data = await res.json();
    data = data.nodes;
    console.log(data);
    response.status(200).render("home.hbs", {
      layout: "navigation.hbs",
      title: "Home",
      data: data
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/nextPage/:page", async (request, response) => {
  const { page } = request.params;
  const res = await fetch(
    `http://www.pinkvilla.com/photo-gallery-feed-page/page?_limit=${limit}&_page=${page}`
  );
  let data = await res.json();
  data = data.nodes;
  response.status(200).send(data);
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Application is up and running");
});
