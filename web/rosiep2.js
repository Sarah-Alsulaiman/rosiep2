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
                       
    var colors = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];
    
    
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
	
		//Blockly.Workspace.prototype.traceOn = true;
      //***********************************************************************************************
      Blockly.makeColour = function(hue, sat, val) {
		  return goog.color.hsvToHex(hue, sat,
		      val * 256);
		};
      //***********************************************************************************************
      Blockly.Block.prototype.setColour = function(colourHue, colourSat, colourVal) {
		  this.colourHue_ = colourHue;
		  this.colourSat_ = colourSat;
		  this.colourVal_ = colourVal;
		  
		  if (this.svg_) {
		    this.svg_.updateColour();
		  }
		  if (this.mutator) {
		    this.mutator.updateColour();
		  }
		  if (this.comment) {
		    this.comment.updateColour();
		  }
		  if (this.warning) {
		    this.warning.updateColour();
		  }
		  if (this.rendered) {
		    // Bump every dropdown to change its colour.
		    for (var x = 0, input; input = this.inputList[x]; x++) {
		      for (var y = 0, title; title = input.titleRow[y]; y++) {
		        title.setText(null);
		      }
		    }
		    this.render();
		  }
		};
		
		//***********************************************************************************************
		/**
		 * Change the colour of a block.
		 */
		Blockly.BlockSvg.prototype.updateColour = function() {
		  var hexColour = Blockly.makeColour(this.block_.getColourH(), this.block_.getColourS(), this.block_.getColourV());
		  var rgb = goog.color.hexToRgb(hexColour);
		  var rgbLight = goog.color.lighten(rgb, 0.3);
		  var rgbDark = goog.color.darken(rgb, 0.4);
		  this.svgPathLight_.setAttribute('stroke', goog.color.rgbArrayToHex(rgbLight));
		  this.svgPathDark_.setAttribute('fill', goog.color.rgbArrayToHex(rgbDark));
		  this.svgPath_.setAttribute('fill', hexColour);
		};
		//************************************************************************************************
		Blockly.Block.prototype.getColourH = function() {
		  return this.colourHue_;
		};
		//************************************************************************************************
		Blockly.Block.prototype.getColourS = function() {
		  return this.colourSat_;
		};
		//*************************************************************************************************
		Blockly.Block.prototype.getColourV = function() {
		  return this.colourVal_;
		};
		//*************************************************************************************************
      
	       Blockly.FieldDropdown.prototype.showEditor_ = function() {
		  var svgGroup = Blockly.FieldDropdown.svgGroup_;
		  var svgOptions = Blockly.FieldDropdown.svgOptions_;
		  var svgBackground = Blockly.FieldDropdown.svgBackground_;
		  var svgShadow = Blockly.FieldDropdown.svgShadow_;
		  // Erase all existing options.
		  goog.dom.removeChildren(svgOptions);
		  // The menu must be made visible early since otherwise BBox and
		  // getComputedTextLength will return 0.
		  Blockly.removeClass_(svgGroup, 'blocklyHidden');
		  Blockly.FieldDropdown.openDropdown_ = this;
		
		  function callbackFactory(value) {
		    return function(e) {
		      if (this.changeHandler_) {
		        // Call any change handler, and allow it to override.
		        var override = this.changeHandler_(value);
		        if (override !== undefined) {
		          value = override;
		        }
		      }
		      if (value !== null) {
		        this.setValue(value);
		      }
		      // This mouse click has been handled, don't bubble up to document.
		      e.stopPropagation();
		    };
		  }
		
		  var maxWidth = 0;
		  var resizeList = [];
		  var checkElement = null;
		  var options = this.getOptions_();
		  for (var x = 0; x < options.length; x++) {
		    var text = options[x][0];  // Human-readable text.
		    var value = options[x][1]; // Language-neutral value.
		    var gElement = Blockly.ContextMenu.optionToDom(text);
		    var rectElement = /** @type {SVGRectElement} */ (gElement.firstChild);
		    var textElement = /** @type {SVGTextElement} */ (gElement.lastChild);
		    svgOptions.appendChild(gElement);
		    // Add a checkmark next to the current item.
		    if (!checkElement && value == this.value_) {
		      checkElement = Blockly.createSvgElement('text',
		          {'class': 'blocklyMenuText', 'y': 15}, null);
		      // Insert the checkmark between the rect and text, thus preserving the
		      // ability to reference them as firstChild and lastChild respectively.
		      gElement.insertBefore(checkElement, textElement);
		      checkElement.appendChild(document.createTextNode('\u2713'));
		    }
		
		    gElement.setAttribute('transform',
		        'translate(0, ' + (x * Blockly.ContextMenu.Y_HEIGHT) + ')');
		    resizeList.push(rectElement);
		    Blockly.bindEvent_(gElement, 'mousedown', null, Blockly.noEvent);
		    Blockly.bindEvent_(gElement, 'mouseup', this, callbackFactory(value));
		    Blockly.bindEvent_(gElement, 'mouseup', null,
		                       Blockly.FieldDropdown.hide);
		    // Compute the length of the longest text length.
		    maxWidth = Math.max(maxWidth, textElement.getComputedTextLength());
		  }
		  // Run a second pass to resize all options to the required width.
		  maxWidth += Blockly.ContextMenu.X_PADDING * 2;
		  for (var x = 0; x < resizeList.length; x++) {
		    resizeList[x].setAttribute('width', maxWidth);
		  }
		  if (Blockly.RTL) {
		    // Right-align the text.
		    for (var x = 0, gElement; gElement = svgOptions.childNodes[x]; x++) {
		      var textElement = gElement.lastChild;
		      textElement.setAttribute('text-anchor', 'end');
		      textElement.setAttribute('x', maxWidth - Blockly.ContextMenu.X_PADDING);
		    }
		  }
		  if (checkElement) {
		    if (Blockly.RTL) {
		      // Research indicates that RTL checkmarks are supposed to be drawn the
		      // same in the same direction as LTR checkmarks.  It's only the alignment
		      // that needs to change.
		      checkElement.setAttribute('text-anchor', 'end');
		      checkElement.setAttribute('x', maxWidth - 5);
		    } else {
		      checkElement.setAttribute('x', 5);
		    }
		  }
		  var width = maxWidth + Blockly.FieldDropdown.CORNER_RADIUS * 2;
		  var height = options.length * Blockly.ContextMenu.Y_HEIGHT +
		               Blockly.FieldDropdown.CORNER_RADIUS + 1;
		  svgShadow.setAttribute('width', width);
		  svgShadow.setAttribute('height', height);
		  svgBackground.setAttribute('width', width);
		  svgBackground.setAttribute('height', height);
		  //var hexColour = Blockly.makeColour(this.block_.getColourH(), this.block_.getColourS(), this.block_.getColourV());
		  var hexColour = Blockly.makeColour(this.sourceBlock_.getColourH(), this.sourceBlock_.getColourS(), this.sourceBlock_.getColourV());
		  svgBackground.setAttribute('fill', hexColour);
		  // Position the dropdown to line up with the field.
		  var xy = Blockly.getSvgXY_(/** @type {!Element} */ (this.borderRect_));
		  var borderBBox = this.borderRect_.getBBox();
		  var x;
		  if (Blockly.RTL) {
		    x = xy.x - maxWidth + Blockly.ContextMenu.X_PADDING + borderBBox.width -
		        Blockly.BlockSvg.SEP_SPACE_X / 2;
		  } else {
		    x = xy.x - Blockly.ContextMenu.X_PADDING + Blockly.BlockSvg.SEP_SPACE_X / 2;
		  }
		  svgGroup.setAttribute('transform',
		      'translate(' + x + ', ' + (xy.y + borderBBox.height) + ')');
		};
	       //**********************************************************************************************************************
	      
	      
	      Blockly.FieldDropdown.prototype.setText = function(text) {
	  if (this.sourceBlock_) {
	    // Update arrow's colour.
	     //var hexColour = Blockly.makeColour(this.block_.getColourH(), this.block_.getColourS(), this.block_.getColourV());
	    this.arrow_.style.fill = Blockly.makeColour(this.sourceBlock_.getColourH(), this.sourceBlock_.getColourS(), this.sourceBlock_.getColourV());
	  }
	  if (text === null) {
	    // No change if null.
	    return;
	  }
	  this.text_ = text;
	  // Empty the text element.
	  goog.dom.removeChildren(/** @type {!Element} */ (this.textElement_));
	  // Replace whitespace with non-breaking spaces so the text doesn't collapse.
	  text = text.replace(/\s/g, Blockly.Field.NBSP);
	  if (!text) {
	    // Prevent the field from disappearing if empty.
	    text = Blockly.Field.NBSP;
	  }
	  var textNode = document.createTextNode(text);
	  this.textElement_.appendChild(textNode);
	
	  // Insert dropdown arrow.
	  if (Blockly.RTL) {
	    this.textElement_.insertBefore(this.arrow_, this.textElement_.firstChild);
	  } else {
	    this.textElement_.appendChild(this.arrow_);
	  }
	
	  // Cached width is obsolete.  Clear it.
	  this.size_.width = 0;
	
	  if (this.sourceBlock_ && this.sourceBlock_.rendered) {
	    this.sourceBlock_.render();
	    this.sourceBlock_.bumpNeighbours_();
	    this.sourceBlock_.workspace.fireChangeEvent();
	  }
	};
      
      //***********************************************************************************************************************
      //***********************************************************************************************************************
      
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
      
      toolbox3 += '<category name = "+ Controls">  <block type = "control_if"></block> <block type="going_to"></block>  <block type="control_repeat"></block>';
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
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox1 } );
          break;
        case 2:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox2 } );
          break;
        case 3:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox3 } );
          break;
        case 4:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox4 } );
          break; 
        case 5:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox5 } );
          break;
        case 6:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox6 } );
          break;
        case 7:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox7 } );
          break;  
        default:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: toolbox1 } );
      }
      
      //Blockly.inject(document.getElementById('rosie-code'), {path: '../blockly/', toolbox: } );
      
      
      
      document.getElementById('full_text_div').innerHTML= LEVELS_MSG[CURRENT_LEVEL - 1];
      document.getElementById('level-h').innerHTML= "Level " + CURRENT_LEVEL + " :";
      populate();
    }
    
//---------------------------------------------------------------------------------------
// Utility functions                                                                                   
//---------------------------------------------------------------------------------------
	
	function setHtmlVisibility(id, visible) {
	  console.log("id = " + id);
      var el = document.getElementById(String(id));
      console.log("el = " + el);
      var variation = id.substring(0,1);
      variation = (variation == "t")? "top" : "bottom";
  	  console.log("variation = " + variation);
  	   
  	   for (var i=1; i<9; i++) {
	    for (var j=0; j < colors.length; j++) {
	    	var item = variation.concat(i.toString(),"-",colors[j].toString());
	    	console.log("item = " + item);
	    	item = document.getElementById(item);
	        item.style.visibility = "hidden";
	    }
	  } 
  	 
  	  
      if (el) {
         el.style.visibility = visible ? "visible" : "hidden";
      }
   }
   
   
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
      
      else {		// received an outfit to display
      		var check = event.substring(0,8);
      		if ( check == "@blockly" ) {
	      		console.log("HTML received message from dart for " + event);
	      		var outfit = event.substring(9);
	      		setHtmlVisibility(outfit, true);
	      }
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