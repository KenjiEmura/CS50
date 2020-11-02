class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }
    
    render() {
        return (
            <div>
                <h1>{this.state.count}</h1>
                <button onClick={this.count}>Count</button>
            </div>
        );
    }

    count = () => {
        this.setState( state => ({
            count: state.count + 1,
        }));
    }

}


class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            num1: 1,
            num2: 2,
            userInput: "",
        }
    }

    render() {
        return (
            <div>
                <h1>{this.state.num1} + {this.state.num2}</h1>
                <input onKeyPress={this.inputKeyPress} onChange={this.updateResponse} value={this.state.userInput} />
                <h4>Score: {this.state.score}</h4>
            </div>
        );
    }

    inputKeyPress = (event) => {
        if (event.key === 'Enter') {
            const answer = parseInt(this.state.userInput);
            if ( answer === this.state.num1 + this.state.num2 ) {
                // Correct Answer
                this.setState( state => ({
                    score: state.score + 1
                }));
            } else {
                // Wrong Answer
            }
        }
    }

    updateResponse = (event) => {
        this.setState({
            userInput: event.target.value
        });
    }

}



// ReactDOM.render(<Game />, document.querySelector('#react'));