document.addEventListener('DOMContentLoaded',() => {

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Like button functionality
    const likes = document.querySelectorAll('.like svg, .unlike svg').forEach( like => {
        like.addEventListener("click", () => {
            let id = like.parentNode.parentNode.querySelector('input').value;
            fetch('like', {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    id: id,
                })
            })
            .then(response => response.json())
            .then( result => {
                let likeDiv = like.parentNode.parentNode.querySelector('.like')
                let unlikeDiv = like.parentNode.parentNode.querySelector('.unlike')
                let likeCount = like.parentNode.parentNode.querySelector('#like-count')
                if ( likeDiv.style.display == 'inline' ) {
                    likeDiv.style.display = 'none';
                    unlikeDiv.style.display = 'inline';
                    likeCount.innerHTML++
                } else {
                    likeDiv.style.display = 'inline';
                    unlikeDiv.style.display = 'none';
                    likeCount.innerHTML--
                }
                
            })
        });

    });

})