import React from 'react'

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
                    this.props.onClick()
                }}
            >
                {this.props.value}
            </button>
        )
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.square[i]}
                onClick={() => {
                    this.props.onClick(i)
                }}
            />
        )
    }
    // state改变触发render函数  故判断胜者在此函数中
    render() {
        return (
            <div>
                <div>这是第{this.props.t}个棋盘</div>
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
        )
    }
}

class Game extends React.Component {
    /* 为了实现历史数组 再次进行状态提升 意思是把状态都拿到最上层进行管理 底下只传当前状态*/
    constructor() {
        super()
        this.state = {
            history: [
                {
                    squareArr: Array(9).fill(null),
                },
            ],
            nextFlag: true,
        }
    }
    // 再次状态提升
    handleClick(i) {
        let currentSquare = this.state.history[this.state.history.length - 1].squareArr
        if (currentSquare[i] || calculateWinner(currentSquare)) {
            return
        }
        console.log(i, this.state)

        let resultArr = [...currentSquare]
        resultArr[i] = this.state.nextFlag ? 'X' : 'O'
        // 使用concat()增加当前这一步 同时避免浅拷贝
        this.setState({
            history: this.state.history.concat([
                {
                    squareArr: resultArr,
                },
            ]),
            // 可以根据当前步骤的奇偶性来判断下一个对手
            nextFlag: (this.state.history.length)%2===0,
        })
    }
    // 实现跳步 实际上就是把当前的history赋值为步骤对应的history
    jumpTo(move) {
        let result = this.state.history.splice(0, move + 1)
        this.setState({
            history: result,
            nextFlag:move%2===0
        })
    }
    render() {
        let currentSquare = this.state.history[this.state.history.length - 1].squareArr
        let winner = calculateWinner(currentSquare)
        const status = winner ? `The winner is ${winner}` : `Next player: ${this.state.nextFlag ? 'X' : 'O'}`
        const moves = this.state.history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start'
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        square={currentSquare}
                        onClick={(i) => {
                            this.handleClick(i)
                        }}
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
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}
export default Game
