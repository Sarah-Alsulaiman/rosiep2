Blockly.JavaScript.top1 = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top1-", "red", "hot" ]';
	}
	else {
		return '[ "top1-",' + color + ', "hot" ]';
	}
};

Blockly.JavaScript.top2 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top2-", "blue", "hot" ]';
	}
	else {
		return '[ "top2-",' + color + ' "hot" ]';
	}
};

Blockly.JavaScript.top3 = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top3-", "red", "hot" ]';
	}
	else {
		return '[ "top3-",' + color + ', "hot" ]';
	}
};

Blockly.JavaScript.top4 = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top4-", "red", "cold" ]';
	}
	else {
		return '[ "top4-",' + color + ' "cold" ]';
	}
};

Blockly.JavaScript.top5 = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top5-", "red" , "formal" ]';
	}
	else {
		return '[ "top5-",' + color + ' "formal" ]';
	}
};

Blockly.JavaScript.top6 = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top6-", "red", "gym" ]';
	}
	else {
		return '[ "top6-",' + color + ' "gym" ]';
	}
};

Blockly.JavaScript.top7 = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top7-", "red" , "hot" ]';
	}
	else {
		return '[ "top7-",' + color + ' "hot" ]';
	}
};

Blockly.JavaScript.top8 = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "top8-", "red", "hot" ]';
	}
	else {
		return '[ "top8-",' + color + ' "hot" ]';
	}
};

//--------------------------------------------------------------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------------------------------------------------------------
Blockly.JavaScript.bottom1 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom1-", "red" ]';
	}
	else {
		return '[ "bottom1-",' + color + ' ]';
	}
};

Blockly.JavaScript.bottom2 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom2-", "blue" ]';
	}
	else {
		return '[ "bottom2-",' + color + ' ]';
	}
};

Blockly.JavaScript.bottom3 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom3-", "blue" ]';
	}
	else {
		return '[ "bottom3-",' + color + ' ]';
	}
};

Blockly.JavaScript.bottom4 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom4-", "blue" ]';
	}
	else {
		return '[ "bottom4-",' + color + ' ]';
	}
};

Blockly.JavaScript.bottom5 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom5-", "blue" ]';
	}
	else {
		return '[ "bottom5-",' + color + ' ]';
	}
};

Blockly.JavaScript.bottom6 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom6-", "blue" ]';
	}
	else {
		return '[ "bottom6-",' + color + ' ]';
	}
};

Blockly.JavaScript.bottom7 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom7-", "blue" ]';
	}
	else {
		return '[ "bottom7-",' + color + ' ]';
	}
};

Blockly.JavaScript.bottom8 = function() {
  var color = Blockly.JavaScript.valueToCode(this, 'color', Blockly.JavaScript.ORDER_NONE) || '0';
	if (color == '0') {
		return '[ "bottom8-", "blue" ]';
	}
	else {
		return '[ "bottom8-",' + color + ' ]';
	}
};



Blockly.JavaScript.set_color = function() {
	var part = this.getTitleValue('part');
	var color = Blockly.JavaScript.valueToCode(this, 'SET', Blockly.JavaScript.ORDER_NONE) || '0';
	
	return '["SET", [ "' + part + '", ' + color + '] ]';
		
};

Blockly.JavaScript.get_color_input = function() {
	var part = this.getTitleValue('part');
	var color = Blockly.JavaScript.valueToCode(this, 'GET', Blockly.JavaScript.ORDER_NONE) || '0';
	var code = '["GET", [ "' + part + '", ' + color + ' ]  ]';
	
	return [code, Blockly.JavaScript.ORDER_NONE];	
};

Blockly.JavaScript.get_color_var = function() {
	var code = '"current_color"';
	
	return [code, Blockly.JavaScript.ORDER_NONE];	
};


Blockly.JavaScript.equal = function() {
	var color = Blockly.JavaScript.valueToCode(this, 'equal', Blockly.JavaScript.ORDER_NONE) || '0';
	var code = color;
	
	return [code, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.red = function() {
	var color = '"red"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.blue = function() {
	color = '"blue"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.black = function() {
	color = '"black"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.pink = function() {
	color = '"pink"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.grey = function() {
	color = '"grey"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.gold = function() {
	color = '"gold"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.lime = function() {
	color = '"lime"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.purple = function() {
	color = '"purple"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};

Blockly.JavaScript.orange = function() {
	color = '"orange"';
	return [color, Blockly.JavaScript.ORDER_NONE];
		
};



Blockly.JavaScript.going_to = function() {
	var place = this.getTitleValue('place');
	var code = '"Going", "' + place + '"';
	
	return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.weather = function() {
	var weather = this.getTitleValue('weather');
	var code = '"weather", "' + weather + '"';
	
	return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.control_repeat = function() {
  var count = this.getTitleValue('COUNT') || '50';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  
  return '[ "repeat", ' + count + ', [ ' + branch + '] ]';
};



Blockly.JavaScript.control_if = function() {
  var condition = Blockly.JavaScript.valueToCode(this, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || '0';
  var then = Blockly.JavaScript.statementToCode(this, 'THEN');
  var other = Blockly.JavaScript.statementToCode(this, 'ELSE');
  
  code = '["if", [' + condition + '], [ ' + then + ' ], [' + other + '] ]';
  
 
  return code ;
};


Blockly.JavaScript.color_dress1 = function() {
	code = 'color_dress1';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

'use strict';

goog.provide('Blockly.JavaScript.procedures');

goog.require('Blockly.JavaScript');

Blockly.JavaScript.procedures_defreturn = function() {
  // Define a procedure with a return value.
  var funcName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.JavaScript.statementToCode(this, 'STACK');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  //var code = 'function ' + funcName + '() {\n' +
      //branch + '}';
  //code = Blockly.JavaScript.scrub_(this, code);
  var code = '{[ "' + funcName + '", [' + branch + ' ]]}';//++
  Blockly.JavaScript.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.JavaScript.procedures_defnoreturn =
    Blockly.JavaScript.procedures_defreturn;



Blockly.JavaScript.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('NAME'), Blockly.Procedures.NAME_TYPE);
  
  //var code = funcName + '( );\n';
  var code = '["CALL",  "' + funcName + '" ]';
  return code;
};
