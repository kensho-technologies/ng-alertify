/* global helpDescribe, ngDescribe, it, la, sinon */
helpDescribe('ng-alertify', function () {
  var check = window.check;

  ngDescribe({
    name: 'alertify service',
    only: false,
    modules: 'Alertify',
    inject: ['Alertify', '$rootScope'],
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
        sinon.spy(deps.Alertify, 'success');
        deps.Alertify.success('everything is ok');
        la(deps.Alertify.success.called);
        deps.Alertify.success.restore();
      });

      it('replaces new lines with break tags in log method', function () {
        sinon.spy(window.alertify, 'log');
        deps.Alertify.log('line 1\nline 2');
        var logString = window.alertify.log.lastCall.args[0];
        la(logString.indexOf('<br>') !== -1);
        la(logString.indexOf('\n') === -1);
        window.alertify.log.restore();
      });

      it('replaces new lines with break tags in error method', function () {
        sinon.spy(window.alertify, 'error');
        // make sure to remove all new lines
        deps.Alertify.error('line 1\nline 2\nline 3');
        var logString = window.alertify.error.lastCall.args[0];
        la(logString.indexOf('<br>') !== -1);
        la(logString.indexOf('\n') === -1);
        window.alertify.error.restore();
      });

      it('accepts multiple string arguments', function () {
        sinon.spy(window.alertify, 'error');
        deps.Alertify.error('foo', 'bar', 'baz');
        var logString = window.alertify.error.lastCall.args[0];
        la(logString === 'foo bar baz');
        window.alertify.error.restore();
      });

      it('supports Error instances', function () {
        sinon.spy(window.alertify, 'error');
        deps.Alertify.error('foo', new Error('bar'));
        var logString = window.alertify.error.lastCall.args[0];
        la(logString === 'foo bar');
        window.alertify.error.restore();
      });

      it('has promise-returning confirm', function (done) {
        function confirm(message, cb, cssClass) {
          la(message === 'foo');
          la(cssClass === 'bar-class');
          cb('ok');
        }
        var stub = sinon.stub(window.alertify, 'confirm', confirm);
        deps.Alertify.confirm('foo', 'bar-class')
          .then(function (result) {
            la(result === 'ok');
          }, function rejected() {
            la(false, 'unexpected rejection');
          })
          .finally(function () {
            stub.restore();
            done();
          });
        deps.$rootScope.$apply();
      });
    }
  });

  ngDescribe({
    name: 'alertify meta',
    only: false,
    modules: 'Alertify',
    inject: 'meta',
    tests: function (deps) {
      // TODO: move to check-more-types
      check.semver = function semver(value) {
        if (!check.unemptyString(value)) {
          return false;
        }
        var parts = value.split('.');
        if (parts.length !== 3) {
          return false;
        }
        return check.number(parseInt(parts[0])) &&
          check.number(parseInt(parts[1])) &&
          check.number(parseInt(parts[2]));
      };

      it('has meaningful meta', function () {
        la(check.object(deps.meta));
        la(check.unemptyString(deps.meta.name));
        la(check.unemptyString(deps.meta.version));
        la(check.semver(deps.meta.version));
      });
    }
  });
});
