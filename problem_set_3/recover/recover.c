// Recover pictures from a "damaged" USB memory.

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    // Check if the command line arguments were inputted
    if (argc != 2)
    {
        fprintf(stderr, "Usage: ./recover card.raw\n");
        return 1;
    }
    
    FILE *inptr = fopen(argv[1], "r");

    if (inptr == NULL)
    {
        fprintf(stderr, "Could not open %s.\n", argv[1]);
        return 2;
    }
    
    unsigned char *buffer = malloc(512);
    int search = 0;  // 0 means "searching for file beginning" and 1 means "writing"
    FILE *newjpg;
    char newfilename[8];
    
    while (fread(buffer, 512, 1, inptr))
    {
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
        {
            
            if (search > 0)
            {
                fclose(newjpg);
            }

            sprintf(newfilename, "%03i.jpg", search);
            
            newjpg = fopen(newfilename, "w");
            
            if (newjpg == NULL)
            {
                fclose(inptr);
                free(buffer);
                fprintf(stderr, "Could not create output JPG %s", newfilename);
                return 3;
            }
            
            search++;
        }
        
        if (!search)
        {
            continue;
        }
        
        fwrite(buffer, 512, 1, newjpg);
        
    }
    
    free(buffer);
    fclose(inptr);
    fclose(newjpg);
    return 0;
}
