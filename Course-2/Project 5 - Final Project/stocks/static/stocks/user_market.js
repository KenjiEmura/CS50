document.addEventListener("DOMContentLoaded", () => {
  // Django Authentification Token
  const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]");

  document.querySelectorAll(".accordion__button").forEach((button) => {
    button.addEventListener("click", () => {
      const accordionContent = button.nextElementSibling;
      const wholeAccordion = button.parentElement;
      wholeAccordion.classList.toggle("accordion--active");
      button.classList.toggle("accordion__button--active");
      if (button.classList.contains("accordion__button--active")) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      } else {
        accordionContent.style.maxHeight = 0;
      }
    });
  });

  document.querySelectorAll("tr.stock-info").forEach((row) => {
    const stock_name = row.querySelector(".name").innerHTML;
    const stock_symbol = row.querySelector(".symbol").innerHTML;
    const seller_id = row.querySelector("input.seller-id").value;
    const stock_price = row.querySelector(".price").innerHTML;
    const stock_qty = row.querySelector(".purchase .purchase-qty");
    const purchase_button = row.querySelector("#purchase");

    purchase_button.addEventListener("click", () => {
      // console.log("Stock Price: ", parseFloat(stock_price));
      // console.log("Stock Qty: ", parseInt(stock_qty.value));
      // console.log("Total: ", parseFloat(stock_price) * parseInt(stock_qty.value));

      fetch("API/trade-stock", {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken.value },
        body: JSON.stringify({
          symbol: stock_symbol,
          name: stock_name,
          price: stock_price,
          qty: stock_qty.value,
          seller: seller_id,
          transaction_type: "buy",
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          location.reload();
        });
    });

    // row.addEventListener("click", () => {
    //   console.log("Stock Id: " + stock_id + ", seller id: " + seller_id);
    // });
  });
});
