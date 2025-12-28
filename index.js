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

var posts = [{
    "postId": "JPY62439699507262",
    "blogImage": "/uploads/1766820491460-my pic.jpg",
    "author": "Prayskey Ogbonna",
    "blogTitle": "My first blog post",
    "blogTextContent": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    "hashTags": [
        "Research",
        "work",
        "education"
    ]
}];

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
    const randIdNum = Math.floor(Math.random() * 999999999999999).toString();
    const postId = `JPY${randIdNum}`;

    const postCard = new PostCard(postId, postImage, req.body.author, req.body.blogTitle, req.body.blogText, req.body.hashTags.split(", "));
    posts.unshift(postCard);
}

app.get('/', (req, res) => {
    res.render('index.ejs', { posts });
})
app.get('/posts', (req, res) => {
    res.redirect('/');
})

app.get('/compose', (req, res) => {
    res.render("compose.ejs");
})

app.post('/submit', upload.single("blogImage"), (req, res) => {
    const postImage = `/uploads/${req.file.filename}`;
    createPostCard(req, res, postImage);

    res.redirect('/');
})
app.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.postId === req.params.id);

    if (!post) {
        res.sendStatus(404).send("Post not found!");
    }
    res.render("post.ejs", { post });
})
app.post('/posts/:id/edit', (req, res) => {
    const post = posts.find(post => post.postId === req.params.id);

    res.render('edit.ejs', { post });
});
app.post('/update-post/:id', (req, res) => {
    const post = posts.find(post => post.postId === req.params.id);

    console.log(req.body);

    post.blogTitle = req.body.blogTitle;
    post.author = req.body.author;
    post.hashTags = req.body.hashTags.split(",")
    post.blogTextContent = req.body.blogText;

    console.log(post);
    console.log(posts);


    res.redirect('/posts/')
    // res.redirect(`/posts/${posts.postId}`, { posts });
});

app.post('/posts/:id/delete', (req, res) => {
    posts = posts.filter(post => post.postId !== req.params.id);
    console.log(req.params);
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`Server is listening at PORT:${PORT}`);
})
