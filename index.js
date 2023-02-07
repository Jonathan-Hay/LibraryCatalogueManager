const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const createSessionConfig = require("./config/session");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base-routes");
const adminRoutes = require("./routes/admin-routes");
const ordersRoutes = require("./routes/orders.routes");
const db = require("./data/database");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(express.static("public")); 
app.use("/products/assets", express.static("product-data"));
app.use(checkAuthStatusMiddleware);
app.use(baseRoutes);
app.use(authRoutes);
app.use("/orders", ordersRoutes);
app.use("/admin", adminRoutes);

db.connectToDatabase().then(function () {
  app.listen(3000);
});
