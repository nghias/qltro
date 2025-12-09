require('dotenv').config();
const express = require("express");
const { engine } = require("express-handlebars");
const path = require('path');
const route = require("./routers");
const session = require("express-session");
const methodOverride = require('method-override');
const helmet = require('helmet');

const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.id = req.session.user?.id || null;
    res.locals.role = req.session.user?.role || null;
    res.locals.info = req.session.user?.info || null;
    next();
});

app.use(helmet());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

// Cache file tĩnh trong 1 ngày (86400000 ms)
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', 
    etag: false
}));

// cấu hình template engine
app.engine("hbs", engine({ 
    extname: ".hbs",
    helpers: {
        eq: (a, b) => a === b,
        or: (a, b) => a || b,
    }
 }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "app","views"));

route(app);

app.listen(PORT, () => {
    console.log("Server chạy ở cổng " + PORT);
});
