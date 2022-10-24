System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, ClassSuper, _crd;

  _export("ClassSuper", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "29641h0tWdIfrQ6V91QCNzd", "ClassSuper", undefined);

      _export("ClassSuper", ClassSuper = class ClassSuper {
        constructor() {
          this._a = 1;
          this._b = 2;
          this.c = 0;
        }

        set a(value) {
          console.log("这里是父类的 set a");
          this._a = value * 2;
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
//# sourceMappingURL=e6912ff94c2cadca7ac25d475a7f1fa32e6bd058.js.map