document.addEventListener('DOMContentLoaded',() => {

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Like button
    const likes = document.querySelectorAll('.like svg, .unlike svg').forEach( like => {
        like.addEventListener("click", () => {
            let id = like.parentNode.parentNode.querySelector('input').value;
            
            fetch('../like', {
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

    // Follow/Unfollow Button
    const follow = document.querySelector('#follow')
        if ( follow ) {

        follow.addEventListener( "click", () => {
            profile_name = document.querySelector('#profile-name').value
            fetch( '../follow', {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    'profile_name': profile_name,
                })
                })
                .then(response => response.json())
                .then( result => {
    
                    let button = document.querySelector('#follow')
                    let followers = document.querySelector('.profile-info.followers h4')
    
                    if ( result.following ) {
                        button.innerHTML = 'Unfollow'
                        button.className = 'btn btn-sm btn-outline-secondary'
                        followers.innerHTML++
                    } else {
                        button.innerHTML = 'Follow'
                        button.className = 'btn btn-sm btn-primary'
                        followers.innerHTML--
                    }
    
                })
        })
    }
})