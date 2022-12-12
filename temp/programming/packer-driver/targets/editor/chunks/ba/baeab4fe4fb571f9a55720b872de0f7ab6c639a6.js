System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, BaseNode, director, Node, NodeEventType, UIOpacity, UITransform, engineOverrider, _crd;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      BaseNode = _cc.BaseNode;
      director = _cc.director;
      Node = _cc.Node;
      NodeEventType = _cc.NodeEventType;
      UIOpacity = _cc.UIOpacity;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4511eltdatDk5Ta8jjCWuAz", "engineOverride", undefined);

      __checkObsolete__(['BaseNode', 'Component', 'director', 'Node', 'NodeEventType', 'UIOpacity', 'UITransform']);

      engineOverrider = class engineOverrider {
        static startWrite() {
          //新增API, 建议把API写进 or.d.ts 下的 interface BaseNode 中,便于在使用时带自动提示功能 
          //检测BaseNode之下有没有这个Component, 有的话直接返回Component的引用; 没有的话自动新增Component实例再返回其引用
          BaseNode.prototype.getOrAddComponent = function (componentType, ...args) {
            if (!this.getComponent(componentType)) {
              return this.addComponent.call(this, componentType, ...args);
            }

            return this.getComponent(componentType);
          };

          Object.defineProperty(BaseNode.prototype, "stage", {
            get: function () {
              let parent = this.parent;

              while (parent) {
                if (parent == director.getScene()) {
                  break;
                }

                parent = parent.parent;
              }

              return parent;
            },
            enumerable: true,
            configurable: true
          });

          BaseNode.prototype.findSubComponent = function (componentType, ...args) {
            let arr = [];
            let obj = this.getComponent.call(this, componentType, ...args);

            if (obj) {
              arr.push(obj);
            }

            function loop(node) {
              if (node && node.children && node.children > 0) {
                for (let i = 0; i < node.children.length; i++) {
                  let nodeObj = node.children[i].getComponent.call(node.children[i], componentType, ...args);

                  if (nodeObj) {
                    arr.push(nodeObj);
                  }

                  loop(node.children[i]);
                }
              }
            }

            loop(this);
            return arr;
          };

          const _setParent = BaseNode.prototype.setParent;

          BaseNode.prototype.setParent = function setParent(value, keepWorldTransform) {
            //不能用 if(this.scene)来判断是否在场景上 this.scene 不会随着节点的 加载/移除 发生改变
            let oldStage = this.stage;

            const loopHandler = function (node, evtType) {
              if (node && node.children && node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                  if (!node.children[i].emit) continue;
                  node.children[i].emit(evtType);
                  loopHandler(node[i], evtType);
                }
              }
            };

            _setParent.call(this, value, keepWorldTransform);

            let newStage = this.stage;

            if (oldStage != newStage) {
              //场景发生了变化 有可能换了新场景 也有可能被加入场景成为可视节点  也有可能从场景上被移除出去
              if (this.emit) this.emit(NodeEventType.STAGE_CHANGED); // node.stage 可以检测有无舞台

              loopHandler(this, NodeEventType.STAGE_CHANGED);
            }
          }; //新增getter/setter:
          //建议把getter/setter 变量写进 or.d.ts 下的 interface Node 中,便于在使用时带自动提示功能 
          //绕开UIOpacity  直接通过赋值修改Node的opacity(不透明度)


          Object.defineProperty(Node.prototype, "opacity", {
            get: function () {
              //没有UIOpacity? 那就自动创建一个
              return this.getOrAddComponent(UIOpacity).opacity;
            },
            set: function (value) {
              //没有UIOpacity? 那就自动创建一个
              this.getOrAddComponent(UIOpacity).opacity = value;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(BaseNode.prototype, "ww", {
            get: function () {
              //没有UITransform? 那就自动创建一个
              return this.getOrAddComponent(UITransform).width;
            },
            set: function (value) {
              //没有UITransform? 那就自动创建一个
              this.getOrAddComponent(UITransform).width = value;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "hh", {
            get: function () {
              //没有UITransform? 那就自动创建一个
              return this.getOrAddComponent(UITransform).height;
            },
            set: function (value) {
              //没有UITransform? 那就自动创建一个
              this.getOrAddComponent(UITransform).height = value;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "x", {
            get: function () {
              return this.position.x;
            },
            set: function (value) {
              this.setPosition(value, this.position.y, this.position.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "y", {
            get: function () {
              return this.position.y;
            },
            set: function (value) {
              this.setPosition(this.position.x, value, this.position.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "z", {
            get: function () {
              return this.position.z;
            },
            set: function (value) {
              this.setPosition(this.position.x, this.position.y, value);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "scaleX", {
            get: function () {
              return this.scale.x;
            },
            set: function (value) {
              this.setScale(value, this.scale.y, this.scale.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "scaleY", {
            get: function () {
              return this.scale.y;
            },
            set: function (value) {
              this.setScale(this.scale.x, value, this.scale.z);
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "scaleZ", {
            get: function () {
              return this.scale.z;
            },
            set: function (value) {
              this.setScale(this.scale.x, this.scale.y, value);
            },
            enumerable: true,
            configurable: true
          });
        }

      };
      engineOverrider.startWrite();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=baeab4fe4fb571f9a55720b872de0f7ab6c639a6.js.map