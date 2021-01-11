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
    let search_button = document.querySelector('.search-field button')
    let array = [search_input_field, search_button].forEach( element => {
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