
# react官网井字棋练习
代码在`src/components`
#### 基础功能代码展示
按照官网的一步步走下来，多次状态提升后，将`state`提到了最上层的`Game`组件进行管理，那么底下的子组件全都是受控组件 不拥有自己的`state`,代码如下：

```javascript
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
```

#### 完成进阶功能

```javascript
这里是为了完成教程进阶的几个功能
1.在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。
2.在历史记录列表中加粗显示当前选择的项目。
3.使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
4.添加一个可以升序或降序显示历史记录的按钮。
5.每当有人获胜时，高亮显示连成一线的 3 颗棋子。
6.当无人获胜时，显示一个平局的消息。
```
让我们来一个个分析：

##### 1.在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)
```javascript
为了完成1的要求，有两种方法可以解决：
1.state里新加数组存储当前的坐标，每次click的时候 push点击的坐标   ---可行 已实现
2.不在state里新加变量，而是比较click前后的两个数组，其间的差异（有且仅有一项有差异）
即为点击的坐标  ---比较麻烦 需要多次比较（render和jump）
```
即仿照`history`数组的实现方法存储每一步的坐标即可
```javascript
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
            currentPoint:this.state.currentPoint.concat([i])
        })
    }
```
九宫格的列数和行数的算法 坐标整除3的结果即为行数，余数即为列数，计算方法如下：

```javascript
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
```

渲染函数和`jump`方法里都要相应加上：

```javascript
 const moves = this.state.history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            // 判断坐标进行加粗
            const bold = move === this.state.history.length - 1 ? <strong>{desc}</strong> : desc;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{bold}</button>
                    <span>
                        ---------这一步的坐标是({calcRowPoint(this.state.currentPoint[move - 1])[0]},{calcRowPoint(this.state.currentPoint[move - 1])[1]})
                    </span>
                </li>
            );
        });
```
其中`span`标签里也可以使用模板字符串，比较简单

```javascript
这一步的坐标是({`${calcRowPoint(this.state.currentPoint[move - 1])[0]},${calcRowPoint(this.state.currentPoint[move - 1])[1]}`})
```

```javascript
    // 实现跳步 实际上就是把当前的history赋值为步骤对应的history
    jumpTo(move) {
        let result = this.state.history.splice(0, move + 1)
        let currentPointResult=this.state.currentPoint.splice(0, move)
        this.setState({
            history: result,
            nextFlag:move%2===0,
            currentPoint:currentPointResult
        })
    }
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210412004726812.png)

##### 2.在历史记录列表中加粗显示当前选择的项目
也没太明白是啥意思，我的理解是历史记录的最后一个应当都是当前选择的步骤，那么只要加粗最后一个就行了。

```javascript
 const moves = this.state.history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start'
            // 判断坐标进行加粗
            const bold=move===this.state.history.length-1?(<strong>{desc}</strong>):desc
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{bold}</button>
                    <span>---------这一步的坐标是{this.state.currentPoint[move-1]}</span>
                </li>
            )
        })
```

##### 3.使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）
关键在于知道九宫格的生成算法，如1中所述，故代码如下：

```javascript
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
```
##### 4.添加一个可以升序或降序显示历史记录的按钮
先分析下，升序和降序的关键在于渲染的顺序，我们只需要改变历史记录列表渲染的顺序，即可完成升序or降序。升序可以理解为`index`从0到`length-1`,而降序则为`index`从`length-1`到0。
不需要去改变`history`数组以及`jump`方法，**因为不管渲染顺序如何，每一条记录在`history`数组里的`index`是固定的，改变的只有渲染顺序而已**。代码如下：

```javascript
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
            // 当前历史记录排序是否为升序
            isHistoryAscending: true,
        };
    }
```
`render`方法
```javascript
        const moves =  this.state.history.map((step, move) => {
            move=this.state.isHistoryAscending?move:this.state.history.length - 1-move
            const desc = move ? "Go to move #" + move : "Go to game start";
            // 判断坐标进行加粗
            const bold = move ===  this.state.history.length - 1 ? <strong>{desc}</strong> : desc;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{bold}</button>
                    <span>---------这一步的坐标是({`${calcRowPoint(this.state.currentPoint[move - 1])[0]},${calcRowPoint(this.state.currentPoint[move - 1])[1]}`})</span>
                </li>
            );
        });
```
改变state：
```javascript
    // 切换升序降序
    changeOrder() {
        this.setState((state)=>({ isHistoryAscending:!state.isHistoryAscending }));
    }
```
最终效果如下：可正常切换且可正常进行历史记录跳跃
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210412130619772.png)

##### 5.每当有人获胜时，高亮显示连成一线的 3 颗棋子。
todo
##### 6.当无人获胜时，显示一个平局的消息。
todo