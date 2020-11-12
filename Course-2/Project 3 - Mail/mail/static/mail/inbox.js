document.addEventListener('DOMContentLoaded',() => {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', loadInbox );
    document.querySelector('#sent').addEventListener('click', loadSent );

    document.querySelector('#archived').addEventListener('click', loadArchived );
    document.querySelector('#compose').addEventListener('click', compose_email);

    document.querySelector('#compose-form').onsubmit = () => {
        const form_recipients = document.querySelector('#compose-recipients').value;
        const form_subject = document.querySelector('#compose-subject').value;
        const form_body = document.querySelector('#compose-body').value;

        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: form_recipients,
                subject: form_subject,
                body: form_body
            })
        })
        .then(loadSent);
        return false;
    }

    // By default, load the inbox
    loadInbox();

});



function compose_email() {
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#view-email').style.display = 'none';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}


with function reply_mail(recipient, subject, body) {
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#view-email').style.display = 'none';

    // Pre populate composition fields
    document.querySelector('#compose-recipients').value = recipient;
    document.querySelector('#compose-subject').value = subject;
    document.querySelector('#compose-body').value = body;

}


function load_mailbox() {
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#view-email').style.display = 'none';
}



function loadInbox() {
    load_mailbox();

    // Get the data from the API
    fetch('/emails/inbox', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        let table_headers = [
            "<th class='sender-col'>Sender</th>",
            "<th class='subject-col'>Subject</th>",
            "<th class='timestamp-col'>Date</th>"
        ];

        // Show the mailbox name and create the table inside the <div id="emails-view">
        document.querySelector('#emails-view').innerHTML = "<h3>Inbox</h3>";
        document.querySelector('#emails-view').insertAdjacentHTML('beforeend', `<table class="inbox-table"><thead>${table_headers.join('')}</thead><tbody></tbody></table>`);

        // Populate the table
        result.forEach( rowInfo => {
            // Create a new row in the table
            const row = document.querySelector('tbody').insertRow();
            row.className = 'mail-row';

            // Add styles to the 'read' and 'unread' messages
            if (rowInfo.read) {
                row.style.cssText = 'color: #808080; font-weight: 400; background-color: #f5f5f5;';
            } else {
                row.style.cssText = 'color: #000000; font-weight: 700; background-color: #ffffff;';
            }

            // Make the entire row clickable
            row.addEventListener("click", () => {
                document.querySelector('#view-email').innerHTML = '<h3>Inbox</h3>';
                viewMail(rowInfo);
            });

            // Sender Column
            let sender = row.insertCell();
            sender.className = 'sender-col';
            sender.innerHTML = rowInfo.sender;

            // Subject Column
            let subject = row.insertCell();
            subject.className = 'subject-col';
            subject.innerHTML = rowInfo.subject;

            // Timestamp Column
            let timestamp = row.insertCell();
            timestamp.className = 'timestamp-col';
            timestamp.innerHTML = rowInfo.timestamp;
        });
    });
}



function loadSent() {
    load_mailbox();

    // Get the data from the API
    fetch('/emails/sent', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        let table_headers = [
            "<th class='sent-to-col'>Sent To</th>",
            "<th class='subject-col'>Subject</th>",
            "<th class='timestamp-col'>Date</th>"
        ];

        // Show the mailbox name and create the table inside the <div id="emails-view">
        document.querySelector('#emails-view').innerHTML = "<h3>Sent</h3>";
        document.querySelector('#emails-view').insertAdjacentHTML('beforeend', `<table class="sent-table"><thead>${table_headers.join('')}</thead><tbody></tbody></table>`);

        // Populate the table
        result.forEach( rowInfo => {
            // Create a new row in the table
            const row = document.querySelector('tbody').insertRow();
            row.className = 'mail-row';
            row.style.cssText = 'color: #808080; font-weight: 400; background-color: #f5f5f5;';

            // Make the entire row clickable
            row.addEventListener("click", () => {
                document.querySelector('#view-email').innerHTML = '<h3>Sent</h3>';
                viewMail(rowInfo);
            });

            // Sent-To Column
            let sent_to = row.insertCell();
            sent_to.className = 'sender-col';
            sent_to.innerHTML = rowInfo.recipients.join(', ');

            // Subject Column
            let subject = row.insertCell();
            subject.className = 'subject-col';
            subject.innerHTML = rowInfo.subject;

            // Timestamp Column
            let timestamp = row.insertCell();
            timestamp.className = 'timestamp-col';
            timestamp.innerHTML = rowInfo.timestamp;
        });
    });
}


function loadArchived() {
    load_mailbox();

    // Get the data from the API
    fetch('/emails/archive', {
    method: 'GET'
    })
    .then(response => response.json())
    .then(result => {

        let table_headers = [
            "<th class='sender-col'>Sender</th>",
            "<th class='subject-col'>Subject</th>",
            "<th class='timestamp-col'>Date</th>"
        ];

        // Show the mailbox name and create the table inside the <div id="emails-view">
        document.querySelector('#emails-view').innerHTML = "<h3>Archived</h3>";
        document.querySelector('#emails-view').insertAdjacentHTML('beforeend', `<table class="archived-table"><thead>${table_headers.join('')}</thead><tbody></tbody></table>`);

        // Populate the table
        result.forEach( rowInfo => {
            // Create a new row in the table
            const row = document.querySelector('tbody').insertRow();
            row.className = 'mail-row';
            row.style.cssText = 'color: #808080; font-weight: 400; background-color: #f5f5f5;';

            // Make the entire row clickable
            row.addEventListener("click", () => {
                document.querySelector('#view-email').innerHTML = '<h3>Archived</h3>';
                viewMail(rowInfo);
            });

            // Sender Column
            let sender = row.insertCell();
            sender.className = 'sender-col';
            sender.innerHTML = rowInfo.sender;

            // Subject Column
            let subject = row.insertCell();
            subject.className = 'subject-col';
            subject.innerHTML = rowInfo.subject;

            // Timestamp Column
            let timestamp = row.insertCell();
            timestamp.className = 'timestamp-col';
            timestamp.innerHTML = rowInfo.timestamp;
        });
    });
}


function viewMail(rowInfo) {

    // Show the 'view-email' container and hide the rest
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#view-email').style.display = 'block';

    // Fetch the mail info
    fetch('/emails/'+rowInfo.id, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {

        // Mark the mail as read
        fetch('/emails/'+rowInfo.id, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
        })

        // Create the Archive / Unarchive button
        let archiveButton = document.createElement('button');
        archiveButton.className = 'btn btn-sm btn-outline-primary'

        // Create the Reply button
        let replyButton = document.createElement('button');
        replyButton.className = 'btn btn-sm btn-outline-primary'
        replyButton.innerHTML = 'Reply';
        replyButton.setAttribute("id", "reply-button");

        // Put the information inside the container (HTML)
        let div = document.querySelector('#view-email');
        div.insertAdjacentHTML('beforeend', `
            <h6><strong>From:</strong> ${result.sender}</h6>
            <h6><strong>To:</strong> ${result.recipients}</h6>
            <h6><strong>Subject:</strong> ${result.subject}</h6>
            <h6><strong>Timestamp:</strong> ${result.timestamp}</h6>
        `);

        // Insert into the #view-email the buttons for mails that were not sent by the current user
        if (result.sender != document.querySelector('#current-user-mail').innerHTML) {
            div.insertAdjacentElement('beforeend', archiveButton);
            div.insertAdjacentElement('beforeend', replyButton);
        }
        
        
        // Print the body of the message
        div.insertAdjacentHTML('beforeend', `
        <hr>
        <h6><strong>Message body:</strong></h6>
        `)
        div.insertAdjacentHTML('beforeend', result.body);

        // Conditionaly show the text of the Archive/Unarchive button
        if (result.archived) {
            archiveButton.innerHTML = 'Unarchive';
        } else {
            archiveButton.innerHTML = 'Archive';
        }

        // Make a PUT request to update the "Archived or Unarchived" status of the mail
        archiveButton.addEventListener("click", () => {
            fetch('/emails/'+rowInfo.id, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: !result.archived
                })
            })
            .then( () => {
                if (result.archived) {
                    loadInbox()
                } else {
                    loadInbox()
                    // loadArchived();
                }
            });
        });

        // Prepare the data and load the "Compose mail" view
        replyButton.addEventListener("click", () => {

            let subject = result.subject
            let body = result.body
            const replyPrefix = 'Re: '

            if (!subject.startsWith(replyPrefix)) {
                subject = replyPrefix + subject
            }

            body = 'On ' + result.timestamp + ', ' + result.sender + ' wrote: \n\n' + body

            // Load the compose mail view and pre populate the form with the altered data
            reply_mail(result.sender, subject, body)
            
        });

    });
}