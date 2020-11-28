document.addEventListener('DOMContentLoaded',() => {

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Like button functionality
    const likes = document.querySelectorAll('.like svg').forEach( like => {
        like.addEventListener("click", () => {
            console.log(like.parentNode.parentNode.querySelector('input').value);
            fetch('like', {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    message: 'yeyyyy'
                })
            }).then(response => response.json())
            .then(result => {
                console.log(result)
            })
        });

    });

})