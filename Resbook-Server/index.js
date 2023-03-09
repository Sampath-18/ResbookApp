const express = require("express");
require("dotenv").config();
require("./db/conn");
const User = require("./models/user");
console.log(User);
// const  cors=require('cors')
const app = express();

// const auth=require('./routers/auth.js')

const port = process.env.REACT_APP_PORT;
// console.log(process.env.REACT_APP_PORT);
// app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/auth',auth)

app.get("/", (req, res) => {
  res.send("<h1>namaste</h1>");
});

app.post("/signup", async (req, res) => {
  const { fname, lname, email, password, cpassword } = req.body;
  try {
    if (!fname || !lname || !email || !password || !cpassword) {
      return res.status(422).json({ error: "please fill the field property" });
    }
    if (password != cpassword) {
      return res.status(422).json({ error: "password do not match" });
    } else {
      User.findOne({ email: email }).then((user) => {
        if (user) {
          return res.status(422).json({ error: "Email already exists" });
        } else {
          const user = new User({ fname, lname, email, password, cpassword });
          user
            .save()
            .then(() => {
              return res
                .status(201)
                .json({ message: "user created successfully" });
            })
            .catch((err) => {
              res.status(500).json({ error: "failed to register" });
            });
        }
      });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ err: "please fill the above details" });
  }
  try {
    const userLogin = await User.findOne({ email: email });
    if (userLogin.password == password) {
      res.status(201).json({ message: "User login successfully" });
    } else !userLogin;
    {
      res.status(400).json({ error: "user error" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`server is connected to ${port}`);
});
