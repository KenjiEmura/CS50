from cs50 import get_int

def izq(altura):
    for j in range(altura - i - 1):
        print(" ", end="")
    for k in range(i + 1):
        print("#", end="")

def der(altura):
    for k in range(i + 1):
        print("#", end="")

while True:
    h = get_int("Height: ")
    if h > 0 and h < 9:
        break

for i in range(h):
    izq(h)
    print("  ", end="")
    der(h)
    print()
