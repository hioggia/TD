  function TimeLine(precision) {
    var timerProcs = new Array();
    var handler = null;

    this.addTimerProc = function(proc) {
      if (proc instanceof Function) {
        timerProcs.push(proc);
        if (handler == null) {
          handler = setInterval(
            function() {
              for (var i = 0; i < timerProcs.length; i++) {
                timerProcs[i].apply(this, arguments);
              }
            },
            precision
          );
        }
      }
    }

    this.removeTimerProc = function(proc) {
      for (var i = 0; i < timerProcs.length; i++) {
        if (timerProcs[i] == proc) {
          timerProcs.splice(i, 1);
          break;
        }
      }
      if (timerProcs.length == 0) {
        clearInterval(handler);
        handler = null;
      }
    }
    this.pause = function(){
      if(!handler) return;
      clearInterval(handler);
      handler = null;
    }
    this.resume = function() {
      if(handler) return;
      handler = setInterval(
        function() {
          for (var i = 0; i < timerProcs.length; i++) {
            timerProcs[i].apply(this, arguments);
          }
        },
        precision
      );
    }
  }
