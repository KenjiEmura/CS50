document.addEventListener("DOMContentLoaded", () => {
	// Django Authentification Token
	const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]");


    // TEST REQUEST INFORMATION HERE:

    let stockSymbol = 'fb'
    let stockName = 'sadfasdfs'
    let stockPrice = 210
    let stockQty = 5


	document.querySelector("button").addEventListener("click", () => {
		fetch("API/buy-stock", {
			method: "POST",
			headers: { "X-CSRFToken": csrftoken.value },
			body: JSON.stringify({
				symbol: stockSymbol,
				name: stockName,
				price: stockPrice,
				qty: stockQty,
			}),
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				location.reload();
			});
	});
});
