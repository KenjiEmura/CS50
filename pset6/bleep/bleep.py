from cs50 import get_string
from sys import argv

if len(argv) != 2:
    print("Usage: python bleep.py dictionary")
    exit(1)

def main(argv):

    string = get_string("What message would you like to censor?\n")
    string = list(string)
    word = ""
    index = 0

    for i in range(len(string)):
        if ord(string[i]) == 32:
            for j in range(index, i):
                word += string[j]
                word = word.lower()

            if word in open(argv).read():
                for j in range(index, i):
                    string[j] = "*"

            index = i + 1
            word = ""

        if i == len(string) - 1:
            for j in range(index, i + 1):
                word += string[j]
                word = word.lower()

            if word in open(argv).read():
                for j in range(index, i + 1):
                    string[j] = "*"

    string = ''.join(string)

    print(string)

if __name__ == "__main__":
    main(argv[1])
