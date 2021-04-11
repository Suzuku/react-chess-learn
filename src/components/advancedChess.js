import React from "react";

/* 这里是为了完成教程进阶的几个功能
1.在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。
2.在历史记录列表中加粗显示当前选择的项目。
3.使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
4.添加一个可以升序或降序显示历史记录的按钮。
5.每当有人获胜时，高亮显示连成一线的 3 颗棋子。
6.当无人获胜时，显示一个平局的消息。
 */
class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => {
                    this.props.onClick();
                }}
            >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.square[i]}
                onClick={() => {
                    this.props.onClick(i);
                }}
            />
        );
    }
    // state改变触发render函数  故判断胜者在此函数中
    render() {
        // 采用循环生成九宫格
        const boardLine = [1, 2, 3].map((item, itemIndex) => {
            return (
                <div className="board-row" key={itemIndex}>
                    {[1, 2, 3].map((numbers, numIndex) => this.renderSquare(item * 3 - (3 - numbers) - 1))}
                </div>
            );
        });
        return (
            <div>
                <div>这是第{this.props.t}个棋盘</div>
                {boardLine}
            </div>
        );
    }
}
/* 为了完成1的要求，有两种方法可以解决：
1.state里新加数组存储当前的坐标，每次click的时候 push点击的坐标   可行 已实现
2.不在state里新加变量，而是比较click前后的两个数组，其间的差异（有且仅有一项有差异）即为点击的坐标  比较麻烦 需要多次比较（render和jump）*/
class Game extends React.Component {
    /* 为了实现历史数组 再次进行状态提升 意思是把状态都拿到最上层进行管理 底下只传当前状态*/
    constructor() {
        super();
        this.state = {
            history: [
                {
                    squareArr: Array(9).fill(null),
                },
            ],
            nextFlag: true,
            // 当前的坐标
            currentPoint: [],
        };
    }
    // 再次状态提升
    handleClick(i) {
        let currentSquare = this.state.history[this.state.history.length - 1].squareArr;
        if (currentSquare[i] || calculateWinner(currentSquare)) {
            return;
        }
        console.log(i, this.state);

        let resultArr = [...currentSquare];
        resultArr[i] = this.state.nextFlag ? "X" : "O";
        // 使用concat()增加当前这一步 同时避免浅拷贝
        this.setState({
            history: this.state.history.concat([
                {
                    squareArr: resultArr,
                },
            ]),
            // 可以根据当前步骤的奇偶性来判断下一个对手
            nextFlag: this.state.history.length % 2 === 0,
            currentPoint: this.state.currentPoint.concat([i]),
        });
    }
    // 实现跳步 实际上就是把当前的history赋值为步骤对应的history
    jumpTo(move) {
        let result = this.state.history.splice(0, move + 1);
        let currentPointResult = this.state.currentPoint.splice(0, move);
        this.setState({
            history: result,
            nextFlag: move % 2 === 0,
            currentPoint: currentPointResult,
        });
    }
    render() {
        let currentSquare = this.state.history[this.state.history.length - 1].squareArr;
        let winner = calculateWinner(currentSquare);
        const status = winner ? `The winner is ${winner}` : `Next player: ${this.state.nextFlag ? "X" : "O"}`;
        const moves = this.state.history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            // 判断坐标进行加粗
            const bold = move === this.state.history.length - 1 ? <strong>{desc}</strong> : desc;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{bold}</button>
                    <span>
                        ---------这一步的坐标是({`${calcRowPoint(this.state.currentPoint[move - 1])[0]},${calcRowPoint(this.state.currentPoint[move - 1])[1]}`})
                    </span>
                </li>
            );
        });
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        t="1"
                        square={currentSquare}
                        onClick={(i) => {
                            this.handleClick(i);
                        }}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
// 给定点的坐标输出 (列号, 行号)
function calcRowPoint(point) {
    // 游戏刚开始是没有坐标的
    if (point === undefined) {
        return ["", ""];
    }
    let row = Math.floor(point / 3);
    let line = point % 3;
    return [line, row];
}
export default Game;
