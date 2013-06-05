//-----------------------------------------------------------------------------------------
// Global Level variables                                                                   
//------------------------------------------------------------------------------------------
	var MAX_LEVEL = 7;
    var MIN_LEVEL = 1;
    var CURRENT_LEVEL = getLevel();
    var LEVELS_MSG = [" Rosie is going to a resturant with her friend, Jasmin. <BR/> &nbsp;&nbsp;&nbsp;&nbsp; Help her decide what to wear. ",
                        " Rosie is invited to a party. Dress code is white. <BR/> &nbsp;&nbsp;&nbsp;&nbsp; Help Rosie decide what to wear. ",
                        " Rosie wants to go to the gym. Jasmin invited her to go to brunch. Rosie is still hesitant on where to go. Help Rosie choose her outfit for both cases",
                        " Rosie want you to help her pick an outfit that would be her favorite to wear on formal occasions. define an outfit and use it",
                        " Rosie in invited to a formal event. She also has tickets for her favorite band concert.<BR/> Help Rosie on both cases",
                        " Rosie likes to have her bag and shoe of the same color. She picked the bag but not the shoe, pick a shoe and give it the same color",
                        " Rosie wore a top of a certain color, and wants you to pick a bottom that is different in color, pick a bottom and give it a different color"
                       ];
    
    
//------------------------------------------------------------------------------------------
// Attempt to open a web socket connection
//------------------------------------------------------------------------------------------
	var socket = null;
    if ("WebSocket" in window) {
      socket = new WebSocket("ws://localhost:8080");
      socket.onopen    = function(evt) { console.log("HTML connected."); }
      socket.onmessage = function(evt) { processEvent(evt.data); }
      socket.onerror   = function(evt) { console.log("HTML error in server connection"); }
      socket.onclose   = function(evt) { console.log("HTML server connection closed."); }
      
    }
    
//---------------------------------------------------------------------------
//  Get level number from URL
//---------------------------------------------------------------------------
	function getLevel () {
      var val = window.location.search.match(new RegExp('[?&]level=(\\d+)'));
      val = val ? val[1] : MIN_LEVEL;
      val = Math.min(Math.max(MIN_LEVEL, val), MAX_LEVEL);
      return val;
    }
    
//---------------------------------------------------------------------------
// Redirect to the next level
//---------------------------------------------------------------------------
	function advanceLevel () {
      if (CURRENT_LEVEL < MAX_LEVEL) {
        $.jqDialog.confirm("Congratulations!<BR/> <BR/> Are you ready to proceed to level %1?".replace('%1', CURRENT_LEVEL + 1),
        function() { window.location = window.location.protocol + '//' +
                     window.location.host + window.location.pathname +
                     '?level=' + (CURRENT_LEVEL + 1); },    // callback function for 'YES' button
        
        function() {  }    // callback function for 'NO' button
        );  
      }
      
      else {
        $.jqDialog.alert("End of game", function() { }); // callback function for 'OK' button
      }   
    }
    
//---------------------------------------------------------------------------
// Populate images
//---------------------------------------------------------------------------
	function populate() {
      var COLORS = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];
      for (var i=1; i < 9; i++ ) {
        for (var j=0; j < COLORS.length; j++ ) {
          var imgT=document.createElement("img");
          imgT.src = 'images/top'+ i + '-' + COLORS[j] +'.png';
          imgT.id = 'top'+ i + '-' + COLORS[j];
          imgT.className = 'top';
          document.getElementById("images").appendChild(imgT);
          
          var imgB=document.createElement("img");
          imgB.src = 'images/bottom'+ i + '-' + COLORS[j] +'.png';
          imgB.id = 'bottom'+ i + '-' + COLORS[j];
          imgB.className = 'bottom';
          document.getElementById("images").appendChild(imgB);
          //console.log(img.src);
          
        }
      }
    }
    
//----------------------------------------------------------------------------------------
// Inject blockly to this page and display the message corrosponding to the current level
//----------------------------------------------------------------------------------------
	function inject() {
      populate();
      
      var toolbox1 = '<xml>';
      toolbox1 += '  <category></category>';
      
      toolbox1 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block>';
      toolbox1 += '</category> <category> </category>'; //close tops
      
      toolbox1 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block>';
      toolbox1 += '</category> <category> </category>'; //close bottoms
      toolbox1 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox2 = '<xml> <category></category> ';
      toolbox2 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block>';
      toolbox2 += '</category> <category> </category>'; //close tops
      
      toolbox2 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block>';
      
      toolbox2 += '</category> <category> </category>'; //close bottoms
      
      toolbox2 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox2 += '</category> <category> </category>'; //close coloring
      
      toolbox2 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox3 = '<xml> <category></category> ';
      toolbox3 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block>';
      toolbox3 += '</category> <category> </category>'; //close tops
      
      toolbox3 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block>';
      
      toolbox3 += '</category> <category> </category>'; //close bottoms
      
      toolbox3 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox3 += '</category> <category> </category>'; //close coloring
      
      toolbox3 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="control_repeat"></block>';
      toolbox3 += '</category> <category> </category>'; //close controls
      toolbox3 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox4 = '<xml> <category></category> ';
      toolbox4 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block> <block type="top5"></block>';
      toolbox4 += '</category> <category> </category>'; //close tops
      
      toolbox4 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block>';
      
      toolbox4 += '</category> <category> </category>'; //close bottoms
      
      toolbox4 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox4 += '</category> <category> </category>'; //close coloring
      
      toolbox4 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="control_repeat"></block>';
      toolbox4 += '</category> <category> </category>'; //close controls
      
      toolbox4 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox4 += '</category> <category> </category>'; //close definitions
      toolbox4 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox5 = '<xml> <category></category> ';
      toolbox5 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block> <block type="top5"></block> <block type="top6"></block>';
      toolbox5 += '</category> <category> </category>'; //close tops
      
      toolbox5 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block> <block type="bottom6"></block>';
      
      toolbox5 += '</category> <category> </category>'; //close bottoms
      
      toolbox5 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox5 += '</category> <category> </category>'; //close coloring
      
      toolbox5 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="control_repeat"></block>';
      toolbox5 += '</category> <category> </category>'; //close controls
      
      toolbox5 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox5 += '</category> <category> </category>'; //close definitions
      toolbox5 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox6 = '<xml> <category></category> ';
      toolbox6 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block> <block type="top5"></block> <block type="top6"></block> <block type="top7"></block>';
      toolbox6 += '</category> <category> </category>'; //close tops
      
      toolbox6 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block> <block type="bottom6"></block> <block type="bottom7"></block>';
      
      toolbox6 += '</category> <category> </category>'; //close bottoms
      
      toolbox6 += '<category name="+ Coloring"> <block type="get_color_var"></block> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox6 += '</category> <category> </category>'; //close coloring
      
      toolbox6 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="control_repeat"></block>';
      toolbox6 += '</category> <category> </category>'; //close controls
      
      toolbox6 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox6 += '</category> <category> </category>'; //close definitions
      toolbox6 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox7 = '<xml> <category></category> ';
      toolbox7 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block> <block type="top5"></block> <block type="top6"></block> <block type="top7"></block> <block type="top8"></block>';
      toolbox7 += '</category> <category> </category>'; //close tops
      
      toolbox7 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block> <block type="bottom6"></block> <block type="bottom7"></block> <block type="bottom8"></block>';
      
      toolbox7 += '</category> <category> </category>'; //close bottoms
      
      toolbox7 += '<category name="+ Coloring"> <block type="get_color_var"></block> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox7 += '</category> <category> </category>'; //close coloring
      
      toolbox7 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="get_color_input"></block> <block type="control_repeat"></block>';
      toolbox7 += '</category> <category> </category>'; //close controls
      
      toolbox7 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox7 += '</category> <category> </category>'; //close definitions
      toolbox7 += '</xml>';
      
      /*
      if (CURRENT_LEVEL > 1) {
        toolbox += '<category name="+ Coloring"> <block type="get_color_var"></block> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
        toolbox += '</category> <category> </category>'; //close coloring
        if (CURRENT_LEVEL > 2) {
          toolbox += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="get_color_input"></block> <block type="control_repeat"></block>';
          toolbox += '</category> <category> </category>'; //close controls
          if (CURRENT_LEVEL > 3) {
            toolbox += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
            toolbox += '</category> <category> </category>'; //close definitions
          }
        }  
      }//*/
      
      switch(CURRENT_LEVEL)
      {
        case 1:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox1 } );
          break;
        case 2:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox2 } );
          break;
        case 3:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox3 } );
          break;
        case 4:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox4 } );
          break; 
        case 5:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox5 } );
          break;
        case 6:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox6 } );
          break;
        case 7:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox7 } );
          break;  
        default:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: toolbox1 } );
      }
      
      //Blockly.inject(document.getElementById('rosie-code'), {path: '../../blockly/', toolbox: } );
      
      document.getElementById('full_text_div').innerHTML= LEVELS_MSG[CURRENT_LEVEL - 1];
      document.getElementById('level-h').innerHTML= "Level " + CURRENT_LEVEL + " :";
    }
    
//---------------------------------------------------------------------------------------
// Utility functions                                                                                   
//---------------------------------------------------------------------------------------
	function setHtmlOpacity(id, opacity) {
      var el = document.getElementById(id);
      if (el) {
         if (opacity > 0) {
            el.style.zIndex = 100;
         } else {
            el.style.zIndex = -1;
         }
         el.style.opacity = opacity;
      }
   	}
    
    
    function fadeOutAfterDelay(id, delay) {
      window.setTimeout(function() { setHtmlOpacity(id, 0.0); }, delay);
    }
     
    function hideText() {
      document.getElementById('full_text_div').style.display='none';
      document.getElementById('more_btn').style.display='none';
      document.getElementById('part_text_div').style.display='inline';
    }
    
    function showText() {
      document.getElementById('more_btn').style.display='inline';
      document.getElementById('full_text_div').style.display='inline';
      document.getElementById('part_text_div').style.display='none';
    }    
   
//---------------------------------------------------------------------------
// Process dart event
//---------------------------------------------------------------------------
	var playing = false;
    function processEvent(event) {
      //var button = document.getElementById("play-button");
      if (event == "@blockly DONE" ||
          event == "@blockly RESTARTED" ||
          event == "@blockly PAUSED") {
         //button.style.backgroundImage = 'url("images/play.png")';
         //playing = false;
         console.log("HTML received message from dart" + event);
         
      }
      else if (event == "@blockly GOT IT!") {
        console.log("HTML received message from dart " + event);
        
         //button.style.backgroundImage = 'url("images/pause.png")';
         //playing = true;
      }
      
      else if (event == "@blockly DONE!") {
        console.log("HTML received message from dart " + event);
        playing = false;
        window.setTimeout(function() { advanceLevel(); }, 500);
      }
    }
       
//---------------------------------------------------------------------------------------
//  Check if blocks are connected (procedures are special case)                                                                               
//---------------------------------------------------------------------------------------
	function checkConnections(code) {
      var connected = true;
      var start = 0;
      var newLine = 0;
      while (start < code.length && start != -1) {
        newLine = code.indexOf("\n",start);
        var curlyBrace = code.indexOf("}" ,start);
        console.log(newLine); console.log(curlyBrace);
        if ( newLine > 0 ) {
        	if ( curlyBrace > 0) {
        		if ( newLine -1 != curlyBrace ) {
            		connected = false;
            		break;
          		}
          		else { start = newLine+2; }
        	}
        	else { connected = false; break; }
      	}
      	else { break; } 
      }
      
      return connected;
    }
    
//---------------------------------------------------------------------------------------
//  Send the generated Javascript code to dart for processing                                                                                  
//---------------------------------------------------------------------------------------
	function sendBlocklyCode() {
      if (!playing) {
        var code = Blockly.Generator.workspaceToCode('JavaScript');
        Blockly.mainWorkspace.traceOn(true);
        //--------------------------------------------------
        // error 1: no blocks on the screen
        //--------------------------------------------------
        if (code.length == 0) {
          setHtmlOpacity("hint1", 1.0);
          fadeOutAfterDelay("hint1", 4000);
        }
        
        else {
          var connected = checkConnections(code);
          
          //--------------------------------------------------
          // error 2: blocks aren't connected
          //--------------------------------------------------
          if (!connected) {
            setHtmlOpacity("hint2", 1.0);
            fadeOutAfterDelay("hint2", 4000);
          }
        
          else {
            code = code.replace(/\]\[/g, '], [');
            code = (code.replace(/\)/g, '')).replace(/\(/g, '');
            code = code.replace(/\;/g, '');
            if (socket != null && socket.readyState == 1) {
              alert(code);
              socket.send('@dart '+ code);
              playing = true;
              //window.location.reload(true);
            }
          }
        }
      
      }
    }