import sqlite3

class Database:
    def __init__(self, dbpath):
        self.conn = sqlite3.connect(dbpath)
        self.cursor = self.conn.cursor()
        self.schema()
        
    def schema(self):
        ctableQuery = """
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                location TEXT,
                difficulty TEXT,
                ghost_name_first TEXT,
                ghost_name_last TEXT,
                responds_to TEXT,
                reports TEXT,
                objective_1 TEXT,
                objective_2 TEXT,
                objective_3 TEXT,
                objective_4 TEXT,
                ghost_type TEXT
            );
            CREATE TABLE IF NOT EXISTS characteristics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                UNIQUE(name)
            );
            CREATE TABLE IF NOT EXISTS reports_characteristics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_id INTEGER,
                char_id INTEGER,
                value TEXT
            )"""
        self.cursor.executescript(ctableQuery)
        self.conn.commit()
            
    def addData(self, jsonData):
        params = (
            jsonData["main_location"],
            jsonData["main_difficulty"],
            jsonData["main_name_first"],
            jsonData["main_name_last"],
            jsonData["main_responds"],
            jsonData["main_report"],
            jsonData["objective_1"],
            jsonData["objective_2"],
            jsonData["objective_3"],
            jsonData["objective_4"],
            jsonData["ghost_type"]
        )
        reportQuery = """INSERT INTO reports(
            location,
            difficulty,
            ghost_name_first,
            ghost_name_last,
            responds_to,
            reports,
            objective_1,
            objective_2,
            objective_3,
            objective_4,
            ghost_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
        self.cursor.execute(reportQuery, params)
        reportId = self.cursor.lastrowid
        
        charLabelSelectQuery = "SELECT id FROM characteristics WHERE name = ?;"
        charLabelInsertQuery = "INSERT INTO characteristics(name) VALUES (?);"
        charValueInsertQuery = "INSERT INTO reports_characteristics(report_id, char_id, value) VALUES (?, ?, ?);"
        for key in jsonData:
            if key.startswith("char_"):
                self.cursor.execute(charLabelSelectQuery, (key,))
                res = self.cursor.fetchone()
                if res != None:
                    charLabelId = res[0]
                else:
                    self.cursor.execute(charLabelInsertQuery, (key,))
                    charLabelId = self.cursor.lastrowid
                self.cursor.execute(charValueInsertQuery, (reportId, charLabelId, jsonData[key]))
        
        self.conn.commit()
        
    def close(self):
        self.conn.commit()
        self.conn.close()