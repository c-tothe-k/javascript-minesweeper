$(document).ready( function() {
    
    var s = 8;
    var t = [];
    
    //Used when a cell is clicked to keep track of the neighboring cells to check
    var cellsToCheck = [];
    
    //This list is used to check all neighboring cells by adding each list item to the
    //x and y values of the cell
    var dirs = [ [1,0], [0,1],[1,1],[-1,-1], [-1,0], [0,-1], [1,-1], [-1,1] ];
    
    var maxBNum = 20;
    var bNum = 0;
    var emptNum = 0;
    var BOMB = "B";
    var EMPTY = "E";
    var FLAGGED = "F";
    var FLAGGED_BOMB = "FB";
    var CLEARED = "C";
    var bombsFound = 0 ;
    var clearedNum = 0;
    
    $("#flaggedCounter").text(maxBNum);
    for ( var i= 0; i<s;i++) {
        $("#msTbl").append("<tr>");
        var r = [];
        for (var x = 0; x<s; x++) {
           $("tr").last().append("<td id='"+i+"_"+x+"'></td>");  
           if ( Math.random() >= 0.5 && bNum <= maxBNum) {
               r.push(BOMB);
               bNum++;
           } else {
               r.push(EMPTY);
               emptNum++;
           }
        }
        $("#msTbl").append("</tr>");
        t.push(r);
    }
    
    $("td").addClass("unclicked"); 
    
    $("td").mousedown(function(event) {
        
        var coords = this.id.split("_");
        var x = coords[0];
        var y = coords[1];
        if (event.which === 1 ) {
            cellsToCheck = [];
            if ( t[x][y] === BOMB ) {
                alert("BOOM! Game Over!");
                
                revealBoard();
            } else if (t[x][y] != CLEARED ) {
             
              cellsToCheck.push(  '{"x":'+x+',"y":'+y +'}'  );
              var cellListSize = cellsToCheck.length;
              var currentCell = 0;
              while ( currentCell < cellListSize ) {
                 bombsFound = 0;
                 var cellInfo = JSON.parse( cellsToCheck[currentCell] );
                 $("#" + cellInfo.x + "_" + cellInfo.y).removeClass("unclicked");
                 clearedNum++;
                 t[x][y] = CLEARED;
                 $.each( dirs, checkNeighbors.bind(cellInfo) );
                 if ( bombsFound === 0) {
                      $.each( dirs, addNeighborsToList.bind(cellInfo) );
                 } else {
                     $("#" + cellInfo.x + "_" + cellInfo.y).text(bombsFound);
                 }
                 
                 currentCell+=1;
                 cellListSize = cellsToCheck.length;
                
              }
              //check if cleared count = clicked count, then display You win message 
              // and reveal revealBoard
              if ( emptNum === clearedNum) {
                alert("You win!")
                revealBoard();
              }
          }
        } else if (event.which === 3 ) {
          var c = -1;
          if ( $("#" +x + "_" + y).text() === "" ) {
               $("#" +x + "_" + y).text("!");
          } else {
               $("#" + x + "_" + y).text("");
               c = 1;
          }
          $("#flaggedCounter").text( parseInt($("#flaggedCounter").text() ) + c );
        } 
    });
    
    var checkNeighbors = function( index, value ) {
        
        var xOffSet = value[0];
        var yOffset = value[1];
        var newX = parseInt(this.x) + parseInt(xOffSet);
        var newY = parseInt(this.y) + parseInt(yOffset);
        var cellInfoStr =  '{"x":' + newX +',"y":'+ newY +'}';
        if ( newX >= 0 && newX < t.length && newY >= 0 && newY < t.length  ) {
         //&& cellsToCheck.indexOf(cellInfoStr) === -1
         //if any neighbor has a bomb, dont add it to the array
         // check all 8 directions first, then if no bomb, add all 8 to array
           if ( t[newX][newY] === BOMB ) {
             bombsFound += 1;
           }
        }
    };
   
    var addNeighborsToList = function( index, value ) {
    
        var xOffSet = value[0];
        var yOffset = value[1];
        var newX = parseInt(this.x) + parseInt(xOffSet);
        var newY = parseInt(this.y) + parseInt(yOffset);
        var cellInfoStr =  '{"x":' + newX +',"y":'+ newY +'}';
        //if the cell is off the grid, or already on the list, don't add it to cellsToCheck
        if ( newX >= 0 && newX < t.length && newY >= 0 && newY < t.length && cellsToCheck.indexOf(cellInfoStr) === -1  ) {
            cellsToCheck.push(cellInfoStr);
        }
    };
    
    var revealBoard = function() {
        $("td").removeClass("unclicked");
        for ( var o=0; o<t.length; o ++ ) {
                    for ( var p=0; p<t.length; p++) {
                        if (t[o][p] === BOMB ) {
                            $("#" + o + "_" + p).html("<img src='bomb.png'/>");
                        } else {
                             $("#" + o + "_" + p).html("");
                        }
                }
          }  
    };
});