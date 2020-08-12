# Questions

## What's `stdint.h`?

Is a header file that allow us to use several integer type definitions such as uint8_t, uint32_t, int32_t, etc.

## What's the point of using `uint8_t`, `uint32_t`, `int32_t`, and `uint16_t` in a program?

To prevent errors from occuring since the definition of some data types can change sometimes from platform to plaform, this standarizes the definitions of the data types that are going to be used in the program.

## How many bytes is a `BYTE`, a `DWORD`, a `LONG`, and a `WORD`, respectively?

BYTE = 8 bits = 1 byte
DWORD = 32 bits = 4 bytes
LONG = 32 bits = 4 bytes
WORD = 16 bits = 2 bytes

## What (in ASCII, decimal, or hexadecimal) must the first two bytes of any BMP file be? Leading bytes used to identify file formats (with high probability) are generally called "magic numbers."

Decimal: BM
Hexadecimal: 0x424d

## What's the difference between `bfSize` and `biSize`?

bfSize is the size in bytes of the whole file whereas biSize is the number of bytes required by the structure.

## What does it mean if `biHeight` is negative?

Top-down DIB, the top row of the bitmap is the first row in memory, followed by the next row down.

## What field in `BITMAPINFOHEADER` specifies the BMP's color depth (i.e., bits per pixel)?

biBitCount, the value specifies the maximum number of colors that there can be.

## Why might `fopen` return `NULL` in `copy.c`?

If the file doesn't exists.

## Why is the third argument to `fread` always `1` in our code?

Because we are trying to read one pixel at a time

## What value does `copy.c` assign to `padding` if `bi.biWidth` is `3`?

int padding =  (4 - (bi.biWidth * sizeof(RGBTRIPLE)) % 4) % 4 = 3.

## What does `fseek` do?

Moves the position of the pointer.

## What is `SEEK_CUR`?

Is an argument of the fseek function, it moves file pointer position to given location.
