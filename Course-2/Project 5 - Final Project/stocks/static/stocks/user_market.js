document.addEventListener("DOMContentLoaded", () => {
  // Django Authentification Token
  const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]");

  console.log("The JS file was loaded successfully");

  document.querySelectorAll(".accordion__button").forEach((button) => {
    button.addEventListener("click", () => {
      const accordionContent = button.nextElementSibling;
      const wholeAccordion = button.parentElement;
      wholeAccordion.classList.toggle("accordion--active");
      console.log(wholeAccordion);
      button.classList.toggle("accordion__button--active");
      if (button.classList.contains("accordion__button--active")) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      } else {
        accordionContent.style.maxHeight = 0;
      }
    });
  });
});
