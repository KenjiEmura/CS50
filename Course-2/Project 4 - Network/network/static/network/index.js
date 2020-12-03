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
        let post_id = edit.parentNode.querySelector('input').value;
        let form_container = edit.parentNode.querySelector('form');
        let post_body = edit.parentNode.querySelector('p.post-body');
        let text_area = form_container.querySelector('textarea').value = post_body.innerHTML;
        edit.addEventListener('click', () => {
            if ( form_container.style.display == 'none' ) {
                form_container.style.display = 'block';
                post_body.style.display = 'none';
                edit.innerHTML = 'Close';
            } else {
                form_container.style.display = 'none';
                post_body.style.display = 'block';
                edit.innerHTML = 'Edit';
            }
        });

    });
    
    
    // onsubmit = () => {
    //     const form_recipients = document.querySelector('#compose-recipients').value;
    //     const form_subject = document.querySelector('#compose-subject').value;
    //     const form_body = document.querySelector('#compose-body').value;

    //     fetch('/emails', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             recipients: form_recipients,
    //             subject: form_subject,
    //             body: form_body
    //         })
    //     })
    //     .then(loadSent);
    //     return false;
    // }

})