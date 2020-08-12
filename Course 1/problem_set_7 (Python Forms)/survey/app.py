import cs50
import csv

from flask import Flask, jsonify, redirect, render_template, request

# Configure application
app = Flask(__name__)

# Reload templates when they are changed
app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.after_request
def after_request(response):
    """Disable caching"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET"])
def get_index():
    return redirect("/form")


@app.route("/form", methods=["GET"])
def get_form():
    return render_template("form.html")


@app.route("/form", methods=["POST"])
def post_form():
    impresion = request.form.get("impresion")
    gustos = request.form.getlist("gustos")
    email = request.form.get("email")
    username = request.form.get("username")
    eleccion = request.form.get("eleccion")

    inputs = {'Calificación de 1 a 5':impresion, "Letras":gustos, 'e-mail':email, 'Nombre de Usuario':username, 'Elección':eleccion}
    empty = []
    error = False

    for key, value in inputs.items():
        if value == "":
            empty.append(key)
            error = True
    if error == True:
        empty_fields = ', '.join(empty)
        empty_fields += ", están vacíos o no los ha marcado, llene esa maricada e intente de nuevo"
        return render_template("error.html", message = empty_fields)

    with open('survey.csv', 'a', newline = '') as csv_file:
        field_names = ['Calificación de 1 a 5', 'Letras', 'e-mail', 'Nombre de Usuario', 'Elección']
        writer_buffer = csv.DictWriter(csv_file, fieldnames = field_names)
        writer_buffer.writerow({'Calificación de 1 a 5':impresion, 'Letras':gustos, 'e-mail':email, 'Nombre de Usuario':username, 'Elección':eleccion})

    return render_template("sheet.html", message = "Registro exitoso madafakaaaaaa", username = username)



@app.route("/sheet", methods=["GET"])
def get_sheet():
    with open('survey.csv') as file:
        reader = csv.reader(file)
        headers = next(reader)
        data = [c for c in reader]

    return render_template("sheet.html", headers = headers, data = data)
