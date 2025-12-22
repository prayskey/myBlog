import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/compose', (req, res) => {
    res.render("compose.ejs");
})

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.render('index.ejs');
})

app.listen(PORT, (req, res) => {
    console.log(`Server is listening at PORT ${PORT}`);
})