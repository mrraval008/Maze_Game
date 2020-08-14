import { Component, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mazegame';

  @ViewChild('myTable', { static: false }) myTable: ElementRef;
  private gridArray = [];
  start = [];
  counter:number = 0;
  getPathCounter:number = 0;
  stepCounter:number = 0;
  stepMessage:string = "";
  

  createTable() {
    let rn = window.prompt("Input number of rows");
    let cn = window.prompt("Input number of columns");
    let rowNum = parseInt(rn, 10);
    let columnNum = parseInt(cn, 10);
    for (let r = 0; r < rowNum; r++) {
      this.gridArray.push([])
      let row = this.myTable.nativeElement.insertRow(r);
      for (let c = 0; c < columnNum; c++) {
        let col = row.insertCell(c);
        let randNum = Math.floor(Math.random() * 10) + 1;
        let gridNum = 0;
        if (randNum > 8 && this.counter < rowNum) {
          this.counter++;
          gridNum = 1;
          col.innerHTML = gridNum
        }
        this.gridArray[r].push(gridNum)
      }
    }
    this.start = [Math.floor(rowNum / 2), Math.floor(columnNum / 2)];
    console.log(this.gridArray)
    
    this.getPath()
  }

  getPath() {
      this.getPathCounter++
      let path = this.findWay(this.gridArray, this.start);
      this.stepCounter += path.length - 1;
      this.start = path[path.length - 1]
      this.showUI(path, 0)
  }

  showUI(path, cntr) {
    setTimeout(() => {
      if ((cntr - 1) >= 0) {
        this.myTable.nativeElement.rows[path[cntr - 1][0]].cells[path[cntr - 1][1]].classList.remove('red_back')
        this.myTable.nativeElement.rows[path[cntr - 1][0]].cells[path[cntr - 1][1]].textContent = ""
      }
      this.myTable.nativeElement.rows[path[cntr][0]].cells[path[cntr][1]].classList.add('red_back')
      cntr++;
      if (cntr < path.length) {
        this.showUI(path, cntr)
      }else if(this.getPathCounter < this.counter){
        this.getPath()
      }else{
        this.stepMessage = `Game Over, It took ${this.stepCounter} steps to Finish.`
      }
    },300)
  }


  startNewGame() {
    this.gridArray = [];
    this.myTable.nativeElement.innerHTML = "";
    this.counter = 0;
    this.getPathCounter = 0;
    this.stepCounter = 0;
    this.stepMessage = "";
    this.createTable();
  }

  findWay(matrix, position) {
    var queue = [];
    queue.push([position]); // store a path, not just a position

    while (queue.length > 0) {
      var path = queue.shift(); // get the path out of the queue
      var pos = path[path.length - 1]; // ... and then the last position from it
      var direction = [
        [pos[0] + 1, pos[1]],
        [pos[0], pos[1] + 1],
        [pos[0] - 1, pos[1]],
        [pos[0], pos[1] - 1]
      ];

      for (var i = 0; i < direction.length; i++) {
        if (direction[i][0] < 0 || direction[i][0] >= matrix[0].length
          || direction[i][1] < 0 || direction[i][1] >= matrix[0].length) {
          continue;
        }
        if (matrix[direction[i][0]][direction[i][1]] != 0) {
          matrix[direction[i][0]][direction[i][1]] = 0;
          return path.concat([direction[i]]);
        }
        queue.push(path.concat([direction[i]]));
      }
    }
  }
}
