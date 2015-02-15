// mock AngularJS proxy to window.alertify
(function (angular, alertify) {

  angular.module('Alertify', [])
    .factory('Alertify', ['$q', function ($q) {

      if (typeof alertify === 'undefined') {
        throw new Error('Missing alertify object');
      }

      var alertifyProxy = Object.create(alertify);

      function newlineToBreak(x) {
        return typeof x === 'string' ? x.replace(/\n/g, '<br>') : x;
      }

      // make sure the newlines are formatted in the output html
      var messageMethods = ['log', 'error', 'success'];

      // overwrite .log(), .error(), and other simple popups
      messageMethods.forEach(function (name) {
        alertifyProxy[name] = function () {
          var args = Array.prototype.map.call(arguments, newlineToBreak);
          return alertify[name].apply(alertify, args);
        };
      });

      // transform .confirm(message) into promise-returning method
      alertifyProxy.confirm = function (message) {
        var defer = $q.defer();
        alertify.confirm(message, function (answer) {
          if (answer) {
            defer.resolve(answer);
          } else {
            defer.reject(answer);
          }
        });
        return defer.promise;
      };

      // transform .prompt(message) into promise-returning method
      alertifyProxy.prompt = function (message, defaultValue) {
        var defer = $q.defer();
        alertify.prompt(message, function (yes, answer) {
          if (yes) {
            defer.resolve(answer);
          } else {
            defer.reject();
          }
        }, defaultValue);
        return defer.promise;
      };

      return alertifyProxy;
    }]);
}(window.angular, window.alertify));
