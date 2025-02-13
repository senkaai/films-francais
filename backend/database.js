const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./movies.db');

const moviesData = JSON.parse(fs.readFileSync('./movies.json', 'utf8'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        dateDeSortie TEXT,
        realisateur TEXT,
        notePublic REAL,
        note REAL,
        compagnie TEXT,
        description TEXT,
        origine TEXT,
        lienImage TEXT
    )`);

    const stmt = db.prepare(`INSERT INTO movies (nom, dateDeSortie, realisateur, notePublic, note, compagnie, description, origine, lienImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    moviesData.forEach(movie => {
        stmt.run(movie.nom, movie.dateDeSortie, movie.realisateur, movie.notePublic, movie.note, movie.compagnie, movie.description, movie.origine, movie.lienImage);
    });
    stmt.finalize();
});

db.serialize(() => {
    db.run(`INSERT INTO movies (nom, dateDeSortie, realisateur, notePublic, note, compagnie, description, origine, lienImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ["Equalizer 3", "2023", "Antoine Fuqua", 4.2, 4.5, "Columbia Pictures", "Robert McCall trouve sa paix en Italie, mais ses amis sont sous le contrôle des patrons du crime local. Alors que les événements deviennent mortels, McCall sait ce qu'il doit faire : devenir le protecteur de ses amis en prenant la mafia à bras-le-corps.", "USA", "img/equalizer3.jpg"]);
});

db.close();