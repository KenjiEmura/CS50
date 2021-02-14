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
    const stock_id = row.querySelector("input.stock-id").value;
    const seller_id = row.querySelector("input.seller-id").value;
    const stock_price = row.querySelector(".price").innerHTML;
    const stock_qty = row.querySelector(".purchase .purchase-qty");
    const purchase_button = row.querySelector("#purchase");

    purchase_button.addEventListener("click", () => {
      console.log("Stock Price: ", parseFloat(stock_price));
      console.log("Stock Qty: ", parseInt(stock_qty.value));
      console.log("Total: ", parseFloat(stock_price) * parseInt(stock_qty.value));

    });

    // row.addEventListener("click", () => {
    //   console.log("Stock Id: " + stock_id + ", seller id: " + seller_id);
    // });
  });
});
