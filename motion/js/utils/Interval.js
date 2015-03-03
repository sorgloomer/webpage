/**
 * Created by Hege on 2014.11.07..
 */
define('utils.Interval', [], function() {

   function Interval(fn, defaultDelay) {
       var self = this;
       function start(delay) {
           stop();
           if (delay === undefined) delay = defaultDelay;
           self.id = setInterval(fn, delay);
           self.running = true;
       }
       function stop() {
           if (self.running) {
               clearInterval(self.id);
               self.id = null;
               self.running = false;
           }
       }

       this.running = false;
       this.id = null;
       this.start = start;
       this.stop = stop;
   }

    return Interval;

});