def lines(a, b):
    """Return lines in both a and b"""

    #Los diccionarios no peuden tener key repetidas,
    #entonces creamos un diccionario cuyas claves sean la nueva lista y luego la volvemos a convertir en lista
    a = list(dict.fromkeys(a.splitlines()))
    b = b.splitlines()

    c = [i for i in a if i in b]

    return c


def sentences(a, b):
    """Return sentences in both a and b"""

    from nltk.tokenize import sent_tokenize

    a = sent_tokenize(a)
    a = list(dict.fromkeys(a))

    b =  sent_tokenize(b)

    c = [i for i in a if i in b]

    return c


def substrings(a, b, n):
    """Return substrings of length n in both a and b"""

    new_a = []
    new_b = []

    for i in range(len(a) - n + 1):
        new_a.append(a[i:n + i])

    for i in range(len(b) - n + 1):
        new_b.append(b[i:n + i])

    c = [i for i in new_a if i in new_b]
    c = list(dict.fromkeys(c))

    return c