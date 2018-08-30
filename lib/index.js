'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var iterall = require('iterall');
var nats = require('nats');
var stan = require('node-nats-streaming');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/**
 * A class for digesting PubSubEngine events via the new AsyncIterator interface.
 * This implementation is a generic version of the one located at
 * https://github.com/apollographql/graphql-subscriptions/blob/master/src/event-emitter-to-async-iterator.ts
 * @class
 *
 * @constructor
 *
 * @property pullQueue @type {Function[]}
 * A queue of resolve functions waiting for an incoming event which has not yet arrived.
 * This queue expands as next() calls are made without PubSubEngine events occurring in between.
 *
 * @property pushQueue @type {any[]}
 * A queue of PubSubEngine events waiting for next() calls to be made.
 * This queue expands as PubSubEngine events arrive without next() calls occurring in between.
 *
 * @property eventsArray @type {string[]}
 * An array of PubSubEngine event names which this PubSubAsyncIterator should watch.
 *
 * @property allSubscribed @type {Promise<number[]>}
 * A promise of a list of all subscription ids to the passed PubSubEngine.
 *
 * @property listening @type {boolean}
 * Whether or not the PubSubAsynIterator is in listening mode (responding to incoming PubSubEngine events and next() calls).
 * Listening begins as true and turns to false once the return method is called.
 *
 * @property pubsub @type {PubSubEngine}
 * The PubSubEngine whose events will be observed.
 */
var PubSubAsyncIterator = /** @class */ (function () {
    function PubSubAsyncIterator(pubsub, eventNames, options) {
        this.pubsub = pubsub;
        this.pullQueue = [];
        this.pushQueue = [];
        this.listening = true;
        this.eventsArray = typeof eventNames === 'string' ? [eventNames] : eventNames;
        this.options = options;
        this.allSubscribed = this.subscribeAll();
    }
    PubSubAsyncIterator.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.allSubscribed];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.listening ? this.pullValue() : this.return()];
                }
            });
        });
    };
    PubSubAsyncIterator.prototype.return = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.emptyQueue;
                        return [4 /*yield*/, this.allSubscribed];
                    case 1:
                        _a.apply(this, [_b.sent()]);
                        return [2 /*return*/, { value: undefined, done: true }];
                }
            });
        });
    };
    PubSubAsyncIterator.prototype.throw = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.emptyQueue;
                        return [4 /*yield*/, this.allSubscribed];
                    case 1:
                        _a.apply(this, [_b.sent()]);
                        return [2 /*return*/, Promise.reject(error)];
                }
            });
        });
    };
    PubSubAsyncIterator.prototype[iterall.$$asyncIterator] = function () {
        return this;
    };
    PubSubAsyncIterator.prototype.pushValue = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.allSubscribed];
                    case 1:
                        _a.sent();
                        if (this.pullQueue.length !== 0) {
                            this.pullQueue.shift()({ value: message, done: false });
                        }
                        else {
                            this.pushQueue.push(message);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PubSubAsyncIterator.prototype.pullValue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.pushQueue.length !== 0) {
                resolve({ value: _this.pushQueue.shift(), done: false });
            }
            else {
                _this.pullQueue.push(resolve);
            }
        });
    };
    PubSubAsyncIterator.prototype.emptyQueue = function (subscriptionIds) {
        if (this.listening) {
            this.listening = false;
            this.unsubscribeAll(subscriptionIds);
            this.pullQueue.forEach(function (resolve) { return resolve({ value: undefined, done: true }); });
            this.pullQueue.length = 0;
            this.pushQueue.length = 0;
        }
    };
    PubSubAsyncIterator.prototype.subscribeAll = function () {
        var _this = this;
        var self = this;
        return Promise.all(this.eventsArray.map(function (eventName) { return _this.pubsub.subscribe(eventName, _this.pushValue.bind(_this), self.options); }));
    };
    PubSubAsyncIterator.prototype.unsubscribeAll = function (subscriptionIds) {
        for (var _i = 0, subscriptionIds_1 = subscriptionIds; _i < subscriptionIds_1.length; _i++) {
            var subscriptionId = subscriptionIds_1[_i];
            this.pubsub.unsubscribe(subscriptionId);
        }
    };
    return PubSubAsyncIterator;
}());

var NatsPubSub = /** @class */ (function () {
    function NatsPubSub(options) {
        if (options === void 0) { options = {}; }
        this.nats = nats.connect(options.natsUrl || 'nats://127.0.0.1:4222');
    }
    NatsPubSub.prototype.publish = function (subject, payload) {
        this.nats.publish(subject, JSON.stringify(payload));
        return true;
    };
    NatsPubSub.prototype.subscribe = function (subject, onMessage) {
        var sid = this.nats.subscribe(subject, function (msg) { return onMessage(JSON.parse(msg)); });
        return Promise.resolve(sid);
    };
    NatsPubSub.prototype.unsubscribe = function (sid) {
        this.nats.unsubscribe(sid);
    };
    NatsPubSub.prototype.asyncIterator = function (subjects) {
        return new PubSubAsyncIterator(this, subjects);
    };
    return NatsPubSub;
}());

var StanPubSub = /** @class */ (function () {
    function StanPubSub(options) {
        this.subscriptions = new Map();
        this.nextSubscriptionNumber = 1;
        this.options = options;
    }
    StanPubSub.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var maybeClient = stan.connect(_this.options.clusterId, _this.options.clientId, { url: _this.options.natsUrl });
                        maybeClient.on("connect", function () {
                            maybeClient.removeAllListeners("error");
                            self.stanClient = maybeClient;
                            resolve();
                        });
                        maybeClient.on("error", function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    };
    StanPubSub.prototype.publish = function (subject, payload) {
        this.stanClient.publish(subject, JSON.stringify(payload));
        return true;
    };
    StanPubSub.prototype.subscribe = function (subject, onMessage, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var subOpts = _this.stanClient.subscriptionOptions();
            subOpts.setManualAckMode(true);
            if (options && options.startTime) {
                // options.startTime is expected to be in unix millis
                var startDate = new Date(options.startTime);
                subOpts.setStartTime(startDate);
            }
            var sub = _this.stanClient.subscribe(subject, "", subOpts);
            sub.on("ready", function () {
                sub.on("message", function (msg) {
                    onMessage(JSON.parse(msg.getData()));
                    msg.ack();
                });
                var subNum = _this.nextSubscriptionNumber;
                _this.nextSubscriptionNumber += 1;
                _this.subscriptions.set(subNum, sub);
                resolve(subNum);
            });
            sub.on("error", function (err) {
                reject(err);
            });
        });
    };
    StanPubSub.prototype.unsubscribe = function (sid) {
        var sub = this.subscriptions.get(sid);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(sid);
        }
    };
    StanPubSub.prototype.close = function () {
      this.stanClient.close();
    };
    StanPubSub.prototype.asyncIterator = function (subjects, options) {
        return new PubSubAsyncIterator(this, subjects, options);
    };
    return StanPubSub;
}());

exports.NatsPubSub = NatsPubSub;
exports.StanPubSub = StanPubSub;
