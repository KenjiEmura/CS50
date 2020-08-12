// This program runs a runoff election, the complete specifications can be found in the next link https://cs50.harvard.edu/x/2020/psets/3/runoff/

#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <math.h>

// Max voters and candidates
#define MAX_VOTERS 100
#define MAX_CANDIDATES 9

// preferences[i][j] is jth preference for voter i
int preferences[MAX_VOTERS][MAX_CANDIDATES];

// Candidates have name, vote count, eliminated status
typedef struct
{
    string name;
    int votes;
    bool eliminated;
}
candidate;

// Array of candidates
candidate candidates[MAX_CANDIDATES];

// Numbers of voters and candidates
int voter_count;
int candidate_count;

// Function prototypes
bool vote(int voter, int rank, string name);
void tabulate(void);
bool print_winner(void);
int find_min(void);
bool is_tie(int min);
void eliminate(int min);

int main(int argc, string argv[])
{
    // Check for invalid usage
    if (argc < 2)
    {
        printf("Usage: runoff [candidate ...]\n");
        return 1;
    }

    // Populate array of candidates
    candidate_count = argc - 1;
    if (candidate_count > MAX_CANDIDATES)
    {
        printf("Maximum number of candidates is %i\n", MAX_CANDIDATES);
        return 2;
    }
    for (int i = 0; i < candidate_count; i++)
    {
        candidates[i].name = argv[i + 1];
        candidates[i].votes = 0;
        candidates[i].eliminated = false;
    }

    voter_count = get_int("Number of voters: ");
    if (voter_count > MAX_VOTERS)
    {
        printf("Maximum number of voters is %i\n", MAX_VOTERS);
        return 3;
    }

    // Keep querying for votes
    for (int i = 0; i < voter_count; i++)
    {

        // Query for each rank
        for (int j = 0; j < candidate_count; j++)
        {
            string name = get_string("Rank %i: ", j + 1);

            // Record vote, unless it's invalid
            if (!vote(i, j, name))
            {
                printf("Invalid vote.\n");
                return 4;
            }
        }

        //-------PRINT THE PREFERENCE MATRIX
        // printf("\nValue:");
        // for (int a = 0; a < candidate_count; a++)
        //     printf("  %d", a);
        // printf("\n");
        // for (int b = 0; b < voter_count; b++)
        //     {
        //         printf("   #%d: ", b);
        //         for (int c = 0; c < candidate_count; c++)
        //         {
        //             printf("[%d]", preferences[b][c]);
        //         }
        //         printf("\n");
        //     }
        //-------END OF SECTION OF PRINTING THE PREFERENCE MATRIX


        printf("\n");
    }

    // Keep holding runoffs until winner exists
    while (true)
    {
        // Calculate votes given remaining candidates
        tabulate();

        // Check if election has been won
        bool won = print_winner();
        if (won)
        {
            break;
        }

        // Eliminate last-place candidates
        int min = find_min();
        bool tie = is_tie(min);

        // If tie, everyone wins
        if (tie)
        {
            for (int i = 0; i < candidate_count; i++)
            {
                if (!candidates[i].eliminated)
                {
                    printf("%s\n", candidates[i].name);
                }
            }
            break;
        }

        // Eliminate anyone with minimum number of votes
        eliminate(min);

        // Reset vote counts back to zero
        for (int i = 0; i < candidate_count; i++)
        {
            candidates[i].votes = 0;
        }
    }
    return 0;
}

// Record preference if vote is valid
bool vote(int voter, int rank, string name)
{
    bool validCandidate = false;
    for (int i = 0; i < candidate_count; i++)
    {
        if (strcmp(name, candidates[i].name) == 0)
        {
            validCandidate = true;
            preferences[voter][rank] = i;
        }
    }
    return validCandidate;
}

// Tabulate votes for non-eliminated candidates
void tabulate(void)
{
    for (int i = 0; i < voter_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {
            while (true)
            {
                if (candidates[preferences[i][j]].eliminated)
                {
                    j++;
                } else {
                    break;
                }
            }
            candidates[preferences[i][j]].votes++;
            break;
        }
    }
    return;
}

// Print the winner of the election, if there is one
bool print_winner(void)
{
    int threshold = ( voter_count + 1) / 2;
    bool winnerExists = false;
    for (int i = 0; i < candidate_count; i++)
    {
        if (candidates[i].votes > threshold)
        {
            printf("%s\n", candidates[i].name);
            winnerExists = true;
        }
    }
    return winnerExists;
}

// Return the minimum number of votes any remaining candidate has
int find_min(void)
{
    int min = voter_count;
    for (int i = 0; i < candidate_count; i++)
    {
        if (candidates[i].eliminated)
            continue;
        if (candidates[i].votes < min)
            min = candidates[i].votes;
    }
    return min;
}

// Return true if the election is tied between all candidates, false otherwise
bool is_tie(int min)
{
    bool isTie = false;
    for (int i = 0; i < candidate_count; i++)
    {
        if (candidates[i].votes != min)
        {
            if (candidates[i].eliminated)
            {
                continue;
            } else {
                return false;
            }
        }
    }
    return true;
}

// Eliminate the candidate (or candidiates) in last place
void eliminate(int min)
{
    for (int i = 0; i < candidate_count; i++)
    {
        if (candidates[i].votes == min)
            candidates[i].eliminated = true;
    }
    return;
}