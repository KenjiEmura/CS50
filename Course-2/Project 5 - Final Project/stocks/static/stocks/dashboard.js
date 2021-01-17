document.addEventListener('DOMContentLoaded',() => {

    // Django Authentification Token
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]');

    // Dashboard Indicators
    let cash = document.querySelector('#cash')
    let stocks = document.querySelector('#stocks')
    let net_worth = document.querySelector('#net-worth')
    
    // Initialize the total stock valuation to 0
    let total_stock_valuation = 0

    // This is going to be used to parse and format the values to USD currency
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });


    // Hover effect for the search bar
    let search_input_field = document.querySelector('.search-field input')
    let search_button = document.querySelector('.search-field button');
    [search_input_field, search_button].forEach( element => {
        element.addEventListener('mouseenter', () => {
            search_input_field.classList.add('search-field-hovered')
            search_button.classList.add('search-field-hovered')
        })
        element.addEventListener('mouseleave', () => {
            if (document.activeElement != search_input_field) {
                search_input_field.classList.remove('search-field-hovered')
                search_button.classList.remove('search-field-hovered')
            }
        })
    })

    // Adding the 'submit' functionality when pressing enter on the input field to submit the data
    search_input_field.addEventListener('keypress', e => {
        if ( e.key === 'Enter') {

            // Select elements
            let buyStockContainer = document.querySelector('#buy-stock-container')
            let unitaryStockPriceResult = buyStockContainer.querySelector('div h2')
            let buyStockQty = buyStockContainer.querySelector('div input')
            let totalPurchaseContainer = buyStockContainer.querySelector('#buy-stock-totals')
            let purchaseTotal = totalPurchaseContainer.querySelector('.purchase-total')

            // Hide the 'Total Purchase container' by default
            totalPurchaseContainer.style.display = 'none'

            // Make the API request to the third party service
            fetch('https://sandbox.iexapis.com/stable/stock/' + search_input_field.value + '/quote/?token=Tpk_75116a62e1304e8fb75ddc762d1db3e3')
            .then( response => {
                console.log(response.json)
                return response.json()
            })
            .then( result => {
                // Unhide the h2 element and print the unitary price result using the response
                buyStockContainer.style.display = 'block';
                unitaryStockPriceResult.innerHTML = result.companyName + "'s stock price is: <span>" + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.latestPrice) + '</span>';
                
                // When the input field is changed or clicked, calculate the total value of the purchase using the unitary stock price and the total number of stocks that the user wants to buy
                ['change', 'click'].forEach( event => {
                    buyStockQty.addEventListener(event , () => {
                        // If the user is not buying any stocks, hide the Total Purchase Container
                        if (buyStockQty.value == 0) {
                            totalPurchaseContainer.style.display = 'none'
                        // Else, show the container and update the total purchase displayed value
                        } else {
                        let total = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(buyStockQty.value * result.latestPrice)
                        purchaseTotal.innerHTML = total
                        totalPurchaseContainer.style.display = 'flex'
                        }
                    })
                })
            })
        }
    })


    // Add shadow when the input field of the search bar is focused
    search_input_field.addEventListener('focus', () => {
        search_input_field.classList.add('search-field-hovered')
        search_button.classList.add('search-field-hovered')
    })
    search_input_field.addEventListener('blur', () => {
        search_input_field.classList.remove('search-field-hovered')
        search_button.classList.remove('search-field-hovered')
    })



    // Traverse every row of the stocks table
    const tablerow = document.querySelectorAll('.stock-info').forEach( row => {

        // Select each piece of data from the table
        let stock_id = row.querySelector('input.stock-id').value
        let stock_qty = row.querySelector('.qty').innerHTML
        let stock_price = row.querySelector('.price')
        let stock_total_price = row.querySelector('.total-price')
        let sell_price = row.querySelector('input.set-sell-price')

        // Add the fetch functionality to the "Set" button
        let button = row.querySelector('#button')
        button.addEventListener('click', () => {
            button.classList.add('onclic')
            fetch('API/set_sell_stock_price', {
                method: 'POST',
                headers: {'X-CSRFToken': csrftoken.value},
                body: JSON.stringify({
                    stock_id: stock_id,
                    sell_price: sell_price.value,
                })
            })
            .then( response => {
                if ( response.ok ) {
                    setTimeout( () => {
                        button.classList.remove('onclic')
                        button.classList.add('validate')
                        setTimeout( () => {
                            button.classList.remove('validate')
                        }, 1000)
                    }, 1000)
                } else {
                    // Put here what should happen if the response is not "ok"
                }
                return response.json()
            })
            .then( result => {
                // console.log(result)
            })
        })
            

        
        // Select the "for sale" checkbox and input field which contains the information that we got from the server
        let check_box = row.querySelector('[type="checkbox"]#for-sale')
        let for_sale = Boolean(row.querySelector('[type="hidden"]#for-sale').value)

        
        // Check if the stock is for sale or not and apply the corresponding updates to the DOM using the forSale() function
        forSale(for_sale)
        if ( for_sale ) {
            check_box.checked = true
        } else {
            check_box.checked = false
        }


        // Add functionality to the 'for sale' and 'not for sale' toggle switch
        check_box.addEventListener('click', () => {
            forSale(check_box.checked)
            fetch('API/update_for_sale', {
                method: 'POST',
                headers: {'X-CSRFToken': csrftoken.value},
                body: JSON.stringify({
                    stock_id: stock_id,
                    for_sale: check_box.checked,
                })
            })
            .then( response => response.json() )
            .then( result => {
                // console.log(result)
            })
        })


        // Check if the stock is for sale or not for sale
        function forSale( isForSale) {

            
            if ( isForSale ) {
                sell_price.disabled = false
                sell_price.classList.remove('disabled')
                button.disabled = false
                button.className = ''
            } else {
                sell_price.disabled = true
                sell_price.classList.add('disabled')
                button.disabled = true
                button.className = 'disabled'
            }
        }


        // Calculate the total price of the stocks and print that value in the table
        let total_stock_price = stock_price.innerHTML * stock_qty
        stock_total_price.innerHTML = formatter.format(total_stock_price)

        // Format the unitary stock price into USD currency
        stock_price.innerHTML = formatter.format(stock_price.innerHTML)

        // Add this stock's total price to the user's total stock valuation
        total_stock_valuation += total_stock_price

    });


    // Update the totals being display to the user
    stocks.innerHTML = formatter.format(total_stock_valuation)
    net_worth.innerHTML = formatter.format(total_stock_valuation + parseInt(cash.innerHTML))
    cash.innerHTML = formatter.format(parseInt(cash.innerHTML))

});