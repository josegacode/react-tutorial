import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// Function component 
// only if just need the render
// and no props
function Square(props) {
		return (
			// onClick is the listener
			// onClick() is the parent's method
			<button 
				className="square" 
				onClick={props.onClick}
			>
				{props.value}
			</button>
		)
}

class Board extends React.Component {
	renderSquare(i) {
		// Taking props from Game and
		// passing to children indicating
		// which square is will be pressed.
		return <Square 
			value={this.props.squares[i]}
			onClick={() => this.props.handleClick(i)}
			/>;
	}

	render() {
		return(
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>

				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>

				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			// Store all child state's value 
			history: [{
				squares: Array(9).fill(null),
			}],

			// To handle the turns
			xIsNext: true, 
		}
	}

	handleClick(i) {
		const history = this.state.history;
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		// Returns if there is a winner or if that
		// squares has already a symbol put in it.
		if(calculateWinner(squares) || squares[i])
			return;

		squares[i] = this.props.xIsNext ? 'X' : 'O';
		this.setState({ 
			// Adds the new game state to history
			history: history.concat([{ squares: squares	}]),
			xIsNext: !this.props.xIsNext,
		});
	}


	render() {
		const history = this.state.history;
		const current = history[history.length - 1];
		const winner = calculateWinner(this.state.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				`Go to move #${move}`:
				`Go to game start`;

			return(
				<li>
					<button onClick={() => {
						this.jumpTo(move)
						}}>
						{desc}
					</button>
				</li>
			);
		});

		let status;
		if(winner)
			status = `Winner ${winner}`;
		else 
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick()}
					/>
				</div>

				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		)
	}
}

ReactDOM.render(
	<Game/>,
	document.getElementById('root')
);

function calculateWinner(squares) {
	
	// Represent all possible 3-line wins
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

	// Iterates over each possible 3-line wins
  for (let i = 0; i < lines.length; i++) {

		// Destruct a 3-line values
    const [a, b, c] = lines[i];

		// Check if there is 3-line win combination
		// in the board
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			
			// The player winner, x or o
      return squares[a];
    }
  }

	// Else, tie
  return null;
}
