// mock AngularJS proxy to window.alertify
(function (angular, alertify) {

  angular.module('Alertify', [])
    .factory('Alertify', function () {

      if (typeof alertify === 'undefined') {
        throw new Error('Missing alertify object');
      }

      var alertifyProxy = Object.create(alertify);

      function newlineToBreak(x) {
        return typeof x === 'string' ? x.replace(/\n/g, '<br>') : x;
      }

      // make sure the newlines are formatted in the output html
      var messageMethods = ['log', 'error', 'success'];

      messageMethods.forEach(function (name) {
        alertifyProxy[name] = function () {
          var args = Array.prototype.map.call(arguments, newlineToBreak);
          return alertify[name].apply(alertify, args);
        };
      });

      return alertifyProxy;
    });
}(window.angular, window.alertify));
