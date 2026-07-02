import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt, { hash } from "bcrypt";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

app.get("/users", async (req, res) => {
    try {
        const result = await db.query("select distinct job_title from job_application");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }

});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error(err);
            } else {
                const result = await db.query("insert into Users(name,email,password)values($1,$2,$3) returning *", [name, email, hash]);
                res.status(200).json(result.rows[0]);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error in inserting" });
    }
});

app.post("/description", async (req, res) => {
    try {
        const { job_title } = req.body;
        const result = await db.query("select job_description from job_application where job_title=$1", [job_title]);
        const pythonResponse = await axios.post("http://127.0.0.1:8000/generate-question", { job_description: result.rows[0].job_description });
        res.status(200).json(pythonResponse.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error in searching" });
    }
})

app.post("/evaluate-answer", async (req, res) => {
    try {
        const { question, answer } = req.body;
        const pythonResponse = await axios.post("http://127.0.0.1:8000/evaluate-answer", { question, answer });
        res.json(pythonResponse.data);
    } catch (error) {
        console.log(error);
    }

})

app.post("/jobs", async (req, res) => {
    try {
        const { company_name, job_title, job_description, status, applied_date } = req.body;
        const result = await db.query("insert into job_application(company_name,job_title,job_description,status,applied_date) values($1,$2,$3,$4,$5) returning *", [company_name, job_title, job_description, status, applied_date]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "errror in inserting" });
    }
})

app.post("/login", async (req, res) => {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (user) {
            return res.status(200).json({ user });
        } else {
            try {
                const { name, email, password } = req.body;
                const checkUser = await db.query("select * from Users where email=$1", [email]);
                if (checkUser.rows.length > 0) {
                    return res.status(401).json({ message: "incorrect password" });
                } else {
                    return res.status(404).json({ message: "user not found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: error.message });
            }
        }
    })(req, res);

});

passport.use("local", new Strategy({ usernameField: "email", passwordField: "password" }, async function verify(email, password, cb) {
    try {
        const result = await db.query("select * from Users where email=$1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            bcrypt.compare(password, storedPassword, (err, valid) => {
                if (err) {
                    console.error(err);
                    return cb(err);
                } else {
                    if (valid) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }
                }
            });
        } else {
            return cb(null, false);
        }
    } catch (error) {
        console.log(error);
    }
}))

app.listen(port, () => {
    console.log(`server runnign on port ${port}`);
})