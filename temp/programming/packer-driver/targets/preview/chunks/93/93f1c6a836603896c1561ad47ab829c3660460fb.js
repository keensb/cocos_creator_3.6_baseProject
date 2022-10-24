System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClassSuper, ClassSon, _crd;

  function _reportPossibleCrUseOfClassSuper(extras) {
    _reporterNs.report("ClassSuper", "./ClassSuper", _context.meta, extras);
  }

  _export("ClassSon", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClassSuper = _unresolved_2.ClassSuper;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "94b56jrBjdOB6C6K5jjDFO6", "ClassSon", undefined);

      _export("ClassSon", ClassSon = class ClassSon extends (_crd && ClassSuper === void 0 ? (_reportPossibleCrUseOfClassSuper({
        error: Error()
      }), ClassSuper) : ClassSuper) {
        constructor() {
          super();
          this._a = 1;
          this._b = 2;
        }

        set a(value) {
          console.log("这里是子类的 set a");
          this._a = value;
          super.c = 10;
        }

        get a() {
          return this._a;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=93f1c6a836603896c1561ad47ab829c3660460fb.js.map