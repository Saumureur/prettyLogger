"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicLogger = void 0;
var BasicLogger_1 = require("./BasicLogger");
Object.defineProperty(exports, "BasicLogger", { enumerable: true, get: function () { return BasicLogger_1.BasicLogger; } });
var BasicLogger_2 = require("./BasicLogger");
var myLogger = new BasicLogger_2.BasicLogger("src/config/config.json");
var message = {
    message: "This is a log message",
    object: [1, "two", { three: 3 }],
    level: "info"
};
myLogger.log(message);
console.log(myLogger.config);
