document.addEventListener('DOMContentLoaded',() => {

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]');

    let cash = document.querySelector('#cash')
    let stocks = document.querySelector('#stocks')
    let net_worth = document.querySelector('#net-worth')
    
    let total_stock_valuation = 0

    // This is going to be used to parse and format the values to USD currency
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });


    // Traverse every row of the stocks table
    const tablerow = document.querySelectorAll('.stock-info').forEach( row => {

        // Store each piece of data
        let stock_id = row.querySelector('input.stock-id').value
        let stock_qty = row.querySelector('.qty').innerHTML
        let stock_price = row.querySelector('.price')
        let stock_total_price = row.querySelector('.total-price')
        let sell_price = row.querySelector('input.set-sell-price')
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
                        validate()
                    }, 1000)
                } else {
                    // Put here what should happen if there is an error
                }
                return response.json()
            })
            .then( result => {
                // console.log(result)
            })
        })
            
        function validate() {
            button.classList.remove('onclic')
            button.classList.add('validate');
            setTimeout( () => {
                button.classList.remove('validate')
            }, 1000)
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


    // function set_sell_stock_price(parameter) {
    function test(parameter) {
        console.log(parameter)
    }


});