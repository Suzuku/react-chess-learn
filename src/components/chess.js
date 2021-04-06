import React from 'react';

class Square extends React.Component {
    // constructor(props){
    //     super(props)
    //     this.state={
    //         value:null
    //     }
    // }
    /* 改进 将state放到父组件里进行判断 */
    render() {
        return (
            <button
                className="square"
                onClick={() => {
                    this.props.onClick(this.props.value);
                }}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            squareArr: Array(9).fill(null),
            nextFlag: true
        };
    }
    renderSquare(i) {
        return (
            <Square
                value={this.state.squareArr[i]}
                onClick={(params) => {
                    this.handleClick(i, params);
                }}
            />
        );
    }
// state改变触发render函数  故判断胜者在此函数中
    render() {
        let winner=calculateWinner(this.state.squareArr)
        const status= winner?`The winner is ${winner}`:`Next player: ${this.state.nextFlag ? 'X' : 'O'}`;
        return (
            <div>
                <div>这是第{this.props.t}个棋盘</div>
                <div className="status">{status}</div>
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
    handleClick(i, params) {
        if (this.state.squareArr[i]||calculateWinner(this.state.squareArr)) {
            return;
        }
        let resultArr = [...this.state.squareArr];
        resultArr[i] = this.state.nextFlag ? 'X' : 'O';
        this.setState({ squareArr: resultArr, nextFlag: !this.state.nextFlag });
        console.log(params);
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board t="1" />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}
function calculateWinner(squares) {
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
export default Game;
