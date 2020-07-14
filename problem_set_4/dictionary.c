// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "dictionary.h"

// Represents number of buckets in a hash table
#define N 26

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;

// Represents a hash table
node *hashtable[N];

// Hashes word to a number between 0 and 25, inclusive, based on its first letter
unsigned int hash(const char *word)
{
    return tolower(word[0]) - 'a';
}

// Loads dictionary into memory, returning true if successful else false
bool load(const char *dictionary)
{
    // Initialize hash table
    for (int i = 0; i < N; i++)
    {
        hashtable[i] = NULL;
    }

    // Open dictionary
    FILE *file = fopen(dictionary, "r");
    if (file == NULL)
    {
        unload();
        return false;
    }

    // Buffer for a word
    char wordbuf[LENGTH + 1];

    // Insert words into hash table
    while (fscanf(file, "%s", wordbuf) != EOF)
    {
        node *new_node = malloc(sizeof(node));

        if (new_node == NULL)
        {
            unload();
            return false;
        }

        int key = hash(wordbuf);

        strcpy(new_node->word, wordbuf);
        new_node->next = hashtable[key];

        hashtable[key] = new_node;
    }

    // Close dictionary
    fclose(file);

    // Indicate success
    return true;
}

// Returns number of words in dictionary if loaded else 0 if not yet loaded
unsigned int size(void)
{
    node *cursor = NULL;

    int num_words = 0;

    for (int i = 0; i < N; i++)
    {
        cursor = hashtable[i];

        while (cursor)
        {
            num_words++;

            cursor = cursor->next;
        }

    }

    return num_words;
}

// Returns true if word is in dictionary else false
bool check(const char *word)
{
    char wordcheck[LENGTH + 1] = "Malparido programa de mierda";

    strcpy(wordcheck, word);

    for (int i = 0; i < LENGTH; i++)
    {
        wordcheck[i] = tolower(word[i]);
    }

    int key = hash(wordcheck);

    node *cursor = hashtable[key];

    while (cursor)
    {
        if (strcmp(wordcheck, cursor->word) == 0)
        {
            return true;
        }

        cursor = cursor->next;
    }

    return false;
}

// Unloads dictionary from memory, returning true if successful else false
bool unload(void)
{
    node *cursor, *temp = NULL;

    for (int i = 0; i < N; i++)
    {

        cursor = hashtable[i];

        while (cursor)
        {
            temp = cursor;
            cursor = cursor->next;
            free(temp);
        }
    }

    return true;
}
