document.addEventListener('DOMContentLoaded',() => {


    console.log('Archivo cargado correctamente')

    const rows = document.querySelectorAll('.stock-info').forEach( row => {

        let stock_symbol = row.querySelector('.symbol').innerHTML
        let stock_qty = row.querySelector('.qty').innerHTML
        let stock_price = row.querySelector('.price').innerHTML
        let stock_total_price = row.querySelector('.total-price')

        stock_total_price.innerHTML = '$' + stock_price * stock_qty

        row.addEventListener("click", () => {
            console.log(stock_symbol.innerHTML);
        });
    });


    // fetch('/edit_post/'+post_id, {
    //     method: 'PUT',
    //     headers: {'X-CSRFToken': csrftoken.value},
    //     body: JSON.stringify({
    //         'post_content': text_area.value,
    //     })
    // })
    // .then(response => response.json())
    // .then( result => {
    //     text_area.value = result.new_post_content
    //     post_body.innerHTML = result.new_post_content
    //     form_container.style.display = 'none';
    //     post_body.style.display = 'block';
    //     edit.innerHTML = 'Edit post';
    // });


});