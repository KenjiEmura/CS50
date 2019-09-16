from cs50 import get_float
import math

while True:
    change = get_float("Change owed: ")
    if change > 0:
        break

num25 = int(change / 0.25)
num10 = int(round((change % 0.25), 2) / 0.1)
num5 = int(round(round((change % 0.25), 2) % 0.1, 2) / 0.05)
num1 = int(round(round(round((change % 0.25), 2) % 0.1, 2) % 0.05, 2) / 0.01)

print(num25 + num10 + num5 + num1)