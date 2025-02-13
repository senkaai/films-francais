const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const db = new sqlite3.Database('./movies.db');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

app.get('/movies', (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/movies', (req, res) => {
    const { nom, dateDeSortie, realisateur, notePublic, note, compagnie, description, origine, lienImage } = req.body;
    db.run(`INSERT INTO movies (nom, dateDeSortie, realisateur, notePublic, note, compagnie, description, origine, lienImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nom, dateDeSortie, realisateur, notePublic, note, compagnie, description, origine, lienImage], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Film ajouté avec succès', id: this.lastID });
        });
});

app.delete('/movies/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM movies WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Film supprimé avec succès', changes: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});