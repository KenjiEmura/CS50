# _The Stock Playground_
### App's Main Goal
In this platform, users will be provided with an interface that will allow them to trade stocks with the platform and also between users while controlling different important aspects of real world stock transactions like selling price, availability, etc. In a nutshell, the main goal of the web application is to maximize the net worth of one's account by trading stocks using the information provided by the third party API [IEX Cloud] provided in previous CS50's courses. Unlike previous projects, _The Stock Playground_ provides an whole new different variety of functionalities, and also allows the user to trade stocks with other users. It is worth clarifying that the transactions made on the platform don't use real money.

### Complexity
The project focuses on rich interactivity through pure JavaScript, so the user can interact with the page in a very fluid way while the App validates and comunicates with the Backend and the third party API (fetch calls) and also updates the interface without the need of reloading the page.

The App also ensures that each transaction is properly stored in the database while at the sametime displays all the subtotals and the totals that the user can consider helpful in order to see the overall progress of the tradings. Also each edge case was taken into account to ensure the App won't crash and to give the user an easy-to-understand usability.

In addition to the regular tools and functions we have been using to build all the projects so far, here is a list of the items I consider that contribute to the project meeting the requirements of distinction and complexity:
- Virtual Environment (pipenv)
- SCSS for styling (node)
- CSS Grid, Flexbox and transitions
- Adding and removing classes conditionally (JavaScript)
- Animations (Javascript and CSS)
- Chaining Filters on DB queries (django)
- Currency Formatting (JavaScript)
- Data format validation (Python and JavaScript)
- Deep Object handling (Python and JavaScript)
- Python (Requests)

### Differentiator files
###### ``helpers.py``
Since the process of getting the subtotals and the totals required to parse all the individual transactions made by each user on each different stock, two helper functions were created: ```update_user_total_stocks``` and ```fetch_pirces_from_API```.
Inside this two big functions, lies the logic that ensures that the user gets the consolidated information of the overall status of the owned stocks. 

###### ``dashboard.js``
This is the heart of the control center of the App. From this file all the API calls regarding the prices of the stocks are made. Also the interactivity of the dashboard (home page) is controlled from here. These are some of the main functions that we can find on this file:
- Gather the information about all the stocks and update the User's Totals
- Add functionality and conditional styling to the search bar
- Display conditionally help messages regarding the query and purchase of stocks
- Controlls the selling behaviour of each stock separately

###### ``user_market.js``
In this file, an interactive and conditional accordion was implemented. This accordion shows all the available stocks that a users has put up for sale and its respective price (pirce set up by each user, not the market price), also the **Buy Stock between users** functionality was implemented.

### Additional Requirements
In order to use the App, we need to create a ```keys.py``` file in which the API key will held under the variable name ```IEX_API_TOKEN```, we also need the external dependency ```requests``` which can be easily installed to the virtual environment by using the next command:
```
pipenv install requests
```

### Special thanks
Thanks to all the staff of the CS50 program, as an annectdote, I would like to share that just one month ago (Jan/2021) I got my first job as a frontend engineer in an IT company here in Japan, I don't think words are enough to show you how thankkful I am with all of you guys, it has been a journey full of joy, feeling of achievement and I won't lie, also a lot of frustration 😅, but in general, I feel that I'm ready to face this new challenge that I have, I think I learned how to learn (if that makes any sense) and realised that in order to be a developer, that is maybe one of the most important skills that you can have. Thanks again and I definitely continue exploring and learning from your amazing content. Best regards.

Kenji Emura
kenjiemura@gmail.com

[IEX Cloud]: <https://iexcloud.io/>