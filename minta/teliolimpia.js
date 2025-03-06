const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const port = 3001;
 
app.use(cors());
app.use(bodyparser.json());
 
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    port: 3307,
    password: "",
    database: "teliolimpia"
});
 
db.connect((err) => {
    if (err) {
        console.error("Hiba az adatbázishoz való kapcsolódáskor:", err);
    } else {
        console.log("Sikeres adatbázis kapcsolat!");
    }
});
 
app.get("/", (req, res) => {
    res.send("Működik a szerver.");
});
 

app.get("/versenyzok", (req, res) => {
    db.query("SELECT * FROM versenyzok", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});
 

app.get("/magyar_eremszerzok", (req, res) => {
    const sql = `
        SELECT v.versenyzo, m.helyezes, t.tav, s.sportagneve
        FROM magyarermesek m
        JOIN versenyzok v ON m.versenyzoID = v.ID
        JOIN rpgytavok t ON m.tavID = t.tavID
        JOIN sportagak s ON m.sportagID = s.sportagID
        ORDER BY m.helyezes ASC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send("Hiba történt a magyar éremszerzők lekérdezésekor");
        res.json(results);
    });
});
 
app.listen(3000, () => {
    console.log("A téliolimpia szervere a 3000-es porton fut.");
});