from app import app
from flask import render_template, request
import sqlite3, json

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/favicon.ico")
def favicon():
    return app.send_static_file('favicon.ico')

@app.route("/report", methods=["POST"])
def about():
    try:
        if request.method == "POST":
            jsonData = request.json
        
            conn = sqlite3.connect('phasmophobia-reports.db')
            cur = conn.cursor()
            
            ctableQuery = """CREATE TABLE IF NOT EXISTS reports (
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
                ghost_type TEXT,
                c_roaming TEXT,
                c_sound TEXT,
                c_lights_on TEXT,
                c_lights_off TEXT,
                c_lights_flicker TEXT,
                c_breaker_off TEXT,
                c_breaker_on TEXT,
                c_shrill TEXT,
                c_mimic TEXT,
                c_ouija TEXT,
                c_items TEXT,
                c_phone TEXT,
                c_tv TEXT,
                c_radio TEXT,
                c_car TEXT,
                c_piano TEXT
            );"""
            cur.execute(ctableQuery)
            fout = open('debug.txt', 'w')
            fout.write("test")
            
            iQuery = """INSERT INTO reports(
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
                ghost_type,
                c_roaming,
                c_sound,
                c_lights_on,
                c_lights_off,
                c_lights_flicker,
                c_breaker_off,
                c_breaker_on,
                c_shrill,
                c_mimic,
                c_ouija,
                c_items,
                c_phone,
                c_tv,
                c_radio,
                c_car,
                c_piano
            ) VALUES ({});""".format(','.join(['?']*27))
            
            
            fout.write(iQuery)
            
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
                jsonData["ghost_type"],
                jsonData["char_roaming"],
                jsonData["char_sound"],
                jsonData["char_lights_on"],
                jsonData["char_lights_off"],
                jsonData["char_lights_flicker"],
                jsonData["char_breaker_off"],
                jsonData["char_breaker_on"],
                jsonData["char_shrill"],
                jsonData["char_mimic"],
                jsonData["char_ouija"],
                jsonData["char_items"],
                jsonData["char_phone"],
                jsonData["char_tv"],
                jsonData["char_radio"],
                jsonData["char_car"],
                jsonData["char_piano"],
            )
            
            
            fout.write(str(params))
            fout.close()
            
            cur.execute(  iQuery  , params)
            conn.commit()
            conn.close()
        
            return request.json
        else:
            return ""
    except Exception as e:
        return str(e)