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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}



function load_mailbox() {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
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
    document.querySelector('#emails-view').insertAdjacentHTML('beforeend', `<table id="inbox-table"><thead>${table_headers.join('')}</thead><tbody></tbody></table>`);
    
    // Populate the table
    result.forEach( rowInfo => {
      // Create a new row in the table
      const row = document.querySelector('tbody').insertRow();
      row.className = 'mail-row';

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
    document.querySelector('#emails-view').insertAdjacentHTML('beforeend', `<table id="sent-table"><thead>${table_headers.join('')}</thead><tbody></tbody></table>`);

    // Populate the table
    result.forEach( rowInfo => {
      // Create a new row in the table
      const row = document.querySelector('tbody').insertRow();
      row.className = 'mail-row';

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
    document.querySelector('#emails-view').insertAdjacentHTML('beforeend', `<table id="archived-table"><thead>${table_headers.join('')}</thead><tbody></tbody></table>`);

    // Populate the table
    result.forEach( rowInfo => {
      // Create a new row in the table
      const row = document.querySelector('tbody').insertRow();
      row.className = 'mail-row';

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