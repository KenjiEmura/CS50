#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <math.h>

int main(void)
{
    string text = get_string("Text: ");
    int length = strlen(text);

    int letters_counter = 0;
    int words_counter = 0;
    int sentences_counter = 0;

    const int space = 32;
    const int comma = 44;
    const int dot = 46;

    for (int i = 0; i < length; i++)
    {
        if ((text[i] > 96 && text[i] < 123) || (text[i] > 64 & text[i] < 91))
        {
            letters_counter++;
        }
        if (text[i] == 33 || text[i] == 46 || text[i] == 63)
        {
            sentences_counter++;
        }
        if (text[i] == 32)
        {
            words_counter++;
        }
    }

    words_counter++;

    // Average letters per 100 words
    float L = ((float) letters_counter / words_counter) * 100;
    // Average sentences per 100 words
    float S = ((float) sentences_counter / words_counter) * 100;

    float index = 0.0588 * L - 0.296 * S - 15.8;

    int converted_index = round(index);

    if (converted_index > 15)
    {
        printf("Grade 16+\n");
    }
    else if (converted_index < 0)
    {
        printf("Before Grade 1\n");
    }
    else
    {
        printf("Grade %i\n", converted_index);
    }

}