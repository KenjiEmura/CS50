document.addEventListener('DOMContentLoaded',() => {

    const likes = document.querySelectorAll('.like').forEach( like => {
        like.addEventListener("click", () => {
            console.log(like.parentNode.querySelector('input').value);
        });    

    });

})