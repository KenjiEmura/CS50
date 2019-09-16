from cs50 import get_int
import math

def convert(list):
    # Converting integer list to string list
    s = [str(i) for i in list]
    # Join list items using join()
    newnumber = int("".join(s))
    return(newnumber)

def checklen(x):
    if x < 10**13 or x > 10 **16:
        return 1

num = get_int("Number: ")

array = [int(x) for x in str(num)]

array.reverse()

suma = 0

for a in range(1, len(array), 2):
    subarray = [int(x) for x in str(array[a]*2)]
    for b in range(len(subarray)):
        suma += subarray[b]

for a in range(0, len(array), 2):
    suma += array[a]

array.reverse()

firstdigitstocheck = [array[0], array[1]]

verify = convert(firstdigitstocheck)

master = [51, 52, 53, 54, 55]
american = [34, 37]

if checklen(num) == 1:
    print("INVALID")
else:
    if suma % 10 == 0:
        if verify in master:
            print("MASTERCARD")
        elif verify in american:
            print("AMEX")
        elif math.floor(verify/10) == 4:
            print("VISA")
        else:
            print("INVALID")
    else:
        print("INVALID")