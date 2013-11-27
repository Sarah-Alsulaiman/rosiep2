
//-----------------------------------------------------------------------------------------
// Global Level variables                                                                   
//------------------------------------------------------------------------------------------
	var MAX_LEVEL = 7;
    var MIN_LEVEL = 1;
    var CURRENT_LEVEL = getLevel();
    var LEVELS_MSG = [" Rosie is going to a resturant with her friend, Jasmin. <BR/> &nbsp;&nbsp;&nbsp;&nbsp; Help her decide what to wear. ",
                        " Rosie is invited to a party. Dress code is purple. <BR/> &nbsp;&nbsp;&nbsp;&nbsp; Help Rosie decide what to wear. ",
                        " Rosie wants to go out for a walk. It might be hot or cold outside. Help Rosie choose her outfit for both cases",
                        " Rosie want you to help her pick an outfit that would be her favorite to wear on formal occasions. define an outfit and use it",
                        " Rosie in invited to a wedding. She also wants to go to the gym.<BR/> Help Rosie on both cases",
                        " Rosie is wearing a top and wants to wear a matching bottom that comes in black, grey and pink, she wants to try them all",
                        " Rosie wore a top that is either black or purple, when she wears a black top, she doesn't want to wear a black bottom, otherwise she wants the bottom to be black. Pick a bottom so that she doesn't wear all black (hint: check new blocks in the control section!)"
                       ];
                       
    var colors = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];
    var playing = false;
    var error = '';
    var img_blank;
    //var xml_text1 = '<xml> <block type="procedures_defnoreturn" x="351" y="285"> <mutation></mutation> <title name="NAME">formal</title> <statement name="STACK"> <block type="top1"></block> </statement> </block> <block type="procedures_defnoreturn" x="355" y="255"> <block type="top2"> </block></block> </xml>';
    //var xml_text2 = '<xml> <block type="procedures_defnoreturn" x="351" y="285"> </block></xml>';
    var xml_text = '<xml> </xml>';
    
    var compare_procedure = '';
    
    var CONNECTION_ID;
    
    var tipImg;
    var originalTop;
    var originalBottom;
    var tempImg;
    var Zindex = 3;
    
    var dafault_procedure = false;
//-----------------------------------------------------------------------------------------
// store procedures in session storage	                                                                 
//------------------------------------------------------------------------------------------  
    
    function storeProcedure () {
    
    	var saved_procedure = '';
    	
    	var current_xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    	curret_xml_text = Blockly.Xml.domToText(current_xml);
    	
    	xmlDoc = loadXMLString(curret_xml_text);
    	
    	x = xmlDoc.getElementsByTagName('block');
    	for (i=0; i < x.length; i++) {
  			if (x[i].parentNode.nodeName == 'xml') {
  				att = x.item(i).attributes.getNamedItem("type");
  				if ( att.value == 'procedures_defnoreturn') {
  					cloneNode=x[i].cloneNode(true);
  					saved_procedure += Blockly.Xml.domToText(cloneNode);
  					saved_procedure += "#";
  				}
  			}
  		}
  		
  		sessionStorage.procedure = saved_procedure;
	}
	
	  
//------------------------------------------------------------------------------------------
// Attempt to open a web socket connection
//------------------------------------------------------------------------------------------
	/*var socket = null;
    if ("WebSocket" in window) {
      socket = new WebSocket("ws://localhost:8080");
      socket.onopen    = function(evt) { console.log("HTML connected."); }
      socket.onmessage = function(evt) { processEvent(evt.data); }
      socket.onerror   = function(evt) { console.log("HTML error in server connection"); }
      socket.onclose   = function(evt) { console.log("HTML server connection closed."); }
      
    }*/
    
    window.addEventListener("message", processEvent, false);
    
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
		storeProcedure();
      if (CURRENT_LEVEL < MAX_LEVEL) {
        $.jqDialog.confirm("Congratulations!<BR/> <BR/> Are you ready to proceed to level %1?".replace('%1', CURRENT_LEVEL + 1),
        function() { window.location = window.location.protocol + '//' +
                     window.location.host + window.location.pathname +
                     '?level=' + (CURRENT_LEVEL + 1); },    // callback function for 'YES' button
        
        function() {  }    // callback function for 'NO' button
        );  
      }
      
      else {
        $.jqDialog.alert("<br>End of game", function() { }); // callback function for 'OK' button
      }   
    }
 
 

//---------------------------------------------------------------------------
// Show error message
//---------------------------------------------------------------------------
	function showError () {
	
		$.jqDialog.alert("Are you missing something?<br><br>" + error, function() { }); // callback function for 'OK' button
      
    }
   
//---------------------------------------------------------------------------
// Populate images
//---------------------------------------------------------------------------
	function populate() {
		
		/*var bgImg = document.createElement("img");
        bgImg.src = 'images/gym.png';
        bgImg.id = 'gym';
        bgImg.className = 'background';
        document.getElementById("images").appendChild(bgImg);*/
		
      	var COLORS = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];
      	for (var i=1; i < 9; i++ ) {
        	for (var j=0; j < COLORS.length; j++ ) {
          		var imgT=document.createElement("img");
          		imgT.src = 'images/top'+ i + '-' + COLORS[j] +'.png';
          		imgT.id = 'top'+ i + '-' + COLORS[j];
          		imgT.className = 'top';
          		document.getElementById("images").appendChild(imgT);
          		
          		var imgB= document.createElement("img");
          		imgB.src = 'images/bottom'+ i + '-' + COLORS[j] +'.png';
          		imgB.id = 'bottom'+ i + '-' + COLORS[j];
          		imgB.className = 'bottom';
          		document.getElementById("images").appendChild(imgB);
          		//console.log(img.src);
          		
        	}
      	}
      	
      	img_blank = document.createElement("img");
      	img_blank.src = 'images/blank.png';
      	img_blank.id = 'blank';
      	img_blank.className = 'top';
      	document.getElementById("images").appendChild(img_blank);
      	
      	if (CURRENT_LEVEL == 6)
      		document.getElementById('top5-black').style.visibility = "visible";
      	else if (CURRENT_LEVEL == 7)
      		img_blank.style.visibility = "visible";
      		
      	
      	
      	//console.log("POPULATE FINISHED");
      		
      		
    }	
    	
//---------------------------------------------------------------------------------------
// Utility functions                                                                                   
//---------------------------------------------------------------------------------------
	
	function setHtmlVisibility(id, visible) {
		var el = document.getElementById(String(id));
   	   	var variations = id.substring(0,3);
      	
      	if (variations == "top") { variations = "top"; originalTop = id;}
      	else if (variations == "bot") { variations = "bottom"; originalBottom = id; }
      	else variations = "background";
      	
  	   	hideVariations(variations);
  	   	
  	   	if (CURRENT_LEVEL == 6)
      		document.getElementById('top5-black').style.visibility = "visible";
      		
  	   	img_blank.style.visibility = "hidden";
  	  	
      	if (el) {
      		el.style.visibility = visible ? "visible" : "hidden";
      		el.style.zIndex = Zindex++;
      	}
   	}
   	
   	
   	function hideVariations (variation) {
   		if (variation == "top" || variation == "bottom") {
   			for (var i=1; i<9; i++) {
   				for (var j=0; j < colors.length; j++) {
   					var item = variation.concat(i.toString(),"-",colors[j].toString());
	    			//console.log("item = " + item);
	    			item = document.getElementById(item);
	        		item.style.visibility = "hidden";
	        		
	    		}
	  		}	 
  	 	}
   		
   		
   			
   		var places = ['gym', 'wedding', 'hot', 'cold'];
   			
   		for ( var i=0; i < places.length; i++) {
   			var bg = document.getElementById(places[i]);
   			bg.style.visibility = "hidden";
   		}
   			
   	}
   
   
    function hideAll() {
    
    	hideVariations("top");
    	hideVariations("bottom");
   
    }
    
	function setHtmlOpacity(id, opacity) {
		var el = document.getElementById(id);
      	if (el) {
      		if (opacity > 0) {
      			el.style.zIndex = 100;
         	} else {
            	el.style.zIndex = -1; }
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
	
    function processEvent(event) {
    	var event = event.data;
      var check = event.substring(0,8);
      
      /*if (check == "your id=" ) {
      
      	CONNECTION_ID = event.substring(8);
      	//alert("YOUR CONNECTION IS " + CONNECTION_ID);
      	
      }*/
      
      
      if ( check == "@blockly" ) {
      	console.log("HTML received message from dart " + event);
      	
      	var parts = event.split('#');
      	
      		
      		if (parts[1].substring(0, 6) == "error ") {
      		playing = false;
      		error = parts[1].substring(6);
      		showError();
	      	}
	      	
	      	else if (parts[1] == "GOT IT!") {
	        	//console.log("HTML received message from dart " + event);
	      	}
	      	
	      	else if (parts[1] == "DONE!") {
	        	//console.log("HTML received message from dart " + event);
	        	playing = false;
	        	window.setTimeout(function() { advanceLevel(); }, 500);
	      	}
	      	
	      	else if (parts[1].substring(0, 3) == "bg ") {  //received bg to display
	      		//console.log("HTML received message from dart for background " + event);
		      	var bg = parts[1].substring(3);
		      	setHtmlVisibility(bg, true);
	      	}
	      	
	      	
	      	else {		// received an outfit to display
	      		//console.log("HTML received message from dart for outfit " + event);
		      	var outfit = parts[1].substring(7);
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
      var length = code.length;
      var amount = 0;
      while (start < code.length && start != -1) {
        newLine = code.indexOf("\n",start);
        var curlyBrace = code.indexOf("}" ,start);
        console.log("start from:"+start);
        console.log("new line at:"+newLine);
        console.log("curleyBrace at:"+curlyBrace);
        console.log("length="+length);
        if ( newLine > 0 ) {
        	if ( curlyBrace > 0) {
        		if ( newLine -1 != curlyBrace ) {
            		connected = false;
            		break;
          		}
          		else { start = newLine+3; amount += (curlyBrace - amount) ; console.log("amount="+amount); length -= Math.abs(amount) } //++ for multiple procedures...
        	}
        	else { connected = false; break; } ///++++++
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
        //alert(code);
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
            //if (socket != null && socket.readyState == 1) {
              //alert(code);
              
              //socket.send('@dart'+ CURRENT_LEVEL + '-' + CONNECTION_ID + '-' + code);
              hideAll();
              //code = '@dart'+ CURRENT_LEVEL + '#' + CONNECTION_ID + '#' + code;
              //socket.send(code);
              
              code = '@dart'+ CURRENT_LEVEL + '#' + code;
              var origin = window.location.protocol + "//" + window.location.host;
   			  window.postMessage(code, origin);
   
              tempImg = '';
              playing = true;
              //window.location.reload(true);
            //}
          }
        }
      
      }
      
      else {
      	alert("still generating previous outfit");
      
      }
    }
    
    
//----------------------------------------------------------------------------------------
// Inject blockly to this page and display the message corrosponding to the current level
// Blockly redefined functions
//----------------------------------------------------------------------------------------
	function inject() {     populate();
	
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
     
     
/**
 * Ensure two identically-named procedures don't exist.
 * @param {string} name Proposed procedure name.
 * @param {!Blockly.Block} block Block to disambiguate.
 * @return {string} Non-colliding name.
 */
Blockly.Procedures.findLegalName = function(name, block) {
  if (block.isInFlyout) {
    // Flyouts can have multiple procedures called 'procedure'.
    return name;
  }
  while (!Blockly.Procedures.isLegalName(name, block.workspace, block)) {
    // Collision with another procedure.
    var r = name.match(/^(.*?)(\d+)$/);
    if (!r) {
      if (default_procedure) { name+= 'name'; default_procedure = false;}
      name += '1';
    } else {
      name = r[1] + (parseInt(r[2], 10) + 1);
    }
  }
  return name;
};
      
      
      /**
 * Does this procedure have a legal name?  Illegal names include names of
 * procedures already defined.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block} opt_exclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is legal.
 */
Blockly.Procedures.isLegalName = function(name, workspace, opt_exclude) {
	if (name === "") { default_procedure = true; return false;}
  var blocks = workspace.getAllBlocks();
  // Iterate through every block and check the name.
  for (var x = 0; x < blocks.length; x++) {
    if (blocks[x] == opt_exclude) {
      continue;
    }
    var func = blocks[x].getProcedureDef;
    if (func) {
      var procName = func.call(blocks[x]);
      if (Blockly.Names.equals(procName[0], name)) {
        return false;
      }
    }
  }
  return true;
};
      
      Blockly.Tooltip.svgImg_ = null;
      
/**
 * Delay before tooltip appears.
 */
Blockly.Tooltip.HOVER_MS = 100;
      

/**
 * When hovering over an element, schedule a tooltip to be shown.  If a tooltip
 * is already visible, hide it if the mouse strays out of a certain radius.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Tooltip.onMouseMove_ = function(e) {
 // if (!Blockly.Tooltip.element_ || !Blockly.Tooltip.element_.tooltip) {
    // No tooltip here to show.
   // return;
  //} //else if ((Blockly.ContextMenu && Blockly.ContextMenu.visible) 
      //       ) { // ||Blockly.Block.dragMode_ != 0 COMMENT OUT DRAG MODE
    // Don't display a tooltip when a context menu is active, or during a drag.
    //return;
 // }
  if (Blockly.Tooltip.poisonedElement_ != Blockly.Tooltip.element_) {
    // The mouse moved, clear any previously scheduled tooltip.
    window.clearTimeout(Blockly.Tooltip.showPid_);
    // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
    Blockly.Tooltip.lastX_ = e.clientX;
    Blockly.Tooltip.lastY_ = e.clientY;
    Blockly.Tooltip.showPid_ =
        window.setTimeout(Blockly.Tooltip.show_, Blockly.Tooltip.HOVER_MS);
  }
};

 
 /**
 * Hide the tooltip.
 */
Blockly.Tooltip.hide = function() {
	
	var imgNode = document.getElementById(tipImg);
	if (imgNode && tipImg != originalTop && tipImg != originalBottom)
		imgNode.style.visibility = "hidden";
	
	//restore original image (if any) after preview
	imgNode = document.getElementById(tempImg);
    if (imgNode)
  		imgNode.style.visibility = "visible";
  	
  	
  if (Blockly.Tooltip.visible) {
    Blockly.Tooltip.visible = false;
    
    
    if (Blockly.Tooltip.svgGroup_) {
      Blockly.Tooltip.svgGroup_.style.display = 'none';
    }
  }
  window.clearTimeout(Blockly.Tooltip.showPid_);
};
 
      
      
/**
 * Create the tooltip and show it.
 * @private
 */
Blockly.Tooltip.show_ = function() {
  Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_;
  if (!Blockly.Tooltip.svgGroup_) {
    return;
  }
  // Erase all existing text.
  goog.dom.removeChildren(
      /** @type {!Element} */ (Blockly.Tooltip.svgText_));
  // Create new text, line by line.
  var tip = Blockly.Tooltip.element_.tooltip;
  if (goog.isFunction(tip)) {
    tip = tip();
    //console.log ("TIP = " + tip);
  }
  
  /*
  var lines = tip.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var tspanElement = Blockly.createSvgElement('tspan',
        {'dy': '1em', 'x': Blockly.Tooltip.MARGINS}, Blockly.Tooltip.svgText_);
    var textNode = document.createTextNode(lines[i]);
    tspanElement.appendChild(textNode);
  }
  */
  
  
  /*var tspanElement = Blockly.createSvgElement('tspan',
        {'id':'tspan'}, Blockly.Tooltip.svgImg_);
  var imgNode = document.createElement("img");
  imgNode.src = 'images/' + tip + '.png';
  imgNode.id = 'toolTip';
  
  if (tip.substring(0,3) == "top")
  	imgNode.className = 'top';
  else
  	imgNode.className = 'bottom';
  
  
  imgNode.style.visibility = "visible";
  document.getElementById("images").appendChild(imgNode);
  //tspanElement.appendChild(imgNode);
  */
  
  tipImg = tip;
  
  if (tipImg.substring(0,3) == "top")
  	tempImg = originalTop;
  else if (tipImg.substring(0,3) == "bot")
  	tempImg = originalBottom;
  else
  	tempImg = '';
  	
  
  var imgNode = document.getElementById(tempImg);
  if (imgNode)
  	imgNode.style.visibility = "hidden";
  
  imgNode = document.getElementById(tipImg);
  if (imgNode) {
  	imgNode.style.visibility = "visible";
  	imgNode.style.zIndex = Zindex++;
  }
  
  
  
  // Display the tooltip.
  Blockly.Tooltip.visible = true;
  Blockly.Tooltip.svgGroup_.style.display = 'block';
  // Resize the background and shadow to fit.
  var bBox = Blockly.Tooltip.svgText_.getBBox();
  var width = 2 * Blockly.Tooltip.MARGINS + bBox.width;
  var height = bBox.height;
  Blockly.Tooltip.svgBackground_.setAttribute('width', width);
  Blockly.Tooltip.svgBackground_.setAttribute('height', height);
  Blockly.Tooltip.svgShadow_.setAttribute('width', width);
  Blockly.Tooltip.svgShadow_.setAttribute('height', height);
  if (Blockly.RTL) {
    // Right-align the paragraph.
    // This cannot be done until the tooltip is rendered on screen.
    var maxWidth = bBox.width;
    for (var x = 0, textElement;
         textElement = Blockly.Tooltip.svgText_.childNodes[x]; x++) {
      textElement.setAttribute('text-anchor', 'end');
      textElement.setAttribute('x', maxWidth + Blockly.Tooltip.MARGINS);
    }
  }
  // Move the tooltip to just below the cursor.
  var anchorX = Blockly.Tooltip.lastX_;
  if (Blockly.RTL) {
    anchorX -= Blockly.Tooltip.OFFSET_X + width;
  } else {
    anchorX += Blockly.Tooltip.OFFSET_X;
  }
  var anchorY = Blockly.Tooltip.lastY_ + Blockly.Tooltip.OFFSET_Y;

  // Convert the mouse coordinates into SVG coordinates.
  var xy = Blockly.convertCoordinates(anchorX, anchorY, true);
  anchorX = xy.x;
  anchorY = xy.y;

  var svgSize = Blockly.svgSize();
  if (anchorY + bBox.height > svgSize.height) {
    // Falling off the bottom of the screen; shift the tooltip up.
    anchorY -= bBox.height + 2 * Blockly.Tooltip.OFFSET_Y;
  }
  if (Blockly.RTL) {
    // Prevent falling off left edge in RTL mode.
    anchorX = Math.max(Blockly.Tooltip.MARGINS, anchorX);
  } else {
    if (anchorX + bBox.width > svgSize.width - 2 * Blockly.Tooltip.MARGINS) {
      // Falling off the right edge of the screen;
      // clamp the tooltip on the edge.
      anchorX = svgSize.width - bBox.width - 2 * Blockly.Tooltip.MARGINS;
    }
  }
  Blockly.Tooltip.svgGroup_.setAttribute('transform',
      'translate(' + anchorX + ',' + anchorY + ')');
};
      
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
      
      toolbox3 += '<category name = "+ Controls">  <block type = "control_if"></block> <block type="weather"></block> ';
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
      
      toolbox4 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="weather"></block>';
      toolbox4 += '</category> <category> </category>'; //close controls
      
      toolbox4 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox4 += '</category> <category> </category>'; //close definitions
      toolbox4 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox5 = '<xml> <category></category> ';
      toolbox5 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block> <block type="top5"></block> <block type="top6"> </block> <block type="top7"> </block> <block type="top8"> </block>';
      toolbox5 += '</category> <category> </category>'; //close tops
      
      toolbox5 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block> <block type="bottom6"></block> <block type="bottom7"></block> <block type="bottom8"></block>';
      
      toolbox5 += '</category> <category> </category>'; //close bottoms
      
      toolbox5 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox5 += '</category> <category> </category>'; //close coloring
      
      toolbox5 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="control_repeat"></block>';
      toolbox5 += '</category> <category> </category>'; //close controls
      
      toolbox5 += '<category name = "+ Outfit Definitions" custom="PROCEDURE">  </category>';
      toolbox5 += '</category> <category> </category>'; //close definitions
      toolbox5 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox6 = '<xml> <category></category> ';
      
      toolbox6 += '<category name="+ Bottoms"> <block type="bottom1"></block>';
      
      toolbox6 += '</category> <category> </category>'; //close bottoms
      
      toolbox6 += '<category name="+ Coloring"> <block type="black"></block> <block type="pink"></block> <block type="grey"></block> ';
                   
      toolbox6 += '</category> <category> </category>'; //close coloring
      
      toolbox6 += '<category name = "+ Controls"> <block type="control_repeat"></block>';
      toolbox6 += '</category> <category> </category>'; //close controls
      
      toolbox6 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox6 += '</category> <category> </category>'; //close definitions
      toolbox6 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox7 = '<xml> <category></category> ';
     
      toolbox7 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block> <block type="bottom6"></block> <block type="bottom7"></block> <block type="bottom8"></block>';
      
      toolbox7 += '</category> <category> </category>'; //close bottoms
      
      toolbox7 += '<category name="+ Coloring"> <block type="get_color_var"></block> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox7 += '</category> <category> </category>'; //close coloring
      
      toolbox7 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="get_color_input"></block> <block type="control_repeat"></block>';
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
      
      if (CURRENT_LEVEL >= 4) {
      	 if ('sessionStorage' in window ) {
      	 	var saved_xml = '<xml>';
      	 	if (sessionStorage.procedure) {
      	 		var pArr = (sessionStorage.procedure).split('#');
      	 		for ( x=0; x < pArr.length; x++) {
      	 			saved_xml += pArr[x];
      	 		}
      	 		//saved_xml += sessionStorage.procedure;
      	 		saved_xml += '</xml>';	
      	 		var xml = Blockly.Xml.textToDom(saved_xml);
      			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
      			//window.setTimeout(BlocklyStorage.restoreBlocks, 0);
      	 	}
      	 	
      	 }
      	
      }
      
      
      document.getElementById('full_text_div').innerHTML= LEVELS_MSG[CURRENT_LEVEL - 1];
      document.getElementById('level-h').innerHTML= "Level " + CURRENT_LEVEL + " :";
      
    }