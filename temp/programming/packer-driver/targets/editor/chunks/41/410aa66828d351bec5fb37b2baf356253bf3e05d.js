System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClassSon, ClassSuper, MainEntry, engineOverrider, ClassDictionary, _crd;

  function _reportPossibleCrUseOfClassSon(extras) {
    _reporterNs.report("ClassSon", "./../script/utils/ClassSon", _context.meta, extras);
  }

  function _reportPossibleCrUseOfClassSuper(extras) {
    _reporterNs.report("ClassSuper", "./../script/utils/ClassSuper", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMainEntry(extras) {
    _reporterNs.report("MainEntry", "./../script/com/MainEntry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfengineOverrider(extras) {
    _reporterNs.report("engineOverrider", "./../script/overwrite/engineOverride", _context.meta, extras);
  }

  _export("ClassDictionary", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClassSon = _unresolved_2.ClassSon;
    }, function (_unresolved_3) {
      ClassSuper = _unresolved_3.ClassSuper;
    }, function (_unresolved_4) {
      MainEntry = _unresolved_4.MainEntry;
    }, function (_unresolved_5) {
      engineOverrider = _unresolved_5.engineOverrider;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6d00aKt2rdCOJ/swfJbZtv9", "ClassDictionary", undefined);

      _export("ClassDictionary", ClassDictionary = class ClassDictionary {
        static getClassNameByTarget(anyObj) {
          if (anyObj) {
            let str = anyObj.toString();

            if (str.indexOf("function ") != -1) {
              let str1 = str.split(" ")[1];
              return str1.split("(")[0];
            } //anyObj非空时 有 ["__class__"] 的是实例 否则是一个Class


            if (anyObj["constructor"] && anyObj["constructor"].name) return anyObj["constructor"].name;
            if (anyObj["__proto__"]) return anyObj["__proto__"];
            if (anyObj["__class__"]) return anyObj["__class__"];
            if (anyObj.prototype && anyObj.prototype["__class__"]) return anyObj.prototype["__class__"];
          }

          let str = Object.prototype.toLocaleString.call(anyObj);
          let str1 = str.split(" ")[1];
          return str1.split("]")[0];
        }

      });

      ClassDictionary.classDic = {};
      ClassDictionary.classDic["ClassSon"] = _crd && ClassSon === void 0 ? (_reportPossibleCrUseOfClassSon({
        error: Error()
      }), ClassSon) : ClassSon;
      ClassDictionary.classDic["ClassSuper"] = _crd && ClassSuper === void 0 ? (_reportPossibleCrUseOfClassSuper({
        error: Error()
      }), ClassSuper) : ClassSuper;
      ClassDictionary.classDic["MainEntry"] = _crd && MainEntry === void 0 ? (_reportPossibleCrUseOfMainEntry({
        error: Error()
      }), MainEntry) : MainEntry;
      ClassDictionary.classDic["engineOverrider"] = _crd && engineOverrider === void 0 ? (_reportPossibleCrUseOfengineOverrider({
        error: Error()
      }), engineOverrider) : engineOverrider;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=410aa66828d351bec5fb37b2baf356253bf3e05d.js.map