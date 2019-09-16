#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

int ARG = 1;
int k;
string plain, cipher;

int main(int argc, string argv[])
{
    if (argc != ARG + 1)
    {
        printf("Usage: ./caesar key\n");
        return 1;
    }
    for (int i = 0, n = strlen(argv[ARG]); i < n; i++)
    {
        if (isdigit(argv[ARG][i]))
        {
            //printf("Esto sí es un dígito: %c\n", argv[ARG][i]);
        }
        else
        {
            printf("Usage: ./caesar key\n");
            return 1;
        }
    }
    
    k = atoi(argv[ARG]);
    
    plain = get_string("plaintext:  ");
    
    int n = strlen(plain);
    
    cipher = plain;
    
    for (int i = 0 ; i < n; i++)
    {
        if (plain[i] >= 65 && plain[i] <= 90)
        {
            cipher[i] = (plain[i] - 65 + k) % 26 + 65;
        }
        else if (plain[i] >= 97 && plain[i] <= 122)
        {
            cipher[i] = (plain[i] - 97 + k) % 26 + 97;
        }
        else
        {
            cipher[i] = plain[i];
        }
    }
    
    printf("ciphertext: %s\n", cipher);
}
