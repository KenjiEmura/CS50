// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// A credit card number inputted by the user will be classified as VISA, MasterCard, AMEX or invalid according to the algorithm invented by Hans Peter Luhn of IBM.
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

#include <stdio.h>
#include <cs50.h>

long num;               // User's input
int maxdigits = 16;     // Max number of digits that the program can analize
long divisor = 10;      // This variable will be used to "move" between units, tens, hundreds, tens, etc., it starts in 10 because to get the first module (see line 23)
long mod1, mod2;        // These variables will be used to storage remainders, the mod2 will be used at the end to identify the first to digits of the number along with the first2 variable
int totalsum, digit, digiteven; // These variables will storage the total digit sum, and also the even and odd digits
int first2;             // This variable will be used to get the first 2 digits of the number so we can know if it is a VISA, etc.

int main(void)
{
    num = get_long("Number: ");
    
    for (int i = 0; i < maxdigits; i++)                 // This loop will go throughout the number from right to left
    {
        mod1 = num % divisor;                           // We update de module
        divisor /= 10;                                  // To isolate the digit that we want, we have to reduce the power by one grade
        digit = mod1 / divisor;                         // We store the digit that we are evaluating in this variable
        if (i % 2 != 0)                                 // We check if it is an even or odd number
        {
            digiteven = digit * 2;                      // We multiply the even numbers by 2
            if (digiteven >= 10)                        // Then we evaluate if we got a single or double digit
            {
                totalsum = totalsum + digiteven / 10 + digiteven % 10;  // We "separate" the double digits and add them to the final sum
            }
            else
            {
                totalsum = totalsum + digiteven;        // And normally sum up the single digits
            }
        }
        else
        {
            totalsum = totalsum + digit;                // We sum normally the odd numbers
        }
        divisor *= 100;                                 // Then we move one place to the left, remember that we decreased the power previously, so now we have to recover that and add one more
    }
    
    if (totalsum % 10 != 0)                             // Now it's time to evaluate the total sum, if the modulo 10 is different than 0, then is not a valid number
    {
        printf("INVALID\n");
    }
    else                                                // Else, we have to check if we are dealing with a VISA, MasterCard, etc.
    {
        int breaker = 10;                               // We create a variable that we will use TO GET ONLY the two first digits from left to right
        mod1 = num % divisor;                           // Thanks to the previous for loop, the divisor variable got big enough to check the number from left to right using mod
        mod2 = mod1;                                    // We "backup" the value of mod1 in mod2 for future change comparison (see below) 

        do
        {
            divisor /= 10;                              // We start with a really big mod, but each time, we wil get a smaller mod and we will see when the mod changes, that will tell us that we finally reached the first digit
            mod1 = num % divisor;
            if (mod1 != mod2)                           // When this codition becomes true, that means that we succesfully reached the first digit position from left to right
            {
                first2 = first2 + (mod2 / divisor) * breaker;   // We capture the first digit which corresponds to the "tens" in the first2 variable
                breaker /= 10;                          // We reduce the breaker until it becomes 0, so the first2 variable will only be afected twice
                mod2 = mod1;                            // We update the mod2 for the next comparison
            }
        }
        while (breaker != 0);                           // When the breaker gets to 0, that means we already captured the first 2 digits

        if (first2 == 34 || first2 == 37)               // Finally it's time to see if we are dealing with an American Express card
        {
            printf("AMEX\n");
        }
        else if (first2 >= 51 && first2 <= 55)          // Or a MasterCard
        {
            printf("MASTERCARD\n");
        }
        else if (first2 / 10 == 4)                      // Or a VISA
        {
            printf("VISA\n");
        }
        else                                            // Otherwise the card is invalid
        {
            printf("INVALID\n");
        }

    }
}
