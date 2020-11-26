from app import app
from app.Database import Database
from flask import render_template, request
import json

@app.route("/")
def index():
    if request.method == "GET":
        if request.args.get("compact") != None:
            return render_template("index-compact.html")
        if request.args.get("popout") != None:
            return render_template("index-popout.html")

    # Else
    return render_template("index.html")
    
@app.route("/favicon.ico")
def favicon():
    return app.send_static_file('favicon.ico')

@app.route("/report", methods=["POST"])
def about():
    if request.method == "POST":
        jsonData = request.json
    
        pdb = Database('phasmophobia-reports.db')
        pdb.addData(jsonData)
        pdb.close()
        
        fout = open('debug.txt', 'w')
        fout.write(str(jsonData))
        fout.close()
    
        return request.json
    else:
        return ""
        
@app.route("/dbtest")
def dbtest():
    pdb = Database('phasmophobia-reports.db')
    pdb.close()
    
    return "Success"