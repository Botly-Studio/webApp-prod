goog.provide('Turtle');

var Turtle = Turtle || {};

Turtle.interpreter = null;
Turtle.canvas = null;
Turtle.ctx = null;
Turtle.ctxScratch = null
Turtle.pidList = [];
Turtle.pause = 10;
Turtle.background = null;
Turtle.visible = true;
Turtle.penDownValue = true;

Turtle.speedSlider = null;
//Turtle.zoomSlider = null;

Turtle.HEIGHT = 1000;
Turtle.WIDTH = 1000;

Turtle.lastX=Turtle.WIDTH/2, Turtle.lastY=Turtle.HEIGHT/2;
Turtle.dragStart;
Turtle.dragged;

Turtle.scale = 1;
Turtle.distCoef = 20;

Turtle.showGrid = false;


Turtle.zoom = function(clicks){
  var pt = Turtle.ctx.transformedPoint(Turtle.lastX,Turtle.lastY);
  Turtle.ctx.translate(pt.x,pt.y);
  Turtle.ctxScratch.translate(pt.x,pt.y);
  var factor = Math.pow(Turtle.scale,clicks);
  Turtle.ctx.scale(factor,factor);
  Turtle.ctxScratch.scale(factor,factor);
  Turtle.ctx.translate(-pt.x,-pt.y);
  Turtle.ctxScratch.translate(-pt.x,-pt.y);
  Turtle.display();
}

Turtle.handleScroll = function(evt){
  var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
  if (delta) Turtle.zoom(delta);
  return evt.preventDefault() && false;
};


/** Initialize function for Turtle */
Turtle.init = function () {
  
  PluginManager.injectHtml(Turtle.html);
  PluginManager.injectCss(Turtle.css)

  Turtle.ctxScratch = document.getElementById("scratch").getContext('2d');

  Turtle.canvas = document.getElementById("display");
  Turtle.ctx = Turtle.canvas.getContext('2d');

  Turtle.trackTransforms(Turtle.ctx);
  //Turtle.trackTransforms(Turtle.ctxScratch);
/*
  Turtle.canvas.addEventListener('mousedown',function(evt){
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    Turtle.lastX = evt.offsetX || (evt.pageX - Turtle.canvas.offsetLeft);
    Turtle.lastY = evt.offsetY || (evt.pageY - Turtle.canvas.offsetTop);
    Turtle.dragStart = Turtle.ctx.transformedPoint(Turtle.lastX,Turtle.lastY);
    Turtle.dragged = false;
},false);

  Turtle.canvas.addEventListener('mousemove',function(evt){
    Turtle.lastX = evt.offsetX || (evt.pageX - Turtle.canvas.offsetLeft);
    Turtle.lastY = evt.offsetY || (evt.pageY - Turtle.canvas.offsetTop);
    Turtle.dragged = true;
    if (Turtle.dragStart){
      var pt = Turtle.ctx.transformedPoint(Turtle.lastX,Turtle.lastY);
      Turtle.ctx.translate(pt.x-Turtle.dragStart.x,pt.y-Turtle.dragStart.y);
      //Turtle.ctxScratch.translate(pt.x-Turtle.dragStart.x,pt.y-Turtle.dragStart.y);
      Turtle.display();
          }
  },false);
*/
  Turtle.canvas.addEventListener('DOMMouseScroll',Turtle.handleScroll,false);
  Turtle.canvas.addEventListener('mousewheel',Turtle.handleScroll,false);

  Turtle.canvas.addEventListener('mouseup',function(evt){
    Turtle.dragStart = null;
      if (!Turtle.dragged) zoom(evt.shiftKey ? -1 : 1 );
  },false);

  BotlyStudio.bindClick_('button_ide_large', function () {
    Turtle.execute();
  });
  BotlyStudio.bindClick_('button_ide_middle', function () {
    BotlyStudio.devTools();
  });
  BotlyStudio.bindClick_('button_ide_left', function () {
    BotlyStudio.discardAllBlocks();
  });

  BotlyStudio.bindClick_('button_plugin_save', function () {
    Turtle.saveCanvas();
  });
  BotlyStudio.bindClick_('button_plugin_clear', function () {
    Turtle.reset();
  });


  var head = document.getElementsByTagName('head')[0];
  var plugin = document.createElement('script');
  plugin.src = './js/plugins/turtle/slider.js';
  plugin.onload = function () {
    var sliderSvg = document.getElementById('speed_slider');
    Turtle.speedSlider = new Slider(10, 35, 130, sliderSvg);
    Turtle.reset();
  }
  head.appendChild(plugin);
};

BotlyStudio.changeToolbox = function () {
  if (BotlyStudio.DIFFICULTY == 1) {
    BotlyStudio.TOOLBOX_XML =
      '<xml>' +
      '  <sep></sep>' +
      '  <category id="botly" name="Botly">' +
      '    <block type="botly_deplacement">' +
      '		<value name="VALUE">' +
      '       	<shadow type="math_number">' +
      '          		<field name="NUM">10</field>' +
      '        	</shadow>' +
      '		</value>' +
      '    </block>' +
      '    <block type="botly_rotation">' +
      '		<value name="angle">' +
      '       	<shadow type="math_number">' +
      '          		<field name="NUM">90</field>' +
      '        	</shadow>' +
      '		</value>' +
      '    </block>' +
      '    <block type="botly_crayon"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catLoops" name="Loops">' +
      '    <block type="controls_repeat_ext">' +
      '      <value name="TIMES">' +
      '        <block type="math_number">' +
      '          <field name="NUM">5</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catMath" name="Math">' +
      '    <block type="math_number"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catTime" name="Time">' +
      '    <block type="infinite_loop"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '</xml>';
  }
  if (BotlyStudio.DIFFICULTY == 2) {
    BotlyStudio.TOOLBOX_XML =
      '<xml>' +
      '  <sep></sep>' +
      '  <category id="botly" name="Botly">' +
      '    <block type="botly_forward">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_backward">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_right">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">90</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_left">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">90</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_crayon"></block>' +
      '  </category>' + '  <sep></sep>' +
      '  <category id="catLoops" name="Loops">' +
      '    <block type="controls_repeat_ext">' +
      '      <value name="TIMES">' +
      '        <block type="math_number">' +
      '          <field name="NUM">5</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="controls_for">' +
      '      <value name="FROM">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="TO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="BY">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catMath" name="Math">' +
      '    <block type="math_number"></block>' +
      '    <block type="math_random_int">' +
      '      <value name="FROM">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="TO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">100</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catVariables" name="Variables">' +
      '    <block type="variables_get"></block>' +
      '    <block type="variables_set"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
      '  <sep></sep>' +
      '  <category id="catTime" name="Time">' +
      '    <block type="infinite_loop"></block>' +
      '</xml>';
  }
  if (BotlyStudio.DIFFICULTY == 3) {
    BotlyStudio.TOOLBOX_XML =
      '<xml>' +
      '  <sep></sep>' +
      '  <category id="botly" name="Botly">' +
      '    <block type="botly_forward">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_backward">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_deplacement">' +
      '		<value name="VALUE">' +
      '       	<shadow type="math_number">' +
      '          		<field name="NUM">10</field>' +
      '        	</shadow>' +
      '		</value>' +
      '    </block>' +
      '    <block type="botly_rotation">' +
      '		<value name="angle">' +
      '       	<shadow type="math_number">' +
      '          		<field name="NUM">90</field>' +
      '        	</shadow>' +
      '		</value>' +
      '    </block>' +
      '    <block type="botly_right">' +
      '      <value name="angle">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_left">' +
      '      <value name="angle">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_stop"></block>' +
      '    <block type="botly_turn_go"></block>' +
      '    <block type="botly_crayon"></block>' +
      '    <block type="botly_polygone"></block>' +
      '    <block type="botly_cercle"></block>' +
      '    <block type="botly_ligne"></block>' +
      '    <block type="botly_contact"></block>' +
      '    <block type="botly_lever_crayon"></block>' +
      '    <block type="botly_descendre_crayon"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catLogic" name="Logic">' +
      '    <block type="controls_if"></block>' +
      '    <block type="logic_compare"></block>' +
      '    <block type="logic_operation"></block>' +
      '    <block type="logic_negate"></block>' +
      '    <block type="logic_boolean"></block>' +
      '    <block type="logic_null"></block>' +
      '    <block type="logic_ternary"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catLoops" name="Loops">' +
      '    <block type="controls_repeat_ext">' +
      '      <value name="TIMES">' +
      '        <block type="math_number">' +
      '          <field name="NUM">5</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="controls_whileUntil"></block>' +
      '    <block type="controls_for">' +
      '      <value name="FROM">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="TO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="BY">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="controls_flow_statements"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catMath" name="Math">' +
      '    <block type="math_number"></block>' +
      '    <block type="math_arithmetic"></block>' +
      '    <block type="math_single"></block>' +
      '    <block type="math_trig"></block>' +
      '    <block type="math_constant"></block>' +
      '    <block type="math_number_property"></block>' +
      '    <block type="math_change">' +
      '      <value name="DELTA">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="math_round"></block>' +
      '    <block type="math_modulo"></block>' +
      '    <block type="math_constrain">' +
      '      <value name="LOW">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="HIGH">' +
      '        <block type="math_number">' +
      '          <field name="NUM">100</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="math_random_int">' +
      '      <value name="FROM">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="TO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">100</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="math_random_float"></block>' +
      '    <block type="base_map"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catVariables" name="Variables">' +
      '    <block type="variables_get"></block>' +
      '    <block type="variables_set"></block>' +
      '    <block type="variables_set">' +
      '      <value name="VALUE">' +
      '        <block type="variables_set_type"></block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="variables_set_type"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
      '  <sep></sep>' +
      '  <category id="catTime" name="Time">' +
      '    <block type="time_delay">' +
      '      <value name="DELAY_TIME_MILI">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1000</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="time_delaymicros">' +
      '      <value name="DELAY_TIME_MICRO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">100</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="time_millis"></block>' +
      '    <block type="time_micros"></block>' +
      '    <block type="infinite_loop"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '</xml>';
  }
  if (BotlyStudio.DIFFICULTY == 4) {
    BotlyStudio.TOOLBOX_XML =
      '<xml>' +
      '  <sep></sep>' +
      '  <category id="botly" name="Botly">' +
      '    <block type="botly_forward">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_backward">' +
      '      <value name="VALUE">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_deplacement">' +
      '		<value name="VALUE">' +
      '       	<shadow type="math_number">' +
      '          		<field name="NUM">10</field>' +
      '        	</shadow>' +
      '		</value>' +
      '    </block>' +
      '    <block type="botly_rotation">' +
      '		<value name="angle">' +
      '       	<shadow type="math_number">' +
      '          		<field name="NUM">90</field>' +
      '        	</shadow>' +
      '		</value>' +
      '    </block>' +
      '    <block type="botly_right">' +
      '      <value name="angle">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_left">' +
      '      <value name="angle">' +
      '        <shadow type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </shadow>' +
      '      </value>' +
      '    </block>' +
      '    <block type="botly_stop"></block>' +
      '    <block type="botly_turn_go"></block>' +
      '    <block type="botly_crayon"></block>' +
      '    <block type="botly_polygone"></block>' +
      '    <block type="botly_cercle"></block>' +
      '    <block type="botly_ligne"></block>' +
      '    <block type="botly_contact"></block>' +
      '    <block type="botly_lever_crayon"></block>' +
      '    <block type="botly_descendre_crayon"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catLogic" name="Logic">' +
      '    <block type="controls_if"></block>' +
      '    <block type="logic_compare"></block>' +
      '    <block type="logic_operation"></block>' +
      '    <block type="logic_negate"></block>' +
      '    <block type="logic_boolean"></block>' +
      '    <block type="logic_null"></block>' +
      '    <block type="logic_ternary"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catLoops" name="Loops">' +
      '    <block type="controls_repeat_ext">' +
      '      <value name="TIMES">' +
      '        <block type="math_number">' +
      '          <field name="NUM">5</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="controls_whileUntil"></block>' +
      '    <block type="controls_for">' +
      '      <value name="FROM">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="TO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">10</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="BY">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="controls_flow_statements"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catMath" name="Math">' +
      '    <block type="math_number"></block>' +
      '    <block type="math_arithmetic"></block>' +
      '    <block type="math_single"></block>' +
      '    <block type="math_trig"></block>' +
      '    <block type="math_constant"></block>' +
      '    <block type="math_number_property"></block>' +
      '    <block type="math_change">' +
      '      <value name="DELTA">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="math_round"></block>' +
      '    <block type="math_modulo"></block>' +
      '    <block type="math_constrain">' +
      '      <value name="LOW">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="HIGH">' +
      '        <block type="math_number">' +
      '          <field name="NUM">100</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="math_random_int">' +
      '      <value name="FROM">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1</field>' +
      '        </block>' +
      '      </value>' +
      '      <value name="TO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">100</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="math_random_float"></block>' +
      '    <block type="base_map"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catVariables" name="Variables">' +
      '    <block type="variables_get"></block>' +
      '    <block type="variables_set"></block>' +
      '    <block type="variables_set">' +
      '      <value name="VALUE">' +
      '        <block type="variables_set_type"></block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="variables_set_type"></block>' +
      '  </category>' +
      '  <sep></sep>' +
      '  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
      '  <sep></sep>' +
      '  <category id="catTime" name="Time">' +
      '    <block type="time_delay">' +
      '      <value name="DELAY_TIME_MILI">' +
      '        <block type="math_number">' +
      '          <field name="NUM">1000</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="time_delaymicros">' +
      '      <value name="DELAY_TIME_MICRO">' +
      '        <block type="math_number">' +
      '          <field name="NUM">100</field>' +
      '        </block>' +
      '      </value>' +
      '    </block>' +
      '    <block type="time_millis"></block>' +
      '    <block type="time_micros"></block>' +
      '    <block type="infinite_loop"></block>' +
      '  </category>' +
      '</xml>';
  }
};


Turtle.saveCanvas = function () {
  var canvas = document.getElementById("display");
  var img = canvas.toDataURL("image/png");
  var filename = document.getElementById("sketch_name").value;

  var pom = document.createElement('a');
  pom.setAttribute('href', img);
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  }
  else {
    pom.click();
  }
}


Turtle.trackTransforms = function(ctx){
  var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  var xform = svg.createSVGMatrix();
  ctx.getTransform = function(){ return xform; };

  var savedTransforms = [];
  var save = ctx.save;
  ctx.save = function(){
      savedTransforms.push(xform.translate(0,0));
      return save.call(ctx);
  };

  var restore = ctx.restore;
  ctx.restore = function(){
    xform = savedTransforms.pop();
    return restore.call(ctx);
      };

  var scale = ctx.scale;
  ctx.scale = function(sx,sy){
    xform = xform.scaleNonUniform(sx,sy);
    return scale.call(ctx,sx,sy);
      };

  var rotate = ctx.rotate;
  ctx.rotate = function(radians){
      xform = xform.rotate(radians*180/Math.PI);
      return rotate.call(ctx,radians);
  };

  var translate = ctx.translate;
  ctx.translate = function(dx,dy){
      xform = xform.translate(dx,dy);
      return translate.call(ctx,dx,dy);
  };

  var transform = ctx.transform;
  ctx.transform = function(a,b,c,d,e,f){
      var m2 = svg.createSVGMatrix();
      m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
      xform = xform.multiply(m2);
      return transform.call(ctx,a,b,c,d,e,f);
  };

  var setTransform = ctx.setTransform;
  ctx.setTransform = function(a,b,c,d,e,f){
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx,a,b,c,d,e,f);
  };

  var pt  = svg.createSVGPoint();
  ctx.transformedPoint = function(x,y){
      pt.x=x; pt.y=y;
      return pt.matrixTransform(xform.inverse());
  }
}


Turtle.setBackGround = function (path) {
  var canvasStyle = document.getElementById("display").style;
  canvasStyle.background = "#ffffff";

  Turtle.ctx.fillStyle = '#ffffff';
  Turtle.ctx.fill();
  Turtle.ctx.clearRect(0, 0, Turtle.canvas.width, Turtle.canvas.height);
  Turtle.sprites = [];


  var ctx = Turtle.ctx;
  var background = new Image();
  background.src = path;

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function () {
    ctx.drawImage(background, 0, 0);
  }
};


Turtle.execute = function () {
  if (!('Interpreter' in window)) {
    // Interpreter lazy loads and hasn't arrived yet.  Try again later.
    setTimeout(Turtle.execute, 250);
    return;
  }
  var code = BotlyStudio.generateJavaScript();
  Turtle.interpreter = new Interpreter(code, Turtle.initInterpreter);
  Turtle.pidList.push(setTimeout(Turtle.executeChunk_, 100));
  Turtle.reset();
}


/**
 * Reset the turtle to the start position, clear the display, and kill any
 * pending tasks.
 */
Turtle.reset = function() {
  // Starting location and heading of the turtle.
  Turtle.x = Turtle.WIDTH / 2;
  Turtle.y = Turtle.HEIGHT / 2;
  Turtle.heading = 0;
  Turtle.penDownValue = true;
  Turtle.visible = true;

  // Clear the canvas.
  Turtle.ctxScratch.canvas.width = Turtle.ctxScratch.canvas.width;
  Turtle.ctxScratch.strokeStyle = '#79797a';
  Turtle.ctxScratch.fillStyle = '#ffffff';
  Turtle.ctxScratch.lineWidth = 3;
  Turtle.ctxScratch.lineCap = 'round';
  Turtle.ctxScratch.font = 'normal 18pt Arial';
  Turtle.display();

  // Kill all tasks.
  for (var i = 0; i < Turtle.pidList.length; i++) {
    window.clearTimeout(Turtle.pidList[i]);
  }
  Turtle.pidList.length = 0;
  Turtle.interpreter = null;
};

/**
 * Copy the scratch canvas to the display canvas. Add a turtle marker.
 */
Turtle.display = function() {
  // Clear the display with white.
  var p1 = Turtle.ctx.transformedPoint(0,0);
  var p2 = Turtle.ctx.transformedPoint(Turtle.canvas.width,Turtle.canvas.height);

  Turtle.ctx.save();
  Turtle.ctxScratch.save();
  Turtle.ctx.setTransform(1,0,0,1,0,0);
  Turtle.ctxScratch.setTransform(1,0,0,1,0,0);
  Turtle.ctx.clearRect(0,0,Turtle.canvas.width,Turtle.canvas.height);
  Turtle.ctx.restore();
  Turtle.ctxScratch.restore();

  //Turtle.ctxScratch.scale(Turtle.scale, Turtle.scale);
  Turtle.ctx.beginPath();
  Turtle.ctx.rect(0, 0,
      Turtle.ctx.canvas.width, Turtle.ctx.canvas.height);
  Turtle.ctx.fillStyle = '#ffffff';
  Turtle.ctx.fill();

  // Draw the user layer.
  Turtle.ctx.globalCompositeOperation = 'source-over';
  Turtle.ctx.drawImage(Turtle.ctxScratch.canvas, 0, 0);

  // Draw the turtle.
  if (Turtle.visible) {
    // Make the turtle the colour of the pen.
    // Turtle.ctx.strokeStyle = Turtle.ctxScratch.strokeStyle;
    // Turtle.ctx.fillStyle = Turtle.ctxScratch.fillStyle;
    Turtle.ctx.strokeStyle = '#EA7D00';
    Turtle.ctx.fillStyle = '#EA7D00';

    var scale = 2;
    // Draw the turtle body.
    var radius = Turtle.ctxScratch.lineWidth / 2 + 10;
    radius *= scale;
    Turtle.ctx.beginPath();
    Turtle.ctx.arc(Turtle.x, Turtle.y, radius, 0, 2 * Math.PI, false);
    Turtle.ctx.lineWidth = 3 * scale;
    Turtle.ctx.stroke();

    // Draw the turtle head.

    var WIDTH = 0.4 * scale;
    var HEAD_TIP = 10 * scale;
    var ARROW_TIP = 4 * scale;
    var BEND = 6 * scale;
    var radians =  2 * Math.PI * Turtle.heading / 360;
    var tipX = Turtle.x + (radius + HEAD_TIP) * Math.sin(radians);
    var tipY = Turtle.y - (radius + HEAD_TIP) * Math.cos(radians);
    radians -= WIDTH;
    var leftX = Turtle.x + (radius + ARROW_TIP) * Math.sin(radians);
    var leftY = Turtle.y - (radius + ARROW_TIP) * Math.cos(radians);
    radians += WIDTH / 2;
    var leftControlX = Turtle.x + (radius + BEND) * Math.sin(radians);
    var leftControlY = Turtle.y - (radius + BEND) * Math.cos(radians);
    radians += WIDTH;
    var rightControlX = Turtle.x + (radius + BEND) * Math.sin(radians);
    var rightControlY = Turtle.y - (radius + BEND) * Math.cos(radians);
    radians += WIDTH / 2;
    var rightX = Turtle.x + (radius + ARROW_TIP) * Math.sin(radians);
    var rightY = Turtle.y - (radius + ARROW_TIP) * Math.cos(radians);
    Turtle.ctx.beginPath();
    Turtle.ctx.moveTo(tipX, tipY);
    Turtle.ctx.lineTo(leftX, leftY);
    Turtle.ctx.bezierCurveTo(leftControlX, leftControlY,
        rightControlX, rightControlY, rightX, rightY);
    Turtle.ctx.closePath();
    Turtle.ctx.fill();
  }
};


/**
 * Click the run button.  Start the program.
 * @param {!Event} e Mouse or touch event.
 */
Turtle.runButtonClick = function(e) {
  /*if (Turtle.eventSpam(e)) {
    return;
  }
  */
  Turtle.execute();
};

/**
 * Click the reset button.  Reset the Turtle.
 * @param {!Event} e Mouse or touch event.
 */
Turtle.resetButtonClick = function(e) {
  /*if (Turtle.eventSpam(e)) {
    return;
  }
  */
  Turtle.reset();
};


/**
 * Inject the Turtle API into a JavaScript interpreter.
 * @param {!Interpreter} interpreter The JS Interpreter.
 * @param {!Interpreter.Object} scope Global scope.
 */
Turtle.initInterpreter = function(interpreter, scope) {
  // API
  var wrapper;
  wrapper = function(distance) {
    Turtle.move(distance);
  };
  interpreter.setProperty(scope, 'Avancer',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(distance) {
    Turtle.move(-distance);
  };
  interpreter.setProperty(scope, 'Reculer',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(angle) {
    Turtle.turn(angle);
  };
  interpreter.setProperty(scope, 'droite',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(angle) {
    Turtle.turn(-angle);
  };
  interpreter.setProperty(scope, 'gauche',
      interpreter.createNativeFunction(wrapper));

  wrapper = function() {
    Turtle.penDown(false);
  };
  interpreter.setProperty(scope, 'Lever',
      interpreter.createNativeFunction(wrapper));
  wrapper = function() {
    Turtle.penDown(true);
  };
  interpreter.setProperty(scope, 'Descendre',
      interpreter.createNativeFunction(wrapper));

    wrapper = function(angle, distance, ) {
    Turtle.turnGo(angle,distance);
  };
  interpreter.setProperty(scope, 'turnGo',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(width) {
    Turtle.penWidth(width);
  };
  interpreter.setProperty(scope, 'penWidth',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(colour) {
    Turtle.penColour(colour);
  };
  interpreter.setProperty(scope, 'penColour',
      interpreter.createNativeFunction(wrapper));

  wrapper = function() {
    Turtle.isVisible(false);
  };
  interpreter.setProperty(scope, 'hideTurtle',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Turtle.isVisible(true);
  };
  interpreter.setProperty(scope, 'showTurtle',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(text) {
    Turtle.drawPrint(text);
  };
  interpreter.setProperty(scope, 'print',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(font, size, style) {
    Turtle.drawFont(font, size, style);
  };
  interpreter.setProperty(scope, 'font',
      interpreter.createNativeFunction(wrapper));

    wrapper = function() {
    console.log("Not implemented");
  };
  interpreter.setProperty(scope, 'none',
      interpreter.createNativeFunction(wrapper));
};


/**
 * Execute the user's code.  Heaven help us...
 */
Turtle.execute = function() {
  if (!('Interpreter' in window)) {
    // Interpreter lazy loads and hasn't arrived yet.  Try again later.
    setTimeout(Turtle.execute, 250);
    return;
  }

  Turtle.reset();
  Blockly.selected && Blockly.selected.unselect();
  var code = BotlyStudio.generateJavaScript();
  Turtle.interpreter = new Interpreter(code, Turtle.initInterpreter);
  Turtle.pidList.push(setTimeout(Turtle.executeChunk_, 100));
};

Turtle.map = function(x, in_min, in_max, out_min, out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};


/**
 * Execute a bite-sized chunk of the user's code.
 * @private
 */
Turtle.executeChunk_ = function() {
  // All tasks should be complete now.  Clean up the PID list.
  Turtle.pidList.length = 0;
	var stepSpeed = Turtle.speedSlider.getValue();
	Turtle.pause = Turtle.map(stepSpeed, 0, 1, 20, 0) + 1;
  var go;
  do {
    try {
      go = Turtle.interpreter.step();
    } catch (e) {
      // User error, terminate in shame.
      alert(e);
      go = false;
    }
    if (go && Turtle.pause) {
      // The last executed command requested a pause.
      go = false;
      Turtle.pidList.push(
          setTimeout(Turtle.executeChunk_, Turtle.pause));
    }
  } while (go);
  // Wrap up if complete.
  if (!Turtle.pause) {
    BotlyStudio.workspace.highlightBlock(null);
    // Image complete; allow the user to submit this image to Reddit.
    Turtle.canSubmit = true;
  }
};



/**
 * Highlight a block and pause.
 * @param {string=} id ID of block.
 */
Turtle.animate = function(id) {
  Turtle.display();
  if (id) {
    BotlyStudio.workspace.highlightBlock(null);
    // Scale the speed non-linearly, to give better precision at the fast end.
    var stepSpeed = 1000 * Math.pow(1 - Turtle.speedSlider.getValue(), 2);
    Turtle.pause = Math.max(1, stepSpeed);
  }
};


/**
 * Move the turtle forward or backward.
 * @param {number} distance Pixels to move.
 * @param {string=} id ID of block.
 */
Turtle.move = function(distance, id) {
  if (Turtle.penDownValue) {
    Turtle.ctxScratch.beginPath();
    Turtle.ctxScratch.moveTo(Turtle.x, Turtle.y);
  }
  if (distance) {
    Turtle.x += distance * Math.sin(2 * Math.PI * Turtle.heading / 360);
    Turtle.y -= distance * Math.cos(2 * Math.PI * Turtle.heading / 360);
    var bump = 0;
  } else {
    // WebKit (unlike Gecko) draws nothing for a zero-length line.
    var bump = 0.1;
  }
  if (Turtle.penDownValue) {
    Turtle.ctxScratch.lineTo(Turtle.x, Turtle.y + bump);
    Turtle.ctxScratch.stroke();
  }
  Turtle.animate(id);
};



/**
 * Turn the turtle left or right.
 * @param {number} angle Degrees to turn clockwise.
 * @param {string=} id ID of block.
 */
Turtle.turn = function(angle, id) {
  Turtle.heading += angle;
  Turtle.heading %= 360;
  if (Turtle.heading < 0) {
    Turtle.heading += 360;
  }
  Turtle.animate(id);
};


Turtle.turnGo = function(angle,distance, id){
	Turtle.turn(angle);
	Turtle.move(distance);
}

/**
 * Lift or lower the pen.
 * @param {boolean} down True if down, false if up.
 * @param {string=} id ID of block.
 */
Turtle.penDown = function(down, id) {
  Turtle.penDownValue = down;
  Turtle.animate(id);
};

/**
 * Change the thickness of lines.
 * @param {number} width New thickness in pixels.
 * @param {string=} id ID of block.
 */
Turtle.penWidth = function(width, id) {
  Turtle.ctxScratch.lineWidth = width;
  Turtle.animate(id);
};

/**
 * Change the colour of the pen.
 * @param {string} colour Hexadecimal #rrggbb colour string.
 * @param {string=} id ID of block.
 */
Turtle.penColour = function(colour, id) {
  Turtle.ctxScratch.strokeStyle = colour;
  Turtle.ctxScratch.fillStyle = colour;
  Turtle.animate(id);
};

/**
 * Make the turtle visible or invisible.
 * @param {boolean} visible True if visible, false if invisible.
 * @param {string=} id ID of block.
 */
Turtle.isVisible = function(visible, id) {
  Turtle.visible = visible;
  Turtle.animate(id);
};

/**
 * Print some text.
 * @param {string} text Text to print.
 * @param {string=} id ID of block.
 */
Turtle.drawPrint = function(text, id) {
  Turtle.ctxScratch.save();
  Turtle.ctxScratch.translate(Turtle.x, Turtle.y);
  Turtle.ctxScratch.rotate(2 * Math.PI * (Turtle.heading - 90) / 360);
  Turtle.ctxScratch.fillText(text, 0, 0);
  Turtle.ctxScratch.restore();
  Turtle.animate(id);
};

/**
 * Change the typeface of printed text.
 * @param {string} font Font name (e.g. 'Arial').
 * @param {number} size Font size (e.g. 18).
 * @param {string} style Font style (e.g. 'italic').
 * @param {string=} id ID of block.
 */
Turtle.drawFont = function(font, size, style, id) {
  Turtle.ctxScratch.font = style + ' ' + size + 'pt ' + font;
  Turtle.animate(id);
};



/**
 * Determine if this event is unwanted.
 * @param {!Event} e Mouse or touch event.
 * @return {boolean} True if spam.
 */
Turtle.eventSpam = function(e) {
  // Touch screens can generate 'touchend' followed shortly thereafter by
  // 'click'.  For now, just look for this very specific combination.
  // Some devices have both mice and touch, but assume the two won't occur
  // within two seconds of each other.
  var touchMouseTime = 2000;
  if (e.type == 'click' &&
      Turtle.eventSpam.previousType_ == 'touchend' &&
      Turtle.eventSpam.previousDate_ + touchMouseTime > Date.now()) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  // Users double-click or double-tap accidentally.
  var doubleClickTime = 400;
  if (Turtle.eventSpam.previousType_ == e.type &&
      Turtle.eventSpam.previousDate_ + doubleClickTime > Date.now()) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  Turtle.eventSpam.previousType_ = e.type;
  Turtle.eventSpam.previousDate_ = Date.now();
  return false;
};




