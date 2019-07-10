var tbody = document.querySelector('#table tbody');
var dataset = [];
var stopFlag = false;
var opnedColum = 0;

document.querySelector('#exec').addEventListener('click', function(){
    // 내부를 먼저 초기화
    tbody.innerHTML = '';
    dataset = [];
    document.querySelector('#result').textContent = '';
    stopFlag = false;
    opnedColum = 0;

    var hor = parseInt(document.querySelector('#hor').value);
    var ver = parseInt(document.querySelector('#ver').value);
    var mine = parseInt(document.querySelector('#mine').value);

    // 지뢰 위치 뽑기    
    var mineNumber = Array(hor * ver).fill().map(function(ele, index){
        return index;
    });
    
    var shuffle = [];

    while(mineNumber.length > 80){ // 반복 횟수 유연할 수 있게 수정
        var movedNumber = mineNumber.splice(Math.floor(Math.random() * mineNumber.length),1)[0];
        shuffle.push(movedNumber);
    }

    // 지뢰 테이블 만들기
    
    for(var i = 0; i < ver; i +=1){
        var arr = [];
        var tr = document.createElement('tr');
        dataset.push(arr);

        for(var j = 0; j < hor; j +=1){  
           arr.push(0);
           var td = document.createElement('td');

           td.addEventListener('contextmenu', function(e){
               e.preventDefault();
                if(stopFlag){
                    return;
                }

               var parentTr = e.currentTarget.parentNode;
               var parenttbody = e.currentTarget.parentNode.parentNode;
               var colum = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
               var row = Array.prototype.indexOf.call(parenttbody.children, parentTr);

               if(e.currentTarget.textContent === '' || e.currentTarget.textContent==='X' ){
                e.currentTarget.textContent = '!';            

               }else if(e.currentTarget.textContent ==='!'){
                e.currentTarget.textContent = '?';

               }else if(e.currentTarget.textContent ==='?'){
                if(dataset[row][colum] === 1){
                    e.currentTarget.textContent = '';
                }else if(dataset[row][colum] === 'X'){
                    e.currentTarget.textContent = 'X';
                }

               }
               
           });
           td.addEventListener('click', function(e){
               // 클릭했을때 주변 지뢰 개수
            if(stopFlag) {
                return;
            }
            var parentTr = e.currentTarget.parentNode;
            var parenttbody = e.currentTarget.parentNode.parentNode;
            var colum = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
            var row = Array.prototype.indexOf.call(parenttbody.children, parentTr);
            
            console.log(dataset, row, colum);
            if(dataset[row][colum] === 1){
                return; // 이미 열린 칸
            }


            e.currentTarget.classList.add('opened');
            opnedColum +=1;
            if(dataset[row][colum] === 'X'){
                e.currentTarget.textContent = '펑!';
                document.querySelector('#result').textContent = 'Failed!';
                stopFlag = true;
            } else {
                dataset[row][colum] = 1;
                var around = [dataset[row][colum-1],        dataset[row][colum+1]];
                if(dataset[row-1]){
                    around = around.concat(dataset[row-1][colum-1], dataset[row-1][colum], dataset[row-1][colum+1]);
                }
                if(dataset[row +1]){
                    around = around.concat(dataset[row+1][colum-1], dataset[row+1][colum], dataset[row+1][colum+1]);
                }
                console.log(around);

                var numberAroundMine = around.filter(function(v){
                    return v === 'X';
                }).length;   

                // false value = '', 0, NaN, null, undefined, false
                e.currentTarget.textContent = numberAroundMine || '';
                dataset[row][colum] = 1;
                if(numberAroundMine === 0){ 
                    // 주변 8칸 동시 오픈
                    console.log('주변을 엽니다');
                    var aroundColum = [];
                    if(tbody.children[row-1]){
                        aroundColum = aroundColum.concat([
                            tbody.children[row-1].children[colum-1],
                            tbody.children[row-1].children[colum],
                            tbody.children[row-1].children[colum+1],
                        ]);
                    }

                   aroundColum = aroundColum.concat([
                        tbody.children[row].children[colum-1],
                        tbody.children[row].children[colum+1],
                    ]);

                    if(tbody.children[row+1]){
                      aroundColum =  aroundColum.concat([
                            tbody.children[row+1].children[colum-1],
                            tbody.children[row+1].children[colum],
                            tbody.children[row+1].children[colum+1]
                        ]);
                    }
                    aroundColum.filter((v) => !!v).forEach(function(nextColum){
                    var parentTr = nextColum.parentNode;
                    var parenttbody = nextColum.parentNode.parentNode;
                    var nextColumCol = Array.prototype.indexOf.call(parentTr.children, nextColum);
                     var nextColumRow = Array.prototype.indexOf.call(parenttbody.children, parentTr);
                       if(dataset[nextColumRow][nextColumCol] !== 1 ){
                        nextColum.click();
                       }                     
                    });
                }                   
            }
            console.log(opnedColum, hor * ver - mine);
            if(opnedColum === hor * ver - mine ){
                stopFlag = true;
                document.querySelector('#result').textContent = 'You won!';
            }
           });
           tr.appendChild(td);
         }
         tbody.appendChild(tr);   
}

// 지뢰 심기
 for(var k = 0; k < shuffle.length; k++){ // example : 60
     var verForMine = Math.floor(shuffle[k] / 10); // example : 6
     var horForMine = shuffle[k] % 10 ; // example : 0
     tbody.children[verForMine].children[horForMine].textContent = 'X';
     dataset[verForMine][horForMine] = 'X';
 }
});


