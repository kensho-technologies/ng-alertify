/* global helpDescribe, ngDescribe, it, la, spyOn */
helpDescribe('ng-alertify', function () {
  var check = window.check;
  ngDescribe({
    name: 'alertify service',
    only: false,
    modules: 'Alertify',
    inject: 'Alertify',
    tests: function (deps) {
      it('has Alertify injected', function () {
        la(deps.Alertify);
      });

      it('has main methods', function () {
        la(check.fn(deps.Alertify.success), 'has success');
        la(check.fn(deps.Alertify.error), 'has error');
        la(check.fn(deps.Alertify.log), 'has log method');
      });

      it('it can be spied on', function () {
        spyOn(deps.Alertify, 'success');
        deps.Alertify.success('everything is ok');
        la(deps.Alertify.success.wasCalled);
      });

      it('replaces new lines with break tags in log method', function () {
        spyOn(window.alertify, 'log');
        deps.Alertify.log('line 1\nline 2');
        var logString = window.alertify.log.mostRecentCall.args[0];
        la(logString.indexOf('<br>') !== -1);
        la(logString.indexOf('\n') === -1);
      });

      it('replaces new lines with break tags in error method', function () {
        spyOn(window.alertify, 'error');
        // make sure to remove all new lines
        deps.Alertify.error('line 1\nline 2\nline 3');
        var logString = window.alertify.error.mostRecentCall.args[0];
        la(logString.indexOf('<br>') !== -1);
        la(logString.indexOf('\n') === -1);
      });
    }
  });
});
