#include <stdio.h>
#include <math.h>
#include <cs50.h>

int main(void)
{
    float change;
    int convertedChange;
    int coinType[4] = { 25, 10, 5, 1 };

    int coinCounter = 0;

    // Get user input and validate it
    change = get_float("Change owed: ");
    while (change < 0)
    {
        change = get_float("Change owed: ");
    }

    convertedChange = (int)round(change * 100);

    for (int i = 0; i < sizeof coinType; i++)
    {
        coinCounter = coinCounter + floor(convertedChange / coinType[i]);
        convertedChange = convertedChange % coinType[i];
        if (convertedChange < 1)
        {
            break;
        }
    }

    printf("%i\n", coinCounter);

}