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


    const page = document.querySelector('input#page').value;
    const total_pages = document.querySelector('input#total_pages').value;

    function create_pagination(container) {

        // Create the pagination <ul>
        let ul = document.createElement('ul');
        ul.setAttribute("class", 'pagination');

        container.insertAdjacentElement('beforeend', ul);

        for (let step = 1; step <= total_pages; step++) {

            // Create the <li> element
            let li = document.createElement('li');
            li.className = "page-item";

            // Check if the current step matches the current page
            if (step == page) {
                li.className = 'page-item active';
            } else {
                li.className = 'page-item';
            }
            
            // Create the <a> element that goes inside the <li> and add the page number
            let a = document.createElement('a');
            a.setAttribute('href', '?page=' + step);
            a.innerHTML = step;
            a.className = 'page-link';

            // Insert the <a> element inside the <li>
            li.insertAdjacentElement('beforeend', a);

            // Insert the <li> element into the <ul>
            ul.insertAdjacentElement('beforeend', li);
        }

    }

    // Select the <div> in which the pagination is going to be inserted
    let pagination_container_top = document.querySelector('div.pagination-container.top');
    let pagination_container_bottom = document.querySelector('div.pagination-container.bottom');
    
    // Check if the elements were created (This means that there is at least one post inside the page) and create the pagination if the condition is true
    if( pagination_container_top ) {
        create_pagination(pagination_container_top);
        create_pagination(pagination_container_bottom);
    }
})