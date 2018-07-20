import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calulateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return {winner: squares[a],line:[a,b,c]};
    }
  }
  return {winner:null, line:[]};
}


class Square extends React.Component {
  
  render() {
      if(this.props.highlight){
        return (
          <button className="square" onClick={() => this.props.onClick()} style={{color:"red"}}>
          {this.props.value}
        </button>
        )
      }else{
      return (
        <button className="square" onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
      );
    }
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (<Square
      key={i}
      onClick={() => this.props.onClick(i)}
      value={this.props.squares[i]} 
      highlight={this.props.winnerLine.includes(i)}
      />
    );
  }

  render() {

    let rows = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (var j = 3 * i; j < 3 * i + 3; j++) {
        row.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={i}> {row} </div>);
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastStep: 'Game start'
      }],
      xIsNext: true,
      stepNumber: 0,
      sort: false
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true
    })
  }

  handClick(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
   
    if (calulateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const location = '(' + (Math.floor(i / 3) + 1) + ',' + ((i % 3) + 1) + ')';
    const desc = squares[i] + '  movedTo' + location;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep: desc
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  toggleSort(){
    this.setState({sort: !this.state.sort});
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calulateWinner(current.squares).winner;
    const winnerLine = calulateWinner(current.squares).line;

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    if(this.state.sort){
      history = this.state.history.slice();
      history.reverse();
    }

    const moves = history.map((step, move) => {
      const desc = step.lastStep;
      if(move === this.state.stepNumber){
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}><strong>{desc}</strong></a>
          </li>
        );
      }else{
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
        );
      }
      
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handClick(i)} winnerLine={winnerLine} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick = {()=> this.toggleSort()}>Sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
