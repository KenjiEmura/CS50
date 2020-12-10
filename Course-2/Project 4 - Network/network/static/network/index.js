document.addEventListener('DOMContentLoaded',() => {

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]');

    if ( csrftoken ) {
        // Like button functionality
        const likes = document.querySelectorAll('.like svg, .unlike svg').forEach( like => {
            like.addEventListener("click", () => {
                let id = like.parentNode.parentNode.querySelector('input').value;
                fetch('like', {
                    method: 'PUT',
                    headers: {'X-CSRFToken': csrftoken.value},
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
    }


    document.querySelectorAll('.post-container .edit').forEach( edit => {

        // Store the elements on variables
        let post_id = edit.parentNode.querySelector('input').value;
        let form_container = edit.parentNode.querySelector('.form');
        let post_body = edit.parentNode.querySelector('p.post-body');
        let text_area = form_container.querySelector('textarea');
        let submit_button = form_container.querySelector('button');

        // Show/Hide the 'Edit post' form functionality
        edit.addEventListener('click', () => {
            if ( form_container.style.display == 'none' ) {
                text_area.value = post_body.innerHTML;
                form_container.style.display = 'block';
                post_body.style.display = 'none';
                edit.innerHTML = 'Close';
            } else {
                text_area.value = post_body.innerHTML;
                form_container.style.display = 'none';
                post_body.style.display = 'block';
                edit.innerHTML = 'Edit post';
            }
        });


        text_area.addEventListener('keypress', e => {
            if ( e.key === 'Enter') {
                submit()
            }
        });
        

        submit_button.addEventListener('click', () => {
            submit()
        });
        

        function submit() {
            fetch('/edit_post/'+post_id, {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken.value},
                body: JSON.stringify({
                    'post_content': text_area.value,
                })
            })
            .then(response => response.json())
            .then( result => {
                console.log(result);
                text_area.value = result.new_post_content
                post_body.innerHTML = result.new_post_content
                form_container.style.display = 'none';
                post_body.style.display = 'block';
                edit.innerHTML = 'Edit post';
            });
        }

    });
    

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