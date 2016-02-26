function sourcegraph_activateDefnPopovers(el) {

  var activeA;
  el.addEventListener("mouseover", function(ev) {
    var t = __sg_getTarget(ev.target);
    if (!t) return;
    // if (activeA != t) console.log('ACTIVE:', t.href);
    if (activeA != t) {
      activeA = t;
      ajaxGet(activeA.href + "/.popover", function(html) {
        if (activeA) showPopover(html);
      });
    }
  });
  el.addEventListener("mouseout", function(ev) {
    var t = __sg_getTarget(ev.toElement);
    if (!t) {
      setTimeout(hidePopover);
      activeA = null;
    }
  });

  function __sg_getTarget(t) {
    while (t && t.tagName == "SPAN") { t = t.parentNode; }
    if (t && t.tagName == "A" && t.classList.contains("defn-popover")) return t;
  }

  var popover;
  var showingPopover;
  var preShowingX, preShowingY;
  function showPopover(html) {
    showingPopover = true;
    if (!popover) {
      popover = document.createElement("div");
      popover.classList.add("sourcegraph-popover");
      popover.style.position = "absolute";
      document.body.appendChild(popover);
    }
    positionPopover(preShowingX, preShowingY);
    popover.innerHTML = html;
    popover.classList.add("visible");
    popover.style.display = "block";
  }

  function hidePopover() {
    if (!popover) return;
    showingPopover = false;
    setTimeout(function() {
      if (!showingPopover) popover.style.display = "none";
    }, 200);
    popover.classList.remove("visible");
  }

  document.addEventListener("mousemove", function(ev) {
    preShowingX = ev.pageX;
    preShowingY = ev.pageY;
    positionPopover(ev.pageX, ev.pageY);
  });

  function positionPopover(x, y) {
    if (!popover || !showingPopover) return;
    popover.style.top = (y + 15) + "px";
    popover.style.left = (x + 15) + "px";
  }

  var ajaxCache = {};
  function ajaxGet(url, cb) {
    if (ajaxCache[url]) {
      cb(ajaxCache[url]);
      return;
    }
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && 400 > request.status) {
        ajaxCache[url] = request.responseText;
        cb(request.responseText);
      } else if (request.readyState > 1) {
        console.error("Sourcegraph error getting definition info.", JSON.stringify(request));
      }
    };
    request.onerror = function() { console.error("Sourcegraph error getting definition info."); };
    request.send();
  }
}
