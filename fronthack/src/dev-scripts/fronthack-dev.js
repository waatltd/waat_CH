// FRONTHACK DEVELOPMENT SCRIPTS



//================================================================================
// Apply livereload
//================================================================================
document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')



//================================================================================
// Construct design toggler and canvas
//================================================================================

// Define variables that must have a global scope.
var canvas = download = null;
var url = window.location.href
var pageName = (window.location.pathname === '/') ? "index" : window.location.pathname.replace(/\/|.html/g, "")

loadDevStyles();
setBodyClass();
creadeDesigns();
createToggler();
createCanvas();
createDownloadButton();
toggleDraw();


//
// Load development stylesheets.
//--------------------------------------------------------------------------------
function loadDevStyles() {
  var styles = "@import url('" + window.location.origin + "/dev-scripts/dev.css ');";
  var newSS=document.createElement('link');
  newSS.rel='stylesheet';
  newSS.href='data:text/css,'+styles;
  document.getElementsByTagName("head")[0].appendChild(newSS);
}


//
// Add correct mode class to body.
//--------------------------------------------------------------------------------
function setBodyClass() {
  document.body.classList.remove("show-code-designs");
  document.body.classList.remove("show-designs");
  document.body.classList.remove("show-code");
  if (sessionStorage.getItem('mode') === 'code') {
    document.body.classList.add("show-code-designs");
  } else if (sessionStorage.getItem('mode') === 'code-designs') {
    document.body.classList.add("show-designs");
  } else {
    document.body.classList.add("show-code");
  }
}


//
// Create designs div.
//--------------------------------------------------------------------------------
function creadeDesigns() {
  var designs = document.createElement("div");
  designs.className = "designs designs--" + pageName;
  document.body.appendChild(designs);
}


//
// Create toggler
//--------------------------------------------------------------------------------
function createToggler() {
  var toggler = document.createElement("div");
  toggler.id = "fronthack-toggler";
  toggler.setAttribute('onclick', 'toggleMode();');
  toggler.setAttribute('title', 'Toggle mode');
  document.body.appendChild(toggler);
}


//
// Create canvas and populate it with conten if there is any.
//--------------------------------------------------------------------------------
function createCanvas() {
  var canvas = document.createElement("div");
  canvas.id = "fronthack-canvas";
  var request = new XMLHttpRequest();
  request.open('GET', window.location.origin + '/dev-scripts/drawed-canvas-' + pageName + '.html', true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      if (request.responseText) {
        canvas.innerHTML = request.responseText;
      }
    }
  }
  document.body.appendChild(canvas);
}


//
// Create download canvas button.
//--------------------------------------------------------------------------------
function createDownloadButton() {
  download = document.createElement("a");
  download.style.display = 'none';
  download.id = 'fronthack-download';
  download.innerHTML = 'Save canvas';
  download.setAttribute('onclick', 'alert(\'To save canvas, copy the "drawed-canvas-' + pageName + '.html" file  to "scr/dev-scripts" folder. File will be downloaded now.\')');
  document.body.appendChild(download);
}


//
// Toogle mode.
//--------------------------------------------------------------------------------
function toggleMode() {
  // code         - Code only
  // code-designs - Code and design
  // designs      - Designs only
  if (sessionStorage.getItem('mode') === 'code') {
    sessionStorage.setItem('mode', 'code-designs');
  } else if (sessionStorage.getItem('mode') === 'code-designs') {
    sessionStorage.setItem('mode', 'designs');
  } else {
    sessionStorage.setItem('mode', 'code');
  }
  setBodyClass()
  toggleDraw();
}


//
// Create canvas for drawing.
//--------------------------------------------------------------------------------
function toggleDraw() {
  canvas = document.getElementById('fronthack-canvas');
  if (sessionStorage.getItem('mode') !== 'code') {
    generateDownload();
    return;
  }

  function setMousePosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  };

  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };
  var element = null;

  canvas.onmousemove = function (e) {
    setMousePosition(e);
    if (element !== null) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
      element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
      element.style.left = (mouse.x - mouse.startX <= 0) ? mouse.x + 'px' : mouse.startX + 'px';
      element.style.top = (mouse.y - mouse.startY <= 0) ? mouse.y + 'px' : mouse.startY + 'px';
    }
  }

  canvas.onclick = function (e) {
    if (element !== null) {
      var name = prompt('Enter name of the block.eg "nav-horizontal", "layout-header"');
      if (name) {
        element.setAttribute('bem-name', name);
      }
      element.classList.remove('drawing');
      element = null;
      generateDownload();
      console.log("finsihed draw.");
    } else {
      console.log("begun draw.");
      mouse.startX = e.pageX;
      mouse.startY = e.pageY;
      element = document.createElement('div');
      element.classList.add('bem-block', 'drawing');
      element.style.left = e.pageX + 'px';
      element.style.top = e.pageY + 'px';
      canvas.appendChild(element)
    }
  }

  // Stop drawing after pressing the Esc button.
  document.onkeydown = function(e) {
    if(e.keyCode ===27) {
      canvas.removeChild(canvas.lastChild);
      element = null;
    }
  }
}


//
// Generate link to download drawed canvas.
//--------------------------------------------------------------------------------
function generateDownload() {
  if (canvas.hasChildNodes()) {
    var drawedContent = canvas.innerHTML;
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(drawedContent));
    download.setAttribute('download', 'drawed-canvas-' + pageName + '.html');
    download.style.display = 'block';
  }
}
