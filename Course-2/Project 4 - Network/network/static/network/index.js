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
    


})