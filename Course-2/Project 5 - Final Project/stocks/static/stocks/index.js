document.addEventListener('DOMContentLoaded',() => {


    console.log('Archivo cargado correctamente')

    const rows = document.querySelectorAll('.stock-info').forEach( row => {

        let stock_symbol = row.querySelector('.symbol').innerHTML
        let stock_qty = row.querySelector('.qty').innerHTML
        let stock_price = row.querySelector('.price').innerHTML
        let stock_total_price = row.querySelector('.total-price')

        stock_total_price.innerHTML = '$' + stock_price * stock_qty

    });

});