import os

from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

# Make sure API key is set
if not os.environ.get("API_KEY"):
    raise RuntimeError("API_KEY not set")


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    summary = db.execute(f"SELECT symbol, SUM(shares) FROM history h WHERE id = {session['user_id']} GROUP BY h.symbol ORDER BY price DESC")
    print(f"Lo obtenido de la base de datos es: {summary} con una longitud de {len(summary)}")
    stock_grand_total = 0
    for i in summary:
        info = lookup(i['symbol'])
        i.update(info)
        total_price = i['SUM(shares)'] * i['price']
        stock_grand_total += total_price
        i.update({'total': usd(total_price), 'price': usd(i['price'])})
    cash = db.execute("SELECT cash FROM users WHERE id = :id", id = session["user_id"])
    stock_grand_total += cash[0]['cash']
    stock_grand_total = usd(stock_grand_total)
    return render_template("index.html", summary = summary, total = stock_grand_total, cash = usd(cash[0]['cash']))


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    # Get info from the form
    symbol = request.form.get("symbol")
    shares = request.form.get("shares")

    # Define behavior on POST request
    if request.method == "POST":
        info = lookup(symbol)
        if not info:
            return apology("Invalid symbol", 400)

        # Handles possible input errors of the number of shares that the user wants to buy
        try:
            shares = int(shares)
        except:
            return apology("Please enter a positive integer", 400)

        if int(shares) < 0:
            return apology("You can only buy 1 or more shares", 400)
        user_info = db.execute("SELECT * FROM users WHERE id = :id", id = session["user_id"])
        valor_compra = float(info.get('price')) * float(shares)
        print(f"El valor total de la compra es de {float(info.get('price')) * float(shares)}")
        if (float(info.get('price')) * float(shares)) > user_info[0]["cash"]:
            return apology("Can't afford", 400)
        else:
            result = db.execute(f"INSERT INTO history (id, symbol, shares, price) VALUES (:id, '{symbol}', '{shares}', '{info.get('price')}')", id = session["user_id"])
            print(f"El número de transacción es: {result}")
            if result:
                new_cash_value = user_info[0]['cash'] - valor_compra
                update = db.execute(f"UPDATE users SET cash = {new_cash_value} WHERE id = {session['user_id']}")
                return redirect("/")
            else:
                return apology("Failed to update transaction history database", 400)

    # Define behaviour on GET request
    else:
        return render_template("buy.html", get = 1)

@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    summary = db.execute(f"SELECT * FROM history h WHERE id = {session['user_id']} ORDER BY price DESC")
    for transaction in summary:
        transaction['price'] = usd(transaction['price'])
    print(f"Lo obtenido de la base de datos es: {summary} con una longitud de {len(summary)}")
    return render_template("history.html", summary = summary)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    symbol = request.form.get("symbol")
    if request.method == "POST":
        info = lookup(symbol)
        if not info:
            return apology("Invalid symbol", 400)
        # info = usd(info)
        print(info["price"])
        info["price"] = usd(info["price"])
        return render_template("quote.html", info = info)
    else:
        return render_template("quote.html", get = 1)


@app.route("/changepassword", methods=["GET", "POST"])
def changepassword():
    """Change Password"""

    # Get the input information from the form
    currentpassword = request.form.get("currentpassword")
    newpassword = request.form.get("newpassword")
    confirm = request.form.get("confirmpassword")

    if request.method == "POST":

        # Ensure current password was submitted
        if not currentpassword:
            return apology("must provide your current password", 403)

        # Ensure password was submitted
        elif newpassword != confirm or not newpassword or not confirm:
            return apology("invalid new password", 23455)

        # Query database for user information
        info = db.execute(f"SELECT * FROM users WHERE id = '{session['user_id']}'")

        # Ensure username exists and password is correct
        if len(info) != 1 or not check_password_hash(info[0]["hash"], currentpassword):
            return apology("invalid password", 403)

        hashp = generate_password_hash(newpassword)
        result = db.execute(f"UPDATE users SET hash = :passw WHERE id = '{session['user_id']}'", passw = hashp)
        print(result)
        return redirect("/")
    else:
        return render_template("changepassword.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    username = request.form.get("username")
    password = request.form.get("password")
    confirm = request.form.get("confirmation")

    if request.method == "POST":
        username = username.lower()
        databaseusers = db.execute("SELECT username FROM users")
        users = []

        for i in databaseusers:
            i['username'] = i['username'].lower()
            users.append(i['username'])

        for i in users:
            if username == i:
                return apology("Username already in use", 400)

        if not username or not password or not confirm:
                return apology("Please fill all the fields", 400)

        if password != confirm:
            return apology("Input passwords are different")

        hashp = generate_password_hash(password)
        result = db.execute("INSERT INTO users (username, hash) VALUES (:name, :passw)", name = username, passw = hashp)
        print(result)
        session["user_id"] = result
        return redirect("/quote")
    else:
        return render_template("register.html")

@app.route("/check", methods=["GET", "POST"])
def check():
    if request.method == "POST":
        username = request.form.get("username")
    else:
        username = request.args.get("username")

    username = username.lower()
    databaseusers = db.execute("SELECT username FROM users")
    users = []

    for i in databaseusers:
        i['username'] = i['username'].lower()
        users.append(i['username'])

    print(users)
    print(f"La variable recibida tiene este valor: {username}")

    for i in users:
        if username == i:
            print("Se va a retornar 'Falso'")
            return jsonify(False)
    print("Se va a retornar 'Verdadero'")
    return jsonify(True)


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    symbol = request.form.get("symbol")
    number_shares = request.form.get("shares")
    if request.method == "POST":
        validate = db.execute(f"SELECT SUM(shares)  FROM history WHERE id = '{session['user_id']}' AND symbol = '{symbol}' GROUP BY history.symbol ORDER BY price DESC")
        print(f"El dato validado es: {validate}")
        print(f"El dato formateado es: {validate[0]['SUM(shares)']}")
        print(f"El valor de la variable number_shares es {number_shares}")
        number_shares = int(number_shares)
        if number_shares > validate[0]['SUM(shares)']:
            return apology("You can't sell more shares than you have, madafaka tramposoooo", 400)
        info = lookup(symbol)
        print(f"La información solicitada al servicio externo es: {info}")
        if not info:
            return apology("Symbol information not available", 400)
        cash_current = db.execute(f"SELECT cash FROM users WHERE id = {session['user_id']}")
        print(f"El efectivo disponible actual es: {cash_current}")
        cash_new = float(info['price']) * float(number_shares) + cash_current[0]['cash']
        print(f"El valor de la venta es: {cash_new}")
        print(f"El valor de la variable number_shares es {number_shares}")
        history = db.execute(f"INSERT INTO history (id, symbol, shares, price) VALUES (:id, '{symbol}', (-1 * '{number_shares}'), '{info.get('price')}')", id = session["user_id"])
        cash_update = db.execute(f"UPDATE users SET cash = {cash_new} WHERE id = {session['user_id']}")
        return redirect("/")
    else:
        stocks = db.execute(f"SELECT symbol, SUM(shares)  FROM history WHERE id = '{session['user_id']}' GROUP BY history.symbol ORDER BY price DESC")
        print(stocks)
        activate_form = 0
        for i in stocks:
            if i['SUM(shares)']:
                activate_form += 1
        print(activate_form)
        return render_template("sell.html", stocks = stocks, activate_form = activate_form)



def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)
