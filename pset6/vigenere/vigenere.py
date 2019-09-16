from cs50 import get_string
from sys import argv, exit

if len(argv) != 2:
    print("Usage: ./vigenere k")
    exit(1)
else:
    for i in range(len(argv[1])):
        if not argv[1][i].isalpha():
            print("Usage: ./vigenere k")
            exit(1)

key = argv[1]
j = 0

plain = get_string("plaintext: ")
cipher = plain
cipher = list(cipher)

for i in range(len(plain)):

    if 65 <= ord(plain[i]) <= 90:
        cipher[i] =chr((ord(plain[i]) + (ord(key.upper()[j]) - 65) - 65) % 26 + 65)

    elif 97 <= ord(plain[i]) <= 122:
        cipher[i] =chr((ord(plain[i]) + (ord(key.upper()[j]) - 65) - 97) % 26 + 97)

    else:
        cipher[i] = plain[i]
        continue

    if j < len(key) - 1:
        j += 1
    else:
        j = 0

cipher = ''.join(cipher)

print("ciphertext: " + cipher)