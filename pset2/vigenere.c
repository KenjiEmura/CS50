#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

int ARG = 1;
int j = 0;
int x, k;
string plain, cipher;
int shift(char c);

int main(int argc, string argv[])
{
    if (argc != ARG + 1)
    {
        printf("Usage: ./vigenere keyword\n");
        return 1;
    }
    for (int i = 0, n = strlen(argv[ARG]); i < n; i++)
    {
        if (isalpha(argv[ARG][i]))
        {
        }
        else
        {
            printf("Usage: ./vigenere keyword\n");
            return 1;
        }
    }
    
    x = strlen(argv[ARG]);
    
    plain = get_string("plaintext:  ");
    
    int n = strlen(plain);
    
    cipher = plain;

    for (int i = 0 ; i < n; i++)
    {
        if (plain[i] >= 65 && plain[i] <= 90)
        {
            k = shift(argv[ARG][j]);
            cipher[i] = (plain[i] - 65 + k) % 26 + 65;
            if (j < (x - 1))
            {
                j++;
            }
            else
            {
                j = 0;
            }
        }
        else if (plain[i] >= 97 && plain[i] <= 122)
        {
            k = shift(argv[ARG][j]);
            cipher[i] = (plain[i] - 97 + k) % 26 + 97;
            if (j < (x - 1))
            {
                j++;
            }
            else
            {
                j = 0;
            }
        }
        else
        {
            cipher[i] = plain[i];
        }
    }
    printf("ciphertext: %s\n", cipher);
}


int shift(char c)
{
    int shifted = 0;
    if (c >= 65 && c <= 90)
    {
        shifted = c - 65;
        return shifted;
    }
    else if (c >= 97 && c <= 122)
    {
        shifted = c - 97;
        return shifted;
    }
    else
    {
        return c;
    }
}
