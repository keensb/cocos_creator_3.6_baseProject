System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, find, Node, log, UIOpacity, Label, tween, ClassSon, superSetter, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, MainEntry;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfClassSon(extras) {
    _reporterNs.report("ClassSon", "../utils/ClassSon", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsuperSetter(extras) {
    _reporterNs.report("superSetter", "../utils/GlabolImport", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      find = _cc.find;
      Node = _cc.Node;
      log = _cc.log;
      UIOpacity = _cc.UIOpacity;
      Label = _cc.Label;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      ClassSon = _unresolved_2.ClassSon;
    }, function (_unresolved_3) {
      superSetter = _unresolved_3.superSetter;
    }, function (_unresolved_4) {}],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6ed06uAdspJsK6+36eBYzli", "MainEntry", undefined);

      __checkObsolete__(['_decorator', 'Component', 'find', 'director', 'Node', 'log', 'UIOpacity', 'Label', 'tween', 'Vec3', 'BaseNode', 'NodeEventType', 'Scene']);

      //不带 from 关键字的import,  作用是直接导进来并立即执行 相当于js的 require()
      ({
        ccclass,
        property
      } = _decorator);

      _export("MainEntry", MainEntry = (_dec = ccclass('MainEntry'), _dec2 = property({
        type: Label,
        //对象类型
        visible: true,
        //是否在面板上显示这个属性
        displayName: "我被改了名字",
        //改对象对外显示的名称
        tooltip: "我的原名叫 label" //鼠标移上去时显示的说明

      }), _dec(_class = (_class2 = class MainEntry extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "label", _descriptor, this);
        }

        onLoad() {
          console.log("okokokok", this.node["__proto__"]); //engineOverrider.startWrite();//在 creator 底层的JS原型链中 新增或覆盖自定义的业务代码
        }

        start() {
          var son = new (_crd && ClassSon === void 0 ? (_reportPossibleCrUseOfClassSon({
            error: Error()
          }), ClassSon) : ClassSon)();
          log(son.a);
          (_crd && superSetter === void 0 ? (_reportPossibleCrUseOfsuperSetter({
            error: Error()
          }), superSetter) : superSetter)(_crd && ClassSon === void 0 ? (_reportPossibleCrUseOfClassSon({
            error: Error()
          }), ClassSon) : ClassSon, son, "a", 5);
          log(son.a);
          son.a = 3;
          log(son.a); //find("Canvas/bg").getComponent(UIOpacity).opacity = 100;

          var bg = find("Canvas/bg");
          bg.getOrAddComponent(UIOpacity).opacity = 100;
          window["bg"] = bg;
          bg.setPosition(100, bg.position.y);
          console.log("scale", bg.scale);
          tween(bg).to(5, {
            scaleX: 2
          }).start();
          tween(bg).to(5, {
            hh: 400
          }).start();
          var textObj2 = this.test(10, 20, Node, "hello");
          console.log("textObj2 =", textObj2, textObj2["name"]);
          var xxx = new Node();
          this.node.addChild(xxx);
          console.log("STAGE_CHANGED1111", xxx.stage);
          this.node.removeChild(xxx);
          console.log("STAGE_CHANGED2222", xxx.stage);
        }

        test(x, y, inst) {
          for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            args[_key - 3] = arguments[_key];
          }

          var obj = new inst(...args);
          obj["x"] = x;
          obj["y"] = y;
          return obj;
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a2f394ed7b33e5a76a3bd239a17057c906cda188.js.map