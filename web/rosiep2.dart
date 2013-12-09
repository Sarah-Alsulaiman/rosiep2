import 'dart:html';
import 'dart:json';
import 'dart:async';
import 'dart:math';


/** Websocket to connect with Blockly **/
WebSocket ws;

/** Global list of compiled outfits sequence **/
List outfits = new List(); 

/** Global list of procedures created by the user **/
List subroutines;

/** Global list of commands created by the user **/
List commands;

/** Canvas element to draw images **/
CanvasElement canvas;

/** Canvas context **/
CanvasRenderingContext2D context = null;

/** Original colors for each outfit **/
Map originals = new Map <String, String>();

/** Timer to call display periodically **/
Timer timer;

/** Image for the top part of the outfit **/
var TopImage;

/** Image for the bottom part of the outfit **/
var BottomImage;

/** Random Place **/
String CURRENT_PLACE;

/** Random Color **/
String CURRENT_COLOR;

/** Random weather **/
String CURRENT_WEATHER;

/** Colors available for each outfit **/
List colors = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];


String CONNECTION_ID;
List parts;

bool consider = true;
bool check_input = false;


//format [ [blockName, value, levels] ]
List blocks = [  ['repeat', false, 6], ['black', false, 6], ['grey', false, 6],  ['blue', false, 6], 
                 ['top', false, 1, 2, 3, 4, 5], ['bottom', false, 1, 2, 3, 4, 5, 6], 
                 ['top_purple', false, 2], ['bottom_purple', false, 2],
                 ['abstraction', false, 4, 5], ['call', false, 4, 5], ['func', false, 4, 5],
                 ['other', false, 3, 5], ['then', false, 3, 5],
                 ['color', false], ['get', false],['weather', false, 3],  ['going', false, 0], ['if', false, 3, 5],
                 
              ];


var CURRENT_LEVEL = 1;
String CURRENT_BLOCK = '';
String ERR_MSG = '';
String CHECK_AGAINST;
String ERROR_THEN;
String ERROR_OTHER;
bool procedure_wedding;
// write blocks[top] = true and then another map uses[top] = levels...
Map block_name = new Map <String, int>();
Map text = new Map <String, String> ();

//----------------------------------------------------------------------
// Main function
//----------------------------------------------------------------------
void main() {
  
  window.onMessage.listen((evt) {
    
    String msg = "${evt.data}";
    
    if (msg.startsWith("@dart")) {
      CURRENT_LEVEL = msg.substring(5,6);
      text['if'] = (CURRENT_LEVEL == "3")? "You need to account for an outfit for cold weather and another for hot weather" : "You need to account for an outfit to a wedding and another to a gym";
      parts = msg.split("#");
      randomize();
      /*if (CURRENT_LEVEL == "7") {
        var level7_top = "top2-";
        level7_top += CURRENT_COLOR;
        sendMessage("outfit " + level7_top);
      }*/
      
      compile(parts[1]);
      print('Dart received code from HTML ');
      
      if (outfits.length != 0) {
        Timer.run(() => display());
      }
      
      timer = new Timer.periodic(new Duration(milliseconds: 1000), (Timer t) {
        if (outfits.length == 0) {
          timer.cancel();
          
          if (check_input) {
            if (CURRENT_LEVEL == "3") {
              String background = CURRENT_WEATHER;
              sendMessage("bg " + background);
            }
            else if(CURRENT_LEVEL == "5") {
              String background = CURRENT_PLACE;
              sendMessage("bg " + background);
            }
            sendMessage("DONE!");
          }
          
          else
            sendMessage("error " + text[ERR_MSG]);
        }
        else {
          display();
        }
      });
      sendMessage("GOT IT!");
    }

  });
  
  block_name['repeat'] = 0;
  block_name['black'] = 1;
  block_name['grey'] = 2;
  block_name['blue'] = 3;
  
  block_name['top'] = 4;
  block_name['bottom'] = 5;
  block_name['top_purple'] = 6;
  block_name['bottom_purple'] = 7;
  
  block_name['abstraction'] = 8;
  block_name['call'] = 9;
  block_name['func'] = 10;
  
  block_name['other'] = 11;
  block_name['then'] = 12;
  block_name['color'] = 13;
  block_name['get'] = 14;
  block_name['weather'] = 15;
  block_name['going'] = 16;
  block_name['if'] = 17;
  
 
  
  text['repeat'] = "Rosie wants to repeat the process, <br> choose a block to repeat over and over again<br>";
  text['black'] = "Make sure you choose the color black <br> for one of the bottoms!";
  text['grey'] = "Make sure you choose the color grey <br> for one of the bottoms!";
  text['blue'] = "Make sure you choose the color blue <br> for one of the bottoms!";
  
  
  text['weather'] = "Remember, it might be hot or cold outside";
  
  
  text['top'] = "Make sure you choose both a top and a bottom";
  text['bottom'] = "Make sure you choose both a top and a bottom";
  
  text['top_purple'] = "Remember, dress code is purple! <br/> you can change the outfit color from the coloring menu<br>";
  text['bottom_purple'] = "Remember, dress code is purple! <br> you can change the outfit color from the coloring menu<br>";
  
  text['other'] = "Make sure you choose an outfit for each case";
  text['then'] = "Make sure you choose an outfit for each case";
  text['color'] = "Remember, top will only be either black or purple";
  text['get'] = "Choose a block to help you decide ";
  text['going'] = "Remember, there are two occasions";
 
  
  text['abstraction'] = "Make sure you fill the definition";
  text['call'] = "You created a definition but didn't use it!";
  text['func'] = "Outfit definitions menu help you create a shortcut";
  
  text['all_black'] = "Remember, Rosie doesn't want to wear all black!";
  text['not_black'] = "Remember, Rosie wants a black bottom <br> if the top is not black";
  
  
}


//--------------------------------------------------------------------------
// Compile user program
//--------------------------------------------------------------------------
void compile(String json) {
  outfits.clear();
  clearBlocks();
  
  ERR_MSG = '';
  procedure_wedding = false;
  check_input = true;
  //hideAll();          //for option1
  //prepareCanvas();  //for option2
  //removeAll();      //for option3
  
  var function_begin = json.indexOf('{');
  var function_end = json.lastIndexOf('}');
  
  if (function_end != -1 && function_begin != -1 ) {
    blocks[block_name['func']][1] = true; print("FUNC FOUND");
    var functionsLine = json.substring(function_begin, function_end+1);
    functionsLine = (((functionsLine.replaceAll('{', '')).replaceAll('}', ''))
                      .replaceAll('\n', '')).replaceAll('][', '], [');
    
    subroutines = parseCode(functionsLine);
  }
  
  var scriptIndex = (function_end+1 == -1) ? 0 : function_end+1;
  var script = json.substring(scriptIndex);
  
  commands = parseCode(script);
  
  interpret(commands, true);
  
// Validate user answers here...
  //format blocks = [ [blockName, value, levels] ]
  
  if (ERR_MSG.isEmpty) {
    validate();
    if (check_input) {
      if (ERROR_THEN.isNotEmpty) {
        ERR_MSG = ERROR_THEN;
        check_input = false;
      }
        
      if (ERROR_OTHER.isNotEmpty) {
        ERR_MSG = ERROR_OTHER;
        check_input = false;
      }
      
      if (CURRENT_LEVEL == "5" && ! procedure_wedding) {
        ERR_MSG = 'city';
        check_input = false;
      }
      
    }
    
    
  }
    
  
  else
    check_input = false;
}

//----------------------------------------------------------------------
// Validate use input
//----------------------------------------------------------------------

void validate() {
  for (var i= (blocks.length) - 1; i >= 0 ; i--) {
    var num_level = (blocks[i].length); 
    //print("NUM LEVEL = " + num_level.toString());
    for (var j=2; j< num_level; j++) { // first two elements are not levels
      if (blocks[i][j].toString() == CURRENT_LEVEL ) { // if current level needs this block
        //print("CURRENT LEVEL NEEDS " + blocks[i][0]);
        if (! blocks[i][1]) {
          //print( blocks[i][1].toString());
          ERR_MSG = blocks[i][0];
          break;
        }
        
      }
    }
    if (! ERR_MSG.isEmpty) {
      print (ERR_MSG + " NOT FOUND");
      check_input = false;
      break;
    }
      
  }
  
 
 
}
//--------------------------------------------------------------------------
// Parse JSON returned from the program
//--------------------------------------------------------------------------
List parseCode(code) {
  code = code.split('\n');
  List parsedCode;
  //print(code);
  
  for (int i=0; i<code.length; i++) {
    String f = '[ ${code[i]} ]';
    parsedCode = parse(f);
  }
  
  return parsedCode;
}



//--------------------------------------------------------------------------
// Interpret the user program
//--------------------------------------------------------------------------
void interpret (List commands, bool consider) { 
  for (int j=0; j<commands.length; j++) {
    if (commands[j] is !List || commands[j][0] == "GET") { //ensure output blocks are connected
      break;
    }
    else {
      List nested = commands[j] as List;
      //print("inner = ${nested.length} ");
      
      if (nested[0] == "if") {processIf(nested, consider);}
      else if (nested[0] == "SET") {/*processSet(nested, consider);*/}
      else if (nested[0] == "repeat") {processRepeat(nested, consider);}
      else if (nested[0] == "CALL") {processCall(nested, consider);}
      else { //not a block
        var part = nested[0];
        var color = nested[1];
        var weather = nested[2];
        var place = nested[3];
        
        var outfit = part+color;
        
        if (part.startsWith("top") && consider) { 
          blocks[block_name['top']][1]= true; print("TOP block now true"); 
          if (color == "purple")  blocks[block_name['top_purple']][1]= true;
          else blocks[block_name['top_purple']][1] = false;
        }
          
        else if (part.startsWith("bottom") && consider) {
          blocks[block_name['bottom']][1]= true; print("BOTTOM block now true"); 
          if (color == "purple")  blocks[block_name['bottom_purple']][1]= true;
          else if (color == "grey") blocks[block_name['grey']][1] = true;
          else if (color == "blue") {blocks[block_name['blue']][1] = true;}
          else if (color == "black") {blocks[block_name['black']][1] = true;} 
          else blocks[block_name['bottom_purple']][1] = false;
          
        }
        
        if (CURRENT_LEVEL == "3" && weather == "cold") {
          if (CHECK_AGAINST == "hot" ) {
            if (CURRENT_BLOCK == "then") {
              ERROR_THEN = 'weather_cold_mismatch'; print("COLD OUTFIT IN HOT DAY");
              /*if (weather != CURRENT_WEATHER && weather != "any") {
                ERR_MSG = "weather_mismatch"; 
              }
              else {  ERR_MSG = ''; //rewrite the value if outfit is suitable later
              }*/
              
            }
            else { ERROR_OTHER = '';}
          }
          
          else { //check against cold
            
            if (CURRENT_BLOCK == 'then') {
              ERROR_THEN = '';
            }
            else {  ERROR_OTHER = 'weather_cold_mismatch'; print("COLD OUTFIT IN HOT DAY");}
          }
          
        }
        
        else if( CURRENT_LEVEL == "3" && weather == "hot") {
          if (CHECK_AGAINST == "hot" ) {
            if(CURRENT_BLOCK == "then" ) {
              ERROR_THEN = '';
            }
            else {
              ERROR_OTHER = 'weather_hot_mismatch'; print("HOT OUTFIT IN COLD DAY");
            }
          }
          
          else { //check against cold
            if (CURRENT_BLOCK == "then") {
              ERROR_THEN = 'weather_hot_mismatch'; print("HOT OUTFIT IN COLD DAY");
            }
            else {
              ERROR_OTHER = '';
            }
          }
        }
        
        
        if (CURRENT_LEVEL == "5") {
          if (place != CURRENT_PLACE && place != "casual" ) {
            ERR_MSG = "place_mismatch";
          }
          else {  ERR_MSG = ''; //rewrite the value if outfit is suitable later
            
          }
          
          
        }
        
        if (consider) {
          outfits.add(outfit);
        }
      
      }
     }
   }
    
}


//--------------------------------------------------------------------------
// Repeat block
//--------------------------------------------------------------------------
void processRepeat(List nested, bool consider) {
  var count = nested[1];
  var block = nested[2];
  var outfit;
  
  blocks[block_name['repeat']][1] = true; print("repeat FOUND");
  
  for (var i=0; i < count; i++) {
    interpret(block, consider);
  }
}


//--------------------------------------------------------------------------
// CallFunction block
//--------------------------------------------------------------------------
void processCall(List nested, bool consider) {
  var funcName = nested[1];
  var block;
  var outfit;
  
  blocks[block_name['call']][1] = true; print("CALL FOUND");
  
  if (CURRENT_LEVEL == "5") {
    if (CHECK_AGAINST == "wedding") {
      if (CURRENT_BLOCK == "then") {
        procedure_wedding = true;
      }
      
    }
    else if (CHECK_AGAINST == "gym") {
      if (CURRENT_BLOCK =="other") {
        procedure_wedding = true;
      }
    }
    
  }
  
  for (int i=0; i < subroutines.length; i++) {
    if (funcName == subroutines[i][0]) {
      block = subroutines[i][1];
      if (block.length >= 1) {blocks[block_name['abstraction']][1] = true;}
      
      interpret(block, consider);
    }
  }
   
}



//--------------------------------------------------------------------------
// IF block
//--------------------------------------------------------------------------
void processIf(List nested, bool consider) {
  var condition = nested [1][0];
  var then = nested[2];
  var other = nested[3];
  List result;
  var outfit;
  
  blocks[block_name['if']][1] = true;
  
  if (then.length >= 1 ) {blocks[block_name['then']][1] = true; print("THEN POPULATED");}
  if (other.length >= 1) {blocks[block_name['other']][1] = true; print("OTHER POPULATED");}
  
  if (condition != 0) {
    if (condition == "Going") { //GOING TO block is connected to IF block
      blocks[block_name['going']][1] = true;
      CHECK_AGAINST = (nested[1][1] == "wedding")? "wedding" : "gym";
      if (nested[1][1] == CURRENT_PLACE) {
        CURRENT_BLOCK = 'then';
        interpret(then, true);
        CURRENT_BLOCK = 'other';
        interpret(other, false);
      }
      
      else {
        CURRENT_BLOCK = 'other';
        interpret(other, true);
        CURRENT_BLOCK = 'then';
        interpret(then, false);
        
      }
      
        
    }
    
    else if (condition == "weather") {
      blocks[block_name['weather']][1] = true;
      CHECK_AGAINST = (nested[1][1] == "hot")? "hot" : "cold";
      if (nested[1][1] == CURRENT_WEATHER) {
        CURRENT_BLOCK = 'then';
        interpret(then, true);
        CURRENT_BLOCK = 'other';
        interpret(other, false);
      }
      
      else {
        CURRENT_BLOCK = 'other';
        interpret(other, true);
        CURRENT_BLOCK = 'then';
        interpret(then, false);
        
      }
    }
      
     
    /*else  {  //GET block is connected to IF block ==> for unkown color levels
      blocks[block_name['get']][1] = true; 
      var part = nested[1][0][1][0];
      var color = nested[1][0][1][1] ;
      
      if (color == "black" || color == "purple") { blocks[block_name['color']][1] = true; print("COLOR CONNECTED");}
      
      
      consider = false;
      interpret(then);
      interpret(other);
      
      consider = true;
      result = (color == CURRENT_COLOR)? then : other;
      interpret(result);
      
      var sameColor = false;
      
      if (color == "black") {
           if ( then[0][1] == "black")
             ERR_MSG = "all_black";
            //print("NO! YOU MADE ALL BLACK");
          
          if (other[0][1] != "black")
            ERR_MSG = "not_black";
            //print("WHY OTHER NOT BLACK?");
      }
      
      else if (color == "purple") {
        if ( then[0][1] != "black")
          ERR_MSG = "not_black";
        
        if (other[0][1] == "black")
          ERR_MSG = "all_black";
        
      }
       
    }*/ 
    
  }
  
  else { //nothing is connected to if statement
    
    interpret(then, false);
    interpret(other, true);
    
  }
}

//--------------------------------------------------------------------------
// Generate random place and color
//--------------------------------------------------------------------------
void randomize() {
  
  var places = ['wedding', 'gym'];
  
  Random rnd = new Random();
  var x = rnd.nextInt(2);
  CURRENT_PLACE = places[x];
  text['place_mismatch'] = "Don't be silly! <br> you shouldn't wear this to a " + CURRENT_PLACE + ".";
  
  var colors = ['black', 'purple'];
  
  rnd = new Random();
  x = rnd.nextInt(2);
  CURRENT_COLOR = colors[x];
  
  var weather = ['hot', 'cold'];
  
  rnd = new Random();
  x = rnd.nextInt(2);
  CURRENT_WEATHER = weather[x];
   
  text['weather_hot_mismatch'] = "Don't be silly! <br> you shouldn't wear that top when it is cold!";
  text['weather_cold_mismatch'] = "Don't be silly! <br> you shouldn't wear a jacket when it is hot!";
  
}



//--------------------------------------------------------------------------
// Clear blocks
//--------------------------------------------------------------------------
void clearBlocks() {
  
  blocks[block_name['repeat']][1] = false;
  blocks[block_name['black']][1] = false;
  blocks[block_name['grey']][1] = false;
  blocks[block_name['blue']][1] = false;
  
  blocks[block_name['top']][1] = false;
  blocks[block_name['bottom']][1] = false;
  blocks[block_name['top_purple']][1] = false;
  blocks[block_name['bottom_purple']][1] = false;
  
  blocks[block_name['if']][1] = false;
  blocks[block_name['then']][1] = false;
  blocks[block_name['other']][1] = false;
  blocks[block_name['going']][1] = false;
  
  blocks[block_name['func']][1] = false;
  blocks[block_name['call']][1] = false;
  blocks[block_name['abstraction']][1] = false;
  
  blocks[block_name['get']][1] = false;
  blocks[block_name['color']][1] = false;
  
  blocks[block_name['weather']][1] = false;
  
}  

//--------------------------------------------------------------------------
// Display outfits from user's program 
//--------------------------------------------------------------------------
void display() {
  
  String outfit = outfits[0]; //print("current = $outfit");
    
    /**-------------------------------------------------------------------------------------
     * option1: Control imgVisibility on a div: (all images must be loaded in the HTML file)
     *--------------------------------------------------------------------------------------*/
    //setHtmlVisibility(outfit, true);
    
    sendMessage("outfit " + outfit);
    
    /**-------------------------------------------------------------------------------------
     * option2: Draw images on a Canvas (Add a canvas inside rosie-output div)
     *--------------------------------------------------------------------------------------*/
    /* draw(outfit); */
    
    
    /**-------------------------------------------------------------------------------------
     * option3: Append imageElement to the body: (No images are preloaded in the HTML file)
     *--------------------------------------------------------------------------------------*/
    /* addImageElement(outfit); */
    
    
  outfits.removeAt(0);
  
}

//--------------------------------------------------------------------------
// Send a message to the javascript blockly window
//--------------------------------------------------------------------------
void sendMessage(String message) {
  /*if (ws != null && ws.readyState == WebSocket.OPEN) {
    ws.send("@blockly#$CONNECTION_ID#$message");
  }*/
  var msg = "@blockly#$message";
  var origin = window.location.protocol + "//" + window.location.host;
  window.postMessage(msg, origin);
}


/* =====================================
 * 
 *    PREVIOUSLY USED FUNCTIONS
 * =====================================

//--------------------------------------------------------------------------
// Draw image on the screen
//--------------------------------------------------------------------------
void draw(outfit) {
  if(outfit.startsWith("top")) {
  TopImage.src = "images/$outfit.png";
  context.drawImage(TopImage, 0, 0);
  
  }
  else {
  BottomImage.src = "images/$outfit.png";
  context.drawImage(BottomImage, 0, 0);
  }
}

//--------------------------------------------------------------------------
// Control the visibility property of an image
//--------------------------------------------------------------------------
void setHtmlVisibility(String id, bool visible) {
  var variations = id.startsWith("top")? "top" : "bottom";
  hideVariations(variations);
  query("#$id").style.visibility = visible? "visible" : "hidden";
  print(id + ' ' + visible.toString());
}

//--------------------------------------------------------------------------
// Prepare canvas for drawing
//--------------------------------------------------------------------------
void prepareCanvas() {
  canvas = document.query("#rosie-canvas");
  context = canvas.getContext("2d");
  
  TopImage = new ImageElement();
  BottomImage = new ImageElement();
  
  TopImage.classes.add("top");
  TopImage.src = "images/top-blank.png";
  document.body.append(TopImage);
  
  BottomImage.classes.add("bottom");
  BottomImage.src = "images/bottom-blank.png";
  document.body.append(BottomImage);
  
  context.drawImage(TopImage, 0, 0);
  context.drawImage(BottomImage, 0, 0);
}


//--------------------------------------------------------------------------
// Hide all outfit images
//--------------------------------------------------------------------------
void hideAll () {
  hideVariations("top");
  hideVariations("bottom");
}


//--------------------------------------------------------------------------
// Hide all variations of a specific outfit part
//--------------------------------------------------------------------------
void hideVariations(String part) {
  for (int i=1; i<9; i++) {
    for (int j=0; j < colors.length; j++) {
      query("#$part$i-${colors[j]}").style.visibility = "hidden";
    }
  } 
}

//--------------------------------------------------------------------------
// Add an image element corrosponding to an outfit
//--------------------------------------------------------------------------
void addImageElement(String outfit) {
  var part = outfit.split("-");
  part = part[0].startsWith("top")? "top" : "bottom";
  var img = new ImageElement();
  img.src = "images/$outfit.png";
  img.classes.add(part);
  document.body.append(img);
  
}

//--------------------------------------------------------------------------
// Remove all outfit images
//--------------------------------------------------------------------------
void removeAll() {
  //TODO
 
}

//--------------------------------------------------------------------------
// Control the z-Index property of an image
//--------------------------------------------------------------------------
void setZIndex(id, z) {
  query("#$id").style.zIndex = z.toString();
  //bottomCounter++;
  
}

//--------------------------------------------------------------------------
// SET block
//--------------------------------------------------------------------------
void processSet(List nested) {
  var part = nested[1][0];
  var color;
  var outfit;
  
  if (nested[1][1] is !List) { //Color block is connected to SET block
    if (nested[1][1] != '0') {
      color = nested[1][1];
      outfit = "$part-$color";
      outfits.add(outfit);
    }
  }
  
  //GET block is connected to SET block 
  //{either get outfit from the list (user may changed the color in the code, or retain original color)
  else { 
    bool found = false;
    String match = nested[1][1][1][0]; 
    for (var i = outfits.length-1; i >=0 ; i--) { //search the list backwards for the last occurance of a match
      if (outfits[i].startsWith(match)) {
        var item = outfits[i].split("-");
        color = item[1]; 
        outfit = part+"-"+color;
        found = true;
        break;
      }
    }
    if (!found) {
      color = originals[match];
      outfit = part+"-"+color;
      found = false;
    }
    outfits.add(outfit);
  }
}

*/