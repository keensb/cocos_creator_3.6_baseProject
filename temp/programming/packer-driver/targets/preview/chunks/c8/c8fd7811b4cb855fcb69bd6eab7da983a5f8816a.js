System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, BaseNode, Node, UIOpacity, UITransform, engineOverrider, _crd;

  _export("engineOverrider", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      BaseNode = _cc.BaseNode;
      Node = _cc.Node;
      UIOpacity = _cc.UIOpacity;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4511eltdatDk5Ta8jjCWuAz", "engineOverride", undefined);

      __checkObsolete__(['BaseNode', 'Component', 'Node', 'UIOpacity', 'UITransform']);

      _export("engineOverrider", engineOverrider = class engineOverrider {
        static startWrite() {
          //新增API, 建议把API写进 or.d.ts 下的 interface BaseNode 中,便于在使用时带自动提示功能 
          //检测BaseNode之下有没有这个Component, 有的话直接返回Component的引用; 没有的话自动新增Component实例再返回其引用
          BaseNode.prototype.getOrAddComponent = function (componentType) {
            if (!this.getComponent(componentType)) {
              return this.addComponent(componentType);
            }

            return this.getComponent(componentType);
          }; //新增getter/setter:
          //建议把getter/setter 变量写进 or.d.ts 下的 interface Node 中,便于在使用时带自动提示功能 
          //绕开UIOpacity  直接通过赋值修改Node的opacity(不透明度)


          Object.defineProperty(Node.prototype, "opacity", {
            get: function get() {
              //没有UIOpacity? 那就自动创建一个
              return this.getOrAddComponent(UIOpacity).opacity;
            },
            set: function set(value) {
              //没有UIOpacity? 那就自动创建一个
              this.getOrAddComponent(UIOpacity).opacity = value;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(BaseNode.prototype, "ww", {
            get: function get() {
              //没有UITransform? 那就自动创建一个
              return this.getOrAddComponent(UITransform).width;
            },
            set: function set(value) {
              //没有UITransform? 那就自动创建一个
              this.getOrAddComponent(UITransform).width = value;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "hh", {
            get: function get() {
              //没有UITransform? 那就自动创建一个
              return this.getOrAddComponent(UITransform).height;
            },
            set: function set(value) {
              //没有UITransform? 那就自动创建一个
              this.getOrAddComponent(UITransform).height = value;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "x", {
            get: function get() {
              return this.position.x;
            },
            set: function set(value) {
              this.setPosition(value, this.position.y, this.position.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "y", {
            get: function get() {
              return this.position.y;
            },
            set: function set(value) {
              this.setPosition(this.position.x, value, this.position.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "z", {
            get: function get() {
              return this.position.z;
            },
            set: function set(value) {
              this.setPosition(this.position.x, this.position.y, value);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "scaleX", {
            get: function get() {
              return this.scale.x;
            },
            set: function set(value) {
              this.setScale(value, this.scale.y, this.scale.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "scaleY", {
            get: function get() {
              return this.scale.y;
            },
            set: function set(value) {
              this.setScale(this.scale.x, value, this.scale.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "scaleZ", {
            get: function get() {
              return this.scale.z;
            },
            set: function set(value) {
              this.setScale(this.scale.x, this.scale.y, value);
            },
            enumerable: true,
            configurable: true
          });
        }

      });

      engineOverrider.startWrite();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c8fd7811b4cb855fcb69bd6eab7da983a5f8816a.js.map