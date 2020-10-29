document.addEventListener('DOMContentLoaded',() => {

  loadIndex();
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', loadIndex );
  
  document.querySelector('#sent').addEventListener('click', () => {
    load_mailbox('sent');
    fetch('/emails/sent', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
  });
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
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
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });

    load_mailbox('inbox');
  }
  
  // By default, load the inbox
  load_mailbox('inbox');
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

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function loadIndex() {
  load_mailbox('inbox');
  fetch('/emails/inbox', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      let table_headers = [
        "<th class='sender-col'>Sender</th>",
        "<th class='subject-col'>Subject</th>",
        "<th class='timestamp-col'>Date</th>"
      ];
      document.querySelector('#emails-view').insertAdjacentHTML('beforeend', `<table id="emails-table"><thead>${table_headers.join('')}</thead><tbody></tbody></table>`);
      result.forEach(newRow);
  });
}

function newRow(rowInfo) {
  // Create a new row in the table
  const row = document.querySelector('tbody').insertRow();

  console.log(rowInfo);

  row.className = 'mail-row';
  let sender = row.insertCell();
  sender.className = 'sender-col';
  sender.innerHTML = rowInfo.sender;

  let subject = row.insertCell();
  subject.className = 'subject-col';
  subject.innerHTML = rowInfo.subject;

  let timestamp = row.insertCell();
  timestamp.className = 'timestamp-col';
  timestamp.innerHTML = rowInfo.timestamp;


}