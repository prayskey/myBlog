import express from "express";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const PORT = 3000;
class PostCard {
    constructor(postId, blogImage, author, blogTitle, blogTextContent, hashTags) {
        this.postId = postId;
        this.blogImage = blogImage;
        this.author = author;
        this.blogTitle = blogTitle;
        this.blogTextContent = blogTextContent;
        this.hashTags = hashTags;
    }
};

const posts = new Array();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

function createPostCard(req, res, postImage) {
    const randIdNum = Math.floor(Math.random() * 99999999999999).toString();
    const postId = `JPY${randIdNum}`;

    const postCard = new PostCard(postId, postImage, req.body.author, req.body.blogTitle, req.body.blogText, req.body.hashTags.split(", "));
    posts.unshift(postCard);
}

app.get('/', (req, res) => {
    res.render('index.ejs', { posts });
})

app.get('/compose', (req, res) => {
    res.render("compose.ejs");
})

app.post('/submit', upload.single("blogImage"), (req, res) => {
    const postImage = `/uploads/${req.file.filename}`;
    createPostCard(req, res, postImage);

    console.log(posts);


    res.redirect('/');
})

app.listen(PORT, (req, res) => {
    console.log(`Server is listening at PORT:${PORT}`);
})
