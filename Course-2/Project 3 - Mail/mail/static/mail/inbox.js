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

        console.log(result);

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
        console.log(result);

        // Create the Archive / Unarchive button
        let button = document.createElement('button');
        button.className = 'btn btn-sm btn-outline-primary'

        // Put the information inside the container (HTML)
        let div = document.querySelector('#view-email');
        div.insertAdjacentHTML('beforeend', `
            <h6><strong>From:</strong> ${result.sender}</h6>
            <h6><strong>To:</strong> ${result.recipients}</h6>
            <h6><strong>Subject:</strong> ${result.subject}</h6>
            <h6><strong>Timestamp:</strong> ${result.timestamp}</h6>
        `);
        div.insertAdjacentElement('beforeend', button);
        div.insertAdjacentHTML('beforeend', `
            <hr>
            <h6><strong>Message body:</strong></h6>
            <div><p>${result.body}</p></div>
        `)


        if (result.archived) {
            button.innerHTML = 'Unarchive';
        } else {
            button.innerHTML = 'Archive';
        }

    });
}