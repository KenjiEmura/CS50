class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableClass: 'inbox-table',
            column1Text: 'Sender',
            column1Class: 'sender-col',
            column2Text: 'Subject',
            column2Class: 'subject-col',
            column3Text: 'Date',
            column3Class: 'timestamp-col',
        };
        this.initialize();
    }

    initialize = () => {
        console.log('Funciona!!!')
    }


    render() {
        return (
            <table className={this.state.tableClass}>
                <thead>
                    <tr>
                        <th className={this.state.column1Class}>{this.state.column1Text}</th>
                        <th className={this.state.column2Class}>{this.state.column2Text}</th>
                        <th className={this.state.column3Class}>{this.state.column3Text}</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        )
    }

}

class ButtonMenu extends React.Component {

    render() {
        return (
            <div>
                <button className="btn btn-sm btn-outline-primary" id="inbox">Inbox</button>
                <button className="btn btn-sm btn-outline-primary" id="compose">Compose</button>
                <button className="btn btn-sm btn-outline-primary" id="sent">Sent</button>
                <button className="btn btn-sm btn-outline-primary" id="archived">Archived</button>
            </div>
        );
    }
}

class MailBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            compose: false,
        }
    }

    render() {
        if ( this.state.compose ) {
            return (
                <div>
                    Compose se muestra
                </div>
            )
        } else {
            return (
                <div id="compose-view">
                </div>
            )
        }
    }

}

ReactDOM.render(<Table />, document.querySelector('#react-app'));
ReactDOM.render(<ButtonMenu />, document.querySelector('#button-menu'));
ReactDOM.render(<MailBox />, document.querySelector('#react'));