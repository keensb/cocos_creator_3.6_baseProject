System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  //从egret引擎移植过来的 执行对super的setter操作
  //例如 ClassSuper 和 ClassSon 都实现了 set a(value:number)时  superSetter 可以实现调用原始的 a
  function superSetter(currentClass, thisObj, type, value) {
    var values = [];

    for (var _i = 3; _i < arguments.length; _i++) {
      values[_i - 3] = arguments[_i];
    }

    var cla = currentClass.prototype;
    var seters;

    if (!currentClass.hasOwnProperty("__sets__")) {
      Object.defineProperty(currentClass, "__sets__", {
        "value": {}
      });
    }

    seters = currentClass["__sets__"];
    var setF = seters[type];

    if (setF) {
      return setF.apply(thisObj, values);
    }

    var d = Object.getPrototypeOf(cla);

    if (d == null) {
      return;
    }

    while (!d.hasOwnProperty(type)) {
      d = Object.getPrototypeOf(d);

      if (d == null) {
        return;
      }
    }

    setF = Object.getOwnPropertyDescriptor(d, type).set;
    seters[type] = setF;
    setF.apply(thisObj, values);
  } //从egret引擎移植过来的 执行对super的getter操作
  //例如 ClassSuper 和 ClassSon 都实现了 get a():number时  superGetter 可以实现调用原始的 a


  function superGetter(currentClass, thisObj, type, value) {
    var cla = currentClass.prototype;
    var geters;

    if (!currentClass.hasOwnProperty("__gets__")) {
      Object.defineProperty(currentClass, "__gets__", {
        "value": {}
      });
    }

    geters = currentClass["__gets__"];
    var getF = geters[type];

    if (getF) {
      return getF.call(thisObj);
    }

    var d = Object.getPrototypeOf(cla);

    if (d == null) {
      return;
    }

    while (!d.hasOwnProperty(type)) {
      d = Object.getPrototypeOf(d);

      if (d == null) {
        return;
      }
    }

    getF = Object.getOwnPropertyDescriptor(d, type).get;
    geters[type] = getF;
    return getF.call(thisObj);
  }

  _export({
    superSetter: superSetter,
    superGetter: superGetter
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "adc65EPJPtCPbp0TcBn9HFQ", "GlabolImport", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=169e1874860c4275c4e62bb888d311a29e232291.js.map