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

/** Colors available for each outfit **/
List colors = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];


String CONNECTION_ID;
List parts;

bool consider = true;
bool check_input = false;

bool top_block = false;
bool bottom_block = false;

bool top_purple_block = false;
bool bottom_purple_block = false;

bool if_block = false;
bool then_block = false;
bool other_block = false;

bool going_block = false;

bool func_block = false;
bool call_block = false;
bool abstraction_block = false;

bool get_input_block = false;
bool get_var_block = false;

bool color_block = false;
bool black_block = false;

bool repeat_block = false;
bool set_block = false;

//format [ [blockName, value, levels] ]
List blocks = [  [ 'black', black_block, 7], ['top', top_block, 1, 2, 3, 4, 5], ['bottom', bottom_block, 1, 2, 3, 4, 5, 6, 7], 
                 ['top_purple', top_purple_block, 2], ['bottom_purple', bottom_purple_block, 2],
                 ['abstraction', abstraction_block, 4, 5], ['call', call_block, 4, 5], ['func', func_block, 4, 5],
                 ['other', other_block, 3, 5, 7], ['then', then_block, 3, 5, 7],
                 ['color', color_block, 7], ['get', get_input_block, 7], ['going', going_block, 3], ['if', if_block, 3, 5, 7],
                 
              ];


var CURRENT_LEVEL = 1;
var CURRENT_block;
String ERR_MSG = '';

// write blocks[top] = true and then another map uses[top] = levels...
Map block_name = new Map <String, int>();
Map text = new Map <String, String> ();

//----------------------------------------------------------------------
// Main function
//----------------------------------------------------------------------
void main() {
  
  initWebsocket();
  
  block_name['black'] = 0;
  
  block_name['top'] = 1;
  block_name['bottom'] = 2;
  block_name['top_purple'] = 3;
  block_name['bottom_purple'] = 4;
  
  block_name['abstraction'] = 5;
  block_name['call'] = 6;
  block_name['func'] = 7;
  
  block_name['other'] = 8;
  block_name['then'] = 9;
  block_name['color'] = 10;
  block_name['get'] = 11;
  block_name['going'] = 12;
  block_name['if'] = 13;
  
  
  
  text['black'] = "Make sure you choose the color black <br> for one of the bottoms!";
  
  text['top'] = "Make sure you choose both a top and a bottom";
  text['bottom'] = "Make sure you choose both a top and a bottom";
  
  text['top_purple'] = "Remember, dress code is purple! <br/> you can change the outfit color from the coloring menu<br>";
  text['bottom_purple'] = "Remember, dress code is purple! <br> you can change the outfit color from the coloring menu<br>";
  
  text['other'] = "Make sure you choose an outfit for each case";
  text['then'] = "Make sure you choose an outfit for each case";
  text['color'] = "Remember, top will only be either black or purple";
  text['get'] = "Choose a block to help you decide ";
  text['going'] = "Remember, there are two occasions";
  text['if'] = "Choose a block to help you decide";
  
  text['abstraction'] = "Make sure you fill the definition";
  text['call'] = "You created a definition but didn't use it!";
  text['func'] = "Outfit definitions menu help you create a shortcut";
  
  text['all_black'] = "Remember, Rosie doesn't want to wear all black!";
  text['not_black'] = "Remember, Rosie wants a black bottom <br> if the top is not black";
  
  
}

//--------------------------------------------------------------------------
// Web socket initialization
//--------------------------------------------------------------------------
void initWebsocket() {
  
  ws = new WebSocket("ws://localhost:8080");
  
  ws.onOpen.listen((e) { print('Dart Connected.'); } );
  ws.onError.listen((e) { print ("Dart Socket error"); } );
  ws.onClose.listen((e) { print('Dart web socket closed'); } );
  
  ws.onMessage.listen((evt) {
    if (evt.data.startsWith("@dart")) {
      CURRENT_LEVEL = evt.data.substring(5,6);
      print("CURRENT LEVEL = " + CURRENT_LEVEL);
      ////////////////////////////////////////////////////////
      
      parts = evt.data.split("#");
      CONNECTION_ID = parts[1];
      print("DATA CAME FROM CONNECTION = " + CONNECTION_ID);
      
      
      //////////////////////////////////////////////////////
      randomize();
      if (CURRENT_LEVEL == "7") {
        var level7_top = "top2-";
        level7_top += CURRENT_COLOR;
        sendMessage("outfit " + level7_top);
      }
      
      //compile(evt.data.substring(6)); 
      print("COMPILE THIS: " + parts[2]);
      compile(parts[2]);
      
      print('Dart received code from HTML ');
      
      if (outfits.length != 0) {
        Timer.run(() => display());
      }
      
      timer = new Timer.periodic(new Duration(milliseconds: 1000), (Timer t) {
        if (outfits.length == 0) {
          timer.cancel();
          if (check_input) {
            if (CURRENT_LEVEL == "3" || CURRENT_LEVEL == "5") {
              String background = CURRENT_PLACE;
              sendMessage("bg " + background);
            }
            sendMessage("DONE!");
          }
            
          else
            sendMessage("error " + text[ERR_MSG]);
        }
        else {
          //if (check_input)
          display();
        }
        });
      sendMessage("GOT IT!");
    }
    
  });  
  
}

//--------------------------------------------------------------------------
// Compile user program
//--------------------------------------------------------------------------
void compile(String json) {
  outfits.clear();
  clearBlocks();
  
  ERR_MSG = '';
  
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
  //print(commands);
  
  
  interpret(commands);
  
  // Validate user answers here...
  //format blocks = [ [blockName, value, levels] ]
  
  if (ERR_MSG.isEmpty)
    validate();
  
  else
    check_input = false;
}


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
  
  /*if (! ERR_MSG.isEmpty) {
    print (ERR_MSG + " NOT FOUND");
    check_input = false;
  }*/
 
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
// Interpret the user program
//--------------------------------------------------------------------------
void interpret (List commands) { 
  for (int j=0; j<commands.length; j++) {
    if (commands[j] is !List || commands[j][0] == "GET") { //ensure output blocks are connected
      break;
    }
    else {
      List nested = commands[j] as List;
      //print("inner = ${nested.length} ");
      
      if (nested[0] == "if") {processIf(nested);}
      else if (nested[0] == "SET") {processSet(nested);}
      else if (nested[0] == "repeat") {processRepeat(nested);}
      else if (nested[0] == "CALL") {processCall(nested);}
      else { //not a block
        var part = nested[0];
        var color = nested[1];
        if (color == 'current_color') {
          color = CURRENT_COLOR;
          get_var_block = true; print("GET VAR FOUND");
        }
        var outfit = part+color;
          
        if (part.startsWith("top")) { 
          blocks[block_name['top']][1]= true; print("TOP block now true"); 
          if (color == "purple")  blocks[block_name['top_purple']][1]= true;
          else blocks[block_name['top_purple']][1] = false;
        }
          
        else if (part.startsWith("bottom")) {
          blocks[block_name['bottom']][1]= true; print("BOTTOM block now true"); 
          if (color == "purple") blocks[block_name['bottom_purple']][1] = true;
          else if (color == "black") {blocks[block_name['black']][1] = true; print("BLACK!!!!!");} 
          else blocks[block_name['bottom_purple']][1] = false;
        }
        
        if (consider)
          outfits.add(outfit);
          
  
      }
     }
   }
    
}

//--------------------------------------------------------------------------
// Process nested block
//--------------------------------------------------------------------------
void addOutfit(block) {
  var outfit;
  if (block is !List) {
    for (var j=0; j<block.length; j++) {
      outfit = block[j][0];
      outfit = outfit+block[j][1];
      outfits.add(outfit); // add to our global list of outfits 
      print("ADD OUTFIT FUNCTION");
    }
  }
  else { interpret(block); }
  
}
//--------------------------------------------------------------------------
// Repeat block
//--------------------------------------------------------------------------
void processRepeat(List nested) {
  var count = nested[1];
  var block = nested[2];
  var outfit;
  
  for (var i=0; i < count; i++) {
    addOutfit(block);
  }
}


//--------------------------------------------------------------------------
// CallFunction block
//--------------------------------------------------------------------------
void processCall(List nested) {
  var funcName = nested[1];
  var block;
  var outfit;
  
  blocks[block_name['call']][1] = true; print("CALL FOUND");
  for (int i=0; i < subroutines.length; i++) {
    if (funcName == subroutines[i][0]) {
      block = subroutines[i][1];
      if (block.length >= 1) {blocks[block_name['abstraction']][1] = true;}
      
      addOutfit(block);
    }
  }
   
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


//--------------------------------------------------------------------------
// IF block
//--------------------------------------------------------------------------
void processIf(List nested) {
  var condition = nested [1][0];
  var then = nested[2];
  var other = nested[3];
  List result;
  var outfit;
  
  if_block = true;
  blocks[block_name['if']][1] = true;
  
  if (then.length >= 1 ) {blocks[block_name['then']][1] = true; print("THEN POPULATED");}
  if (other.length >= 1) {blocks[block_name['other']][1] = true; print("OTHER POPULATED");}
  
  if (condition != 0) {
    if (condition == "Going") { //GOING TO block is connected to IF block
      blocks[block_name['going']][1] = true;
      
      consider = false;
      addOutfit(then);
      addOutfit(other);
      
      consider = true;
      result = (nested[1][1] == CURRENT_PLACE)? then : other;
      //result could be empty!
      if (result.length != 0)
        addOutfit(result);
        //print("result = " + result.length.toString());
        //result could also be SET or REPEAT
        
    }
      
     
    else  {  //GET block is connected to IF block ==> for unkown color levels
      blocks[block_name['get']][1] = true; 
      var part = nested[1][0][1][0];
      var color = nested[1][0][1][1] ;
      
      if (color == "black" || color == "purple") { blocks[block_name['color']][1] = true; print("COLOR CONNECTED");}
      
      
      consider = false;
      addOutfit(then);
      addOutfit(other);
      
      consider = true;
      result = (color == CURRENT_COLOR)? then : other;
      addOutfit(result);
      
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
       
    } 
    
  }
}

//--------------------------------------------------------------------------
// Generate random place and color
//--------------------------------------------------------------------------
void randomize() {
  
  var places;
  if (CURRENT_LEVEL == "3") {
    places = ['gym', 'restaurant'];
  }
  
  else {
    places = ['formal', 'concert'];
  }
  
  
  Random rnd = new Random();
  var x = rnd.nextInt(2);
  
  CURRENT_PLACE = places[x];
  
  var colors = ['black', 'purple'];
  
  rnd = new Random();
  x = rnd.nextInt(2);
  
  CURRENT_COLOR = colors[x];
  
}



//--------------------------------------------------------------------------
// Clear blocks
//--------------------------------------------------------------------------
void clearBlocks() {
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
  blocks[block_name['black']][1] = false;
  
  //blocks[block_name['repeat']][1] = false;
  
  get_var_block = false;
  
  set_block = false;
  color_block = false;
  
  print("BLOCKS CLEAERD");
}  

//--------------------------------------------------------------------------
// Send a message to the javascript blockly window
//--------------------------------------------------------------------------
void sendMessage(String message) {
  if (ws != null && ws.readyState == WebSocket.OPEN) {
    ws.send("@blockly#$CONNECTION_ID#$message");
  }
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