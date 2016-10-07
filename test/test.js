"use strict";

var _listenerMin = require("../lib/listener.min.js");

var _listenerMin2 = _interopRequireDefault(_listenerMin);

var _should = require("should");

var _should2 = _interopRequireDefault(_should);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var listener = new _listenerMin2.default();

describe("\u6D4B\u8BD5 listener Pub/Sub API \u80FD\u5426\u6B63\u5E38\u4F7F\u7528", function () {
    it("sub \u540E\u53EF\u4EE5\u6267\u884C unsub \u8FDB\u884C\u53D6\u6D88\u4E8B\u4EF6\u7684\u7ED1\u5B9A\uFF01", function () {

        listener.subscribe("event", function () {
            throw new Error("\u6211\u4E0D\u5E94\u8BE5\u88AB\u6267\u884C");
        });

        listener.unsubscribe("event");

        (function () {
            listener.publish("event");
        }).should.throw("Error: The Event didnt bind !");
    });

    it("pub \u540E \u53EF\u4EE5\u6267\u884C sub \u7ED1\u5B9A\u7684\u56DE\u8C03\u51FD\u6570\u6267\u884C", function () {
        listener.subscribe("INCRMENT", function () {
            for (var _len = arguments.length, param = Array(_len), _key = 0; _key < _len; _key++) {
                param[_key] = arguments[_key];
            }

            param.reduce(function (prev, next) {
                return prev + next;
            }).should.equal(10);
        });

        // doing any something

        listener.publish("INCRMENT", 1, 2, 3, 4);
    });

    it("\u53EF\u5728\u4E00\u4E2A\u76D1\u542C\u7C7B\u76EE\u4E2D\uFF0C\u6DFB\u52A0\u4E0D\u540C\u7684\u533F\u540D\u7A7A\u95F4", function () {
        listener.subscribe("event2.add", function () {
            throw new Error("\u6211\u4E0D\u5E94\u8BE5\u88AB\u6267\u884C");
        });

        listener.subscribe("event2.mul", function () {
            for (var _len2 = arguments.length, param = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                param[_key2] = arguments[_key2];
            }

            param.reduce(function (prev, next) {
                return prev * next;
            }).should.equal(6);
        });

        listener.publish("event2.mul", 1, 2, 3);
    });

    it("\u5F53\u6267\u884C\u4E00\u4E2A\u76D1\u542C\u7C7B\u76EE\u540E, \u6240\u6709\u8BA2\u9605\u547D\u540D\u7C7B\u76EE\u90FD\u4F1A\u6267\u884C \u5E76\u4E14\u80FD\u591F\u83B7\u5F97\u76F8\u540C\u7684\u4F20\u5165\u7684\u53C2\u6570", function () {
        var arr = [];

        listener.subscribe("event3.add", function () {
            for (var _len3 = arguments.length, param = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                param[_key3] = arguments[_key3];
            }

            arr.push(param.reduce(function (prev, next) {
                return prev + next;
            }));
        });

        listener.subscribe("event3.mul", function () {
            for (var _len4 = arguments.length, param = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                param[_key4] = arguments[_key4];
            }

            arr.push(param.reduce(function (prev, next) {
                return prev * next;
            }));
        });

        listener.publish("event3", 1, 2, 3);

        // 6 + 6
        arr.reduce(function (p, n) {
            return p + n;
        }).should.equal(12);
    });

    it("\u53D1\u5E03\u4E00\u4E2A\u53EA\u80FD\u6267\u884C\u4E00\u6B21\u7684\u8BA2\u9605\u51FD\u6570", function () {
        var temp = 0;

        listener.subscribe("event4", function () {
            temp++;
        });

        listener.once("event4");

        (function () {
            listener.publish("event4");
        }).should.throw("Error: The Event didnt bind !");

        temp.should.equal(1);
    });
});