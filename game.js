var tbody = document.querySelector('#table tbody');
var dataset = [];

document.querySelector('#exec').addEventListener('click', function(){
    // 내부를 먼저 초기화
    tbody.innerHTML = '';
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
           arr.push(1);
           var td = document.createElement('td');
           td.addEventListener('contextmenu', function(e){
               e.preventDefault();
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
            var parentTr = e.currentTarget.parentNode;
            var parenttbody = e.currentTarget.parentNode.parentNode;
            var colum = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
            var row = Array.prototype.indexOf.call(parenttbody.children, parentTr);
            if(dataset[row][colum] === 'X'){
                e.currentTarget.textContent = '펑!';
            } else {
                var around = [dataset[row][colum-1],        dataset[row][colum+1]];
                if(dataset[row-1]){
                    around = around.concat(dataset[row-1][colum-1], dataset[row-1][colum], dataset[row-1][colum+1]);
                }
                if(dataset[row +1]){
                    around = around.concat(dataset[row+1][colum-1], dataset[row+1][colum], dataset[row+1][colum+1]);
                }
                console.log(around);
                e.currentTarget.textContent = around.filter(function(v){
                    return v === 'X';
                }).length;                      
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


var name = 'zero';
function log(){
    console.log(name);
}

function wrapper(){
    var name = 'nero';
    log();
}

wrapper();