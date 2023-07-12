/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var RecordType;
(function (RecordType) {
    RecordType[RecordType["HEAD"] = 0] = "HEAD";
    RecordType[RecordType["SNAPSHOT"] = 1] = "SNAPSHOT";
    RecordType[RecordType["WINDOW"] = 2] = "WINDOW";
    RecordType[RecordType["SCROLL"] = 3] = "SCROLL";
    RecordType[RecordType["MOUSE"] = 4] = "MOUSE";
    RecordType[RecordType["DOM"] = 5] = "DOM";
    RecordType[RecordType["FORM_EL"] = 6] = "FORM_EL";
    RecordType[RecordType["LOCATION"] = 7] = "LOCATION";
    RecordType[RecordType["AUDIO"] = 8] = "AUDIO";
    RecordType[RecordType["CANVAS"] = 9] = "CANVAS";
    RecordType[RecordType["TERMINATE"] = 10] = "TERMINATE";
    RecordType[RecordType["FONT"] = 11] = "FONT";
    RecordType[RecordType["PATCH"] = 12] = "PATCH";
    RecordType[RecordType["CUSTOM"] = 13] = "CUSTOM";
    RecordType[RecordType["WEBGL"] = 14] = "WEBGL";
    RecordType[RecordType["CANVAS_SNAPSHOT"] = 15] = "CANVAS_SNAPSHOT";
    RecordType[RecordType["VIDEO"] = 16] = "VIDEO";
})(RecordType || (RecordType = {}));
var FormElementEvent;
(function (FormElementEvent) {
    FormElementEvent[FormElementEvent["PROP"] = 0] = "PROP";
    FormElementEvent[FormElementEvent["INPUT"] = 1] = "INPUT";
    FormElementEvent[FormElementEvent["CHANGE"] = 2] = "CHANGE";
    FormElementEvent[FormElementEvent["FOCUS"] = 3] = "FOCUS";
    FormElementEvent[FormElementEvent["BLUR"] = 4] = "BLUR";
})(FormElementEvent || (FormElementEvent = {}));
var MouseEventType;
(function (MouseEventType) {
    MouseEventType[MouseEventType["MOVE"] = 0] = "MOVE";
    MouseEventType[MouseEventType["CLICK"] = 1] = "CLICK";
})(MouseEventType || (MouseEventType = {}));
var TransactionMode;
(function (TransactionMode) {
    TransactionMode["READONLY"] = "readonly";
    TransactionMode["READWRITE"] = "readwrite";
    TransactionMode["VERSIONCHANGE"] = "versionchange";
})(TransactionMode || (TransactionMode = {}));

var name = "xreplay";
var version = "0.0.3";
var homepage = "https://github.com/song940/xreplay#readme";

const isDev = undefined === 'development';
function logError(e) {
    const msg = e.message || e;
    console.error(`TimeCat Error: ${msg}`);
    return msg;
}
function logAdvice(msg) {
    console.log(`%c TimeCat Advice: ${msg}`, 'color:#0f0;');
    return msg;
}
function getTime() {
    return Date.now();
}
function getRandomCode(len = 8) {
    const code = (Math.random() * 20 + 16).toString(36).substring(2, len + 2);
    return code.toUpperCase();
}
function secondToTime(second) {
    if (second <= 0) {
        second = 0;
    }
    const [h, m, s] = [Math.floor(second / 3600), Math.floor((second / 60) % 60), Math.floor(second % 60)];
    const timeStr = [h, m, s].map(i => (i <= 9 ? '0' + i : i)).join(':');
    return timeStr.replace(/^00\:/, '');
}
function getDateTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    const formattedTime = (hours < 10 ? '0' + hours : hours) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}
function toTimeStamp(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        const [min, sec] = parts;
        return (+min * 60 + +sec) * 1000;
    }
    const [hour, min, sec] = parts;
    return (+hour * 3600 + +min * 60 + +sec) * 1000;
}
function isSnapshot(frame) {
    return frame.type === RecordType.SNAPSHOT && !frame.data.frameId;
}
function delay(t = 200) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(r => {
            setTimeout(() => r(), t);
        });
    });
}
function isVNode(n) {
    return !!n.tag;
}
function revertStrByPatches(str, changes) {
    changes.forEach((change) => {
        const { type, value, len } = change;
        switch (type) {
            case 'add':
                str = str.substring(0, change.index) + value + str.substring(change.index);
                break;
            case 'rm':
                str = str.substring(0, change.index) + str.substring(change.index + len);
                break;
        }
    });
    return str;
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
}
function debounce(func, waitMilliseconds, options = {
    isImmediate: false,
    isTrailing: false
}) {
    let timeoutId;
    return function (...args) {
        const context = this;
        const doLater = function () {
            timeoutId = undefined;
            if (!options.isImmediate || options.isTrailing) {
                func.apply(context, args);
            }
        };
        const shouldCallNow = options.isImmediate && timeoutId === undefined;
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(doLater, waitMilliseconds);
        if (shouldCallNow) {
            func.apply(context, args);
        }
    };
}
function createURL(url, base) {
    try {
        return new URL(url, base);
    }
    catch (e) {
        logError(e);
    }
    return { href: url, pathname: url };
}
function stateDebounce(stateHandle, delay, initState) {
    let preState = initState;
    let timer = 0;
    return (cb) => {
        stateHandle(delayExec);
        function delayExec(state) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = window.setTimeout(() => {
                if (preState === state) {
                    return;
                }
                cb(state);
                preState = state;
                clearTimeout(timer);
                timer = 0;
            }, typeof delay === 'number' ? delay : delay(state));
        }
    };
}
function logBadge(opts) {
    const { title, content, titleColor, backgroundColor } = opts;
    const tColor = titleColor || '#606060';
    const bColor = backgroundColor || '#1475b2';
    const args = [
        '%c '.concat(title, ' %c ').concat(content, ' '),
        'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: '.concat(tColor, ';'),
        'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: '.concat(bColor, ';')
    ];
    console.log.apply(void 0, args);
}
function logInfo() {
    logBadge({ title: name, content: version });
    logBadge({ title: 'homepage', content: homepage });
}
function removeGlobalVariables() {
    const keys = Object.keys(window);
    const targetKeys = keys.filter(key => {
        if (key) {
            if (key.startsWith('G_RECORD') || key.startsWith('G_REPLAY')) {
                return true;
            }
        }
    });
    targetKeys.forEach(key => {
        delete window[key];
    });
}
const tempEmptyFn = () => { };
const canvasContext2DAttrs = [
    'direction',
    'fillStyle',
    'filter',
    'font',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled',
    'imageSmoothingQuality',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'strokeStyle',
    'textAlign',
    'textBaseline'
];
const canvasContext2DMethods = [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    'createImageData',
    'createLinearGradient',
    'createPattern',
    'createRadialGradient',
    'drawFocusIfNeeded',
    'drawImage',
    'ellipse',
    'fill',
    'fillRect',
    'fillText',
    'getImageData',
    'getLineDash',
    'getTransform',
    'isPointInPath',
    'isPointInStroke',
    'lineTo',
    'measureText',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'resetTransform',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeRect',
    'strokeText',
    'transform',
    'translate'
];
const canvasContext2DKeys = [
    ...canvasContext2DAttrs,
    ...canvasContext2DMethods
];

const snapshot = () => window.G_REPLAY_DATA && window.G_REPLAY_DATA.snapshot.data;
const href = () => { var _a; return ((_a = snapshot()) === null || _a === void 0 ? void 0 : _a.href) || location.href; };
function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
function filteringScriptTag(str) {
    const reg = /<\/script>/g;
    return str.replace(reg, '<\\/script>');
}
function completeCssHref(str, baseUrl, setHref) {
    return str.replace(/(url\(['"]?((\/{1,2}|\.\.?\/)?.*?)(^\?.*?)?['"]?(?=\)))/g, (string, b, url) => {
        const newUrl = createURL(url, baseUrl || href());
        if (url.startsWith('data:')) {
            return string;
        }
        return string.replace(url, setHref ? setHref(newUrl.href) : newUrl.href);
    });
}
function completeAttrHref(str, node) {
    if (str.startsWith('data')) {
        return str;
    }
    if (node) {
        setTimeout(() => {
            const doc = node.getRootNode();
            const context = doc.defaultView;
            const { href, path } = (context === null || context === void 0 ? void 0 : context.G_REPLAY_LOCATION) || {};
            if (path && href) {
                const relationHref = createURL(path, href).href;
                const attrs = node.getAttributeNames();
                attrs
                    .filter(key => ~['src', 'href'].indexOf(key))
                    .forEach(key => {
                    const newHref = createURL(str, relationHref).href;
                    if (node.getAttribute(key) !== newHref) {
                        node.setAttribute(key, newHref);
                    }
                });
            }
        });
    }
    return createURL(str, href()).href;
}
function isHideComment(node) {
    if (!node) {
        return false;
    }
    return node.nodeType === Node.COMMENT_NODE && node.textContent === 'hidden';
}
function isExistingNode(node) {
    return node.ownerDocument && !!node.ownerDocument.contains(node);
}
function getRawScriptContent(src) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!src) {
            return false;
        }
        if (src.length > 500) {
            return false;
        }
        const fullSrc = completeAttrHref(src);
        if (isValidUrl(fullSrc)) {
            try {
                return yield getScript(fullSrc);
            }
            catch (err) {
                return false;
            }
        }
        return false;
    });
}
function isValidUrl(url) {
    try {
        new URL(url);
    }
    catch (_) {
        return false;
    }
    return true;
}
function getScript(src) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch(src).then((res) => __awaiter(this, void 0, void 0, function* () { return filteringScriptTag(yield res.text()); }), reason => {
            logError(reason);
            return src;
        });
    });
}

function encodePCM(bufferData, opts) {
    const { sampleBits } = opts;
    const isLittleEndian = true;
    const length = bufferData.length * (sampleBits / 8);
    const data = new DataView(new ArrayBuffer(length));
    let offset = 0;
    if (sampleBits === 8) {
        for (let i = 0; i < bufferData.length; i++, offset++) {
            const s = Math.max(-1, Math.min(1, bufferData[i]));
            let val = s < 0 ? s * 128 : s * 127;
            val = +val + 128;
            data.setInt8(offset, val);
        }
    }
    else {
        for (let i = 0; i < bufferData.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, bufferData[i]));
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, isLittleEndian);
        }
    }
    return data;
}
function encodeWAV(data, opts) {
    const dataView = encodeAudioData(data, opts);
    const blob = new Blob([dataView], {
        type: 'audio/wav'
    });
    return blob;
}
function encodeAudioData(data, opts) {
    const PMC = encodePCM(mergeArray(data), opts);
    return createWavFile(PMC, opts);
}
function mergeArray(list) {
    const length = list.length * list[0].length;
    const data = new Float32Array(length);
    let offset = 0;
    for (let i = 0; i < list.length; i++) {
        data.set(list[i], offset);
        offset += list[i].length;
    }
    return data;
}
function createWavFile(audioData, { channelCount, sampleBits, sampleRate }) {
    const WAV_HEAD_SIZE = 44;
    const buffer = new ArrayBuffer(WAV_HEAD_SIZE + audioData.byteLength);
    const isLittleEndian = true;
    const view = new DataView(buffer);
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioData.byteLength * 2, isLittleEndian);
    writeUTFBytes(view, 8, 'WAVE');
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, isLittleEndian);
    view.setUint16(20, 1, isLittleEndian);
    view.setUint16(22, channelCount, isLittleEndian);
    view.setUint32(24, sampleRate, isLittleEndian);
    view.setUint32(28, sampleRate * channelCount * (sampleBits / 8), isLittleEndian);
    view.setUint16(32, channelCount * (sampleBits / 8), isLittleEndian);
    view.setUint16(34, sampleBits, isLittleEndian);
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, audioData.byteLength, isLittleEndian);
    const length = audioData.byteLength;
    let offset = 44;
    for (let i = 0; i < length; i++) {
        view.setUint8(offset, audioData.getUint8(i));
        offset++;
    }
    return view;
}
function writeUTFBytes(view, offset, string) {
    const len = string.length;
    for (let i = 0; i < len; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
function base64ToFloat32Array(str) {
    return new Float32Array(base64ToBufferArray(str));
}
function bufferArrayToBase64(arrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
function base64ToBufferArray(str) {
    const blob = atob(str);
    const bLength = blob.length;
    const arrayBuffer = new ArrayBuffer(bLength);
    const dataView = new DataView(arrayBuffer);
    for (let i = 0; i < bLength; i++) {
        dataView.setUint8(i, blob.charCodeAt(i));
    }
    return arrayBuffer;
}
function uint8ArrayToAscii(array) {
    let outputStr = '';
    const carry = 1 << 8;
    for (let i = 0; i < array.length; i++) {
        let num = array[i];
        if (~[13, 34, 39, 44, 60, 62, 92, 96, 10, 0].indexOf(num)) {
            num += carry;
        }
        outputStr += String.fromCharCode(num);
    }
    return outputStr;
}
function asciiToUint8Array(str) {
    const carry = 1 << 8;
    const strArray = str.split('');
    const byteArray = new Uint8Array(strArray.length);
    for (let i = 0; i < strArray.length; i++) {
        const num = strArray[i].charCodeAt(0);
        byteArray[i] = num >= carry ? num - carry : num;
    }
    return byteArray;
}

class AnimationFrame {
    constructor(animate, fps = 60) {
        this.index = 0;
        this.fps = fps;
        this.animate = animate;
    }
    start() {
        let then = performance.now();
        const interval = 1000 / this.fps;
        const tolerance = 0.1;
        const animateLoop = (now) => {
            this.requestID = requestAnimationFrame(animateLoop);
            const delta = now - then;
            if (delta >= interval - tolerance) {
                then = now - (delta % interval);
                this.animate(delta, this.index++);
            }
        };
        this.requestID = requestAnimationFrame(animateLoop);
    }
    stop() {
        cancelAnimationFrame(this.requestID);
    }
}

const TimeCatModel = [
    ['type', 'type', { unique: false }],
    ['data', 'data', { unique: false }],
    ['relatedId', 'relatedId', { unique: false }],
    ['time', 'time', { unique: false }]
];

class Database {
    constructor(DBName, version, storeName) {
        this.DBName = DBName;
        this.version = version;
        this.storeName = storeName;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbResolve = this.initDB();
            this.db = yield this.dbResolve;
        });
    }
    initDB() {
        const request = window.indexedDB.open(this.DBName, this.version);
        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                const objectStore = db.createObjectStore(this.storeName, { autoIncrement: true, keyPath: 'id' });
                TimeCatModel.forEach(args => objectStore.createIndex(...args));
            }
        };
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                const msg = 'open indexedDB on error';
                logError(msg) && reject(msg);
            };
        });
    }
    getIDBObjectStore(type) {
        const transaction = this.db.transaction(this.storeName, type);
        transaction.onabort = transaction.onerror = () => {
            const err = transaction.error;
            logError(err);
        };
        return transaction.objectStore(this.storeName);
    }
}

var TaskTypes;
(function (TaskTypes) {
    TaskTypes[TaskTypes["ADD"] = 0] = "ADD";
    TaskTypes[TaskTypes["DELETE"] = 1] = "DELETE";
    TaskTypes[TaskTypes["CLEAR"] = 2] = "CLEAR";
})(TaskTypes || (TaskTypes = {}));
class IDB extends Database {
    constructor(DBName, version, storeName) {
        super(DBName, version, storeName);
        this.tasks = [];
        this.triggerTask = (() => {
            let timer = 0;
            return () => {
                if (this.db) {
                    let queue = Promise.resolve();
                    while (this.tasks.length) {
                        const task = this.tasks.shift();
                        queue = queue.then(() => this.execTask(task));
                    }
                }
                else {
                    clearInterval(timer);
                    timer = window.setTimeout(() => this.triggerTask(), 0);
                }
            };
        })();
    }
    add(data) {
        this.addTask(TaskTypes.ADD, data);
    }
    delete(options) {
        this.addTask(TaskTypes.DELETE, options);
    }
    clear() {
        this.addTask(TaskTypes.CLEAR);
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            const store = this.getIDBObjectStore(TransactionMode.READONLY);
            return new Promise(resolve => {
                store.count().onsuccess = event => {
                    const count = event.target.result;
                    resolve(count);
                };
            });
        });
    }
    last() {
        return __awaiter(this, void 0, void 0, function* () {
            const store = this.getIDBObjectStore(TransactionMode.READONLY);
            return new Promise((resolve, reject) => {
                const openCursorRequest = store.openKeyCursor(null, 'prev');
                openCursorRequest.onsuccess = () => {
                    const cursor = openCursorRequest.result;
                    if (!cursor) {
                        return reject('DB is empty');
                    }
                    const request = store.get(cursor.key);
                    request.onsuccess = () => {
                        resolve(request.result);
                    };
                };
            });
        });
    }
    readAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit } = options || {};
            yield this.dbResolve;
            const store = this.getIDBObjectStore(TransactionMode.READONLY);
            const records = [];
            return new Promise(resolve => {
                store.openCursor().onsuccess = event => {
                    const cursor = event.target.result;
                    if (limit && records.length >= limit) {
                        return resolve(records);
                    }
                    if (cursor) {
                        records.push(cursor.value);
                        cursor.continue();
                        return;
                    }
                    resolve(records);
                };
            }).then((arr) => (arr.length ? arr : null));
        });
    }
    execTask(task) {
        switch (task.type) {
            case TaskTypes.ADD:
                return this.execAddTask(task.data);
            case TaskTypes.DELETE:
                return this.execDeleteTask(task.data);
            case TaskTypes.CLEAR:
                return this.execClearTask();
            default:
                return Promise.resolve();
        }
    }
    addTask(type, data) {
        this.tasks.push({
            type,
            data
        });
        this.triggerTask();
    }
    execAddTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = this.getIDBObjectStore(TransactionMode.READWRITE);
            objectStore.add(data);
        });
    }
    execDeleteTask(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lowerBound, upperBound } = options || {};
            if (lowerBound && upperBound) {
                const keyRange = IDBKeyRange.bound(lowerBound, upperBound);
                const store = this.getIDBObjectStore(TransactionMode.READWRITE);
                store.delete(keyRange);
            }
            else {
                logError('Options lowerBound and upperBound is required');
            }
        });
    }
    execClearTask() {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = this.getIDBObjectStore(TransactionMode.READWRITE);
            objectStore.clear();
        });
    }
}

const idb = new IDB('cat_db', 1, 'cat_data');

class NodeStore {
    constructor() {
        this.createNodeId = () => NodeStore.nodeId++;
        this.init();
    }
    init() {
        this.nodeMap = new Map();
        this.idMap = new WeakMap();
    }
    reset() {
        this.nodeMap.clear();
    }
    getNode(id) {
        return this.nodeMap.get(id) || null;
    }
    addNode(node, id = this.createNodeId()) {
        this.idMap.set(node, id);
        this.nodeMap.set(id, node);
        return id;
    }
    removeNode(id) {
        this.nodeMap.delete(id);
        this.idMap.delete(this.getNode(id));
    }
    getNodeId(node) {
        return this.idMap.get(node);
    }
    updateNode(id, node) {
        this.idMap.set(node, id);
        this.nodeMap.set(id, node);
    }
}
NodeStore.nodeId = 1;
const nodeStore = new NodeStore();

var HTML = "<div class=\"player-container\">\n    <timecat-player></timecat-player>\n    <player-panel>\n        <player-broadcaster></player-broadcaster>\n        <player-keyboard></player-keyboard>\n        <player-progress></player-progress>\n        <player-toolbox></player-toolbox>\n    </player-panel>\n    <player-start-page></player-start-page>\n    <player-pointer></player-pointer>\n</div>\n";

var CSS = "/**\n * Copyright (c) oct16.\n * https://github.com/oct16\n * \n * This source code is licensed under the GPL-3.0 license found in the\n * LICENSE file in the root directory of this source tree.\n *\n */\nbody {\n  margin: 0;\n  background-color: #e2e2e2;\n  overflow: hidden; }\n\n.player-main {\n  box-shadow: 0px 0px 5px rgba(26, 26, 26, 0.05);\n  transition: all .5s;\n  -webkit-transition: all .5s;\n  opacity: 0;\n  position: relative;\n  overflow: visible; }\n\n.player-sandbox {\n  background: white;\n  vertical-align: top;\n  border: 0;\n  width: 100%;\n  height: 100%; }\n\n.timecat-player {\n  position: relative;\n  width: inherit;\n  height: inherit; }\n\n.player-pointer {\n  width: 10px;\n  height: 10px;\n  position: absolute;\n  transition: all .2s; }\n  .player-pointer img {\n    width: 15px;\n    position: absolute;\n    z-index: 100;\n    top: -5px;\n    left: -3px; }\n  .player-pointer[active] .spinner {\n    width: 32px;\n    height: 32px;\n    left: -17px;\n    top: -18px;\n    position: absolute;\n    background-color: #333;\n    border-radius: 100%;\n    -webkit-animation: spinner-scale .4s 1 ease-in-out;\n    animation: spinner-scale .4s 1 ease-in-out; }\n\n@-webkit-keyframes spinner-scale {\n  0% {\n    -webkit-transform: scale(0); }\n  100% {\n    -webkit-transform: scale(1);\n    opacity: 0.2; } }\n\n@keyframes spinner-scale {\n  0% {\n    -webkit-transform: scale(0);\n    transform: scale(0); }\n  100% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 0.2; } }\n\n.player-container {\n  background: grey; }\n\n.player-panel {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 5px 10px;\n  height: 40px;\n  position: absolute;\n  left: 0;\n  bottom: -41px;\n  background: black;\n  opacity: 0.8;\n  display: flex;\n  user-select: none; }\n\n.player-broadcaster {\n  position: absolute;\n  width: 100%;\n  left: 0;\n  bottom: 50px;\n  display: flex;\n  justify-content: center; }\n  .player-broadcaster .float-layer {\n    margin: 0 10px;\n    line-height: 20px;\n    color: #fff;\n    background-color: rgba(0, 0, 0, 0.6);\n    border-radius: 2px;\n    padding: 5px;\n    box-shadow: 0px 0px 2px rgba(26, 26, 26, 0.5);\n    text-align: center; }\n    .player-broadcaster .float-layer[hidden] {\n      display: none; }\n\n.player-keyboard {\n  white-space: nowrap; }\n  .player-keyboard button[disabled] {\n    cursor: default;\n    color: #999; }\n\n.player-export button,\n.player-keyboard button {\n  border: none;\n  background: none;\n  color: white;\n  outline: none;\n  cursor: pointer;\n  font-size: 14px;\n  padding: 0 5px; }\n  .player-export button.play-or-pause,\n  .player-keyboard button.play-or-pause {\n    padding: 0;\n    text-indent: 1px;\n    transform: rotate(90deg);\n    width: 18px; }\n\n.player-progress,\n.player-keyboard,\n.player-toolbox,\n.player-timer {\n  display: flex;\n  align-items: center; }\n\n.player-export {\n  display: flex; }\n  .player-export button {\n    padding: 2px 0 0 0;\n    padding-left: 2px; }\n\n.player-fullscreen {\n  margin-left: 8px;\n  cursor: pointer;\n  display: flex; }\n\n.player-progress {\n  width: 100%;\n  cursor: pointer; }\n  .player-progress .player-timer {\n    margin-left: 2px;\n    padding: 0 4px;\n    color: white;\n    font-size: 14px;\n    font-family: Helvetica; }\n\n.player-slider-bar {\n  position: relative;\n  width: calc(100% - 20px);\n  height: 23px;\n  margin: 7.5px 8px;\n  border-radius: 2.5px; }\n\n.player-heat-bar-container {\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  overflow: hidden;\n  background: black; }\n\n.player-heat-bar {\n  height: 16px;\n  width: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 2px 0px 0 0px;\n  background: black;\n  transform: rotateZ(180deg) rotateY(180deg); }\n\n.player-thumb {\n  width: 2px;\n  border: 1px solid white;\n  border-radius: 1px;\n  height: 95%;\n  background: #fff;\n  cursor: pointer;\n  position: absolute;\n  right: 0px;\n  top: 0;\n  z-index: 10;\n  transition: all .3s;\n  box-shadow: 0px 0px 5px black; }\n  .player-thumb[active] {\n    background: red;\n    border-color: red; }\n\n.player-current-progress {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 0;\n  height: 100%; }\n\n.player-start-page {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: calc(100% + 42px);\n  -webkit-backdrop-filter: blur(1.5px);\n  backdrop-filter: blur(1.5px);\n  transition: .5s all;\n  cursor: pointer; }\n  .player-start-page .play-btn {\n    position: absolute;\n    margin: auto;\n    left: 0;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    width: 100px;\n    height: 100px;\n    transition: all .5s;\n    transform: scale(0);\n    opacity: 0; }\n    .player-start-page .play-btn.show {\n      transform: scale(1);\n      opacity: 1; }\n";

var smoothscroll = {exports: {}};

/* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */

(function (module, exports) {
(function () {

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      while (el !== d.body && isScrollable(el) === false) {
        el = el.parentNode || el.host;
      }

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  {
    // commonjs
    module.exports = { polyfill: polyfill };
  }

}());
}(smoothscroll));

var smoothScroll = smoothscroll.exports;

class FMP {
    constructor() {
        this.interval = 1000;
        this.len = 0;
        this.resolved = false;
        this.listener = [];
        this.timer = null;
        this.observe();
    }
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    destroy() {
        this.listener.length = 0;
    }
    observe() {
        this.timer = window.setTimeout(() => {
            const entries = performance
                .getEntriesByType('resource')
                .filter((item) => this.isMatchType(item));
            const len = entries.length;
            if (len <= this.len) {
                performance.clearResourceTimings();
                this.clearTimer();
                this.resolved = true;
                if (this.listener.length) {
                    this.listener.forEach(run => run());
                }
                return;
            }
            this.len = len;
            this.observe();
        }, this.interval);
    }
    isMatchType(entry) {
        switch (entry.initiatorType) {
            case 'link':
            case 'img':
            case 'css':
            case 'iframe':
                return true;
        }
    }
    ready(fn) {
        if (this.resolved) {
            return fn();
        }
        this.listener.push(fn);
    }
}

class Observer {
    constructor() {
        this.id = 1;
        this.listenersMap = new Map();
    }
    on(key, fn) {
        const map = this.getListenersByKey(key);
        map.set(++this.id, fn);
        return this.id;
    }
    emit(key, ...args) {
        this.getListenersByKey(key).forEach(fn => {
            fn(...args);
        });
    }
    once(key, fn) {
        const onceFunc = (...args) => {
            fn(...args);
            this.off(key, id);
        };
        const id = this.on(key, onceFunc);
        return id;
    }
    flush(key) {
        this.getListenersByKey(key).clear();
    }
    destroy() {
        this.listenersMap.clear();
    }
    off(key, id) {
        const map = this.getListenersByKey(key);
        map.delete(id);
    }
    getListenersByKey(key) {
        const map = this.listenersMap.get(key) || new Map();
        this.listenersMap.set(key, map);
        return map;
    }
}
const observer = new Observer();

function t(t){let e=t.length;for(;--e>=0;)t[e]=0;}const e=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),a=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),i=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),n=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),s=new Array(576);t(s);const r=new Array(60);t(r);const o=new Array(512);t(o);const l=new Array(256);t(l);const h=new Array(29);t(h);const d=new Array(30);function _(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length;}let f,c,u;function p(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e;}t(d);const w=t=>t<256?o[t]:o[256+(t>>>7)],g=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255;},b=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,g(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a);},m=(t,e,a)=>{b(t,a[2*e],a[2*e+1]);},k=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1;}while(--e>0);return a>>>1},y=(t,e,a)=>{const i=new Array(16);let n,s,r=0;for(n=1;n<=15;n++)i[n]=r=r+a[n-1]<<1;for(s=0;s<=e;s++){let e=t[2*s+1];0!==e&&(t[2*s]=k(i[e]++,e));}},v=t=>{let e;for(e=0;e<286;e++)t.dyn_ltree[2*e]=0;for(e=0;e<30;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0;},x=t=>{t.bi_valid>8?g(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0;},z=(t,e,a,i)=>{const n=2*e,s=2*a;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[a]},A=(t,e,a)=>{const i=t.heap[a];let n=a<<1;for(;n<=t.heap_len&&(n<t.heap_len&&z(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!z(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i;},E=(t,i,n)=>{let s,r,o,_,f=0;if(0!==t.last_lit)do{s=t.pending_buf[t.d_buf+2*f]<<8|t.pending_buf[t.d_buf+2*f+1],r=t.pending_buf[t.l_buf+f],f++,0===s?m(t,r,i):(o=l[r],m(t,o+256+1,i),_=e[o],0!==_&&(r-=h[o],b(t,r,_)),s--,o=w(s),m(t,o,n),_=a[o],0!==_&&(s-=d[o],b(t,s,_)));}while(f<t.last_lit);m(t,256,i);},R=(t,e)=>{const a=e.dyn_tree,i=e.stat_desc.static_tree,n=e.stat_desc.has_stree,s=e.stat_desc.elems;let r,o,l,h=-1;for(t.heap_len=0,t.heap_max=573,r=0;r<s;r++)0!==a[2*r]?(t.heap[++t.heap_len]=h=r,t.depth[r]=0):a[2*r+1]=0;for(;t.heap_len<2;)l=t.heap[++t.heap_len]=h<2?++h:0,a[2*l]=1,t.depth[l]=0,t.opt_len--,n&&(t.static_len-=i[2*l+1]);for(e.max_code=h,r=t.heap_len>>1;r>=1;r--)A(t,a,r);l=s;do{r=t.heap[1],t.heap[1]=t.heap[t.heap_len--],A(t,a,1),o=t.heap[1],t.heap[--t.heap_max]=r,t.heap[--t.heap_max]=o,a[2*l]=a[2*r]+a[2*o],t.depth[l]=(t.depth[r]>=t.depth[o]?t.depth[r]:t.depth[o])+1,a[2*r+1]=a[2*o+1]=l,t.heap[1]=l++,A(t,a,1);}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,i=e.max_code,n=e.stat_desc.static_tree,s=e.stat_desc.has_stree,r=e.stat_desc.extra_bits,o=e.stat_desc.extra_base,l=e.stat_desc.max_length;let h,d,_,f,c,u,p=0;for(f=0;f<=15;f++)t.bl_count[f]=0;for(a[2*t.heap[t.heap_max]+1]=0,h=t.heap_max+1;h<573;h++)d=t.heap[h],f=a[2*a[2*d+1]+1]+1,f>l&&(f=l,p++),a[2*d+1]=f,d>i||(t.bl_count[f]++,c=0,d>=o&&(c=r[d-o]),u=a[2*d],t.opt_len+=u*(f+c),s&&(t.static_len+=u*(n[2*d+1]+c)));if(0!==p){do{for(f=l-1;0===t.bl_count[f];)f--;t.bl_count[f]--,t.bl_count[f+1]+=2,t.bl_count[l]--,p-=2;}while(p>0);for(f=l;0!==f;f--)for(d=t.bl_count[f];0!==d;)_=t.heap[--h],_>i||(a[2*_+1]!==f&&(t.opt_len+=(f-a[2*_+1])*a[2*_],a[2*_+1]=f),d--);}})(t,e),y(a,h,t.bl_count);},Z=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=r,r=e[2*(i+1)+1],++o<l&&n===r||(o<h?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[32]++):o<=10?t.bl_tree[34]++:t.bl_tree[36]++,o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4));},O=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),i=0;i<=a;i++)if(n=r,r=e[2*(i+1)+1],!(++o<l&&n===r)){if(o<h)do{m(t,n,t.bl_tree);}while(0!=--o);else 0!==n?(n!==s&&(m(t,n,t.bl_tree),o--),m(t,16,t.bl_tree),b(t,o-3,2)):o<=10?(m(t,17,t.bl_tree),b(t,o-3,3)):(m(t,18,t.bl_tree),b(t,o-11,7));o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4);}};let S=!1;const U=(t,e,a,i)=>{b(t,0+(i?1:0),3),((t,e,a,i)=>{x(t),i&&(g(t,a),g(t,~a)),t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a;})(t,e,a,!0);};var I={_tr_init:t=>{S||((()=>{let t,n,p,w,g;const b=new Array(16);for(p=0,w=0;w<28;w++)for(h[w]=p,t=0;t<1<<e[w];t++)l[p++]=w;for(l[p-1]=w,g=0,w=0;w<16;w++)for(d[w]=g,t=0;t<1<<a[w];t++)o[g++]=w;for(g>>=7;w<30;w++)for(d[w]=g<<7,t=0;t<1<<a[w]-7;t++)o[256+g++]=w;for(n=0;n<=15;n++)b[n]=0;for(t=0;t<=143;)s[2*t+1]=8,t++,b[8]++;for(;t<=255;)s[2*t+1]=9,t++,b[9]++;for(;t<=279;)s[2*t+1]=7,t++,b[7]++;for(;t<=287;)s[2*t+1]=8,t++,b[8]++;for(y(s,287,b),t=0;t<30;t++)r[2*t+1]=5,r[2*t]=k(t,5);f=new _(s,e,257,286,15),c=new _(r,a,0,30,15),u=new _(new Array(0),i,0,19,7);})(),S=!0),t.l_desc=new p(t.dyn_ltree,f),t.d_desc=new p(t.dyn_dtree,c),t.bl_desc=new p(t.bl_tree,u),t.bi_buf=0,t.bi_valid=0,v(t);},_tr_stored_block:U,_tr_flush_block:(t,e,a,i)=>{let o,l,h=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,a=4093624447;for(e=0;e<=31;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<256;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),R(t,t.l_desc),R(t,t.d_desc),h=(t=>{let e;for(Z(t,t.dyn_ltree,t.l_desc.max_code),Z(t,t.dyn_dtree,t.d_desc.max_code),R(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*n[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),o=t.opt_len+3+7>>>3,l=t.static_len+3+7>>>3,l<=o&&(o=l)):o=l=a+5,a+4<=o&&-1!==e?U(t,e,a,i):4===t.strategy||l===o?(b(t,2+(i?1:0),3),E(t,s,r)):(b(t,4+(i?1:0),3),((t,e,a,i)=>{let s;for(b(t,e-257,5),b(t,a-1,5),b(t,i-4,4),s=0;s<i;s++)b(t,t.bl_tree[2*n[s]+1],3);O(t,t.dyn_ltree,e-1),O(t,t.dyn_dtree,a-1);})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,h+1),E(t,t.dyn_ltree,t.dyn_dtree)),v(t),i&&x(t);},_tr_tally:(t,e,a)=>(t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(l[a]+256+1)]++,t.dyn_dtree[2*w(e)]++),t.last_lit===t.lit_bufsize-1),_tr_align:t=>{b(t,2,3),m(t,256,s),(t=>{16===t.bi_valid?(g(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8);})(t);}};var D=(t,e,a,i)=>{let n=65535&t|0,s=t>>>16&65535|0,r=0;for(;0!==a;){r=a>2e3?2e3:a,a-=r;do{n=n+e[i++]|0,s=s+n|0;}while(--r);n%=65521,s%=65521;}return n|s<<16|0};const M=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t;}return e})());var T=(t,e,a,i)=>{const n=M,s=i+a;t^=-1;for(let a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return -1^t},L={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},N={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:B,_tr_stored_block:C,_tr_flush_block:F,_tr_tally:j,_tr_align:H}=I,{Z_NO_FLUSH:K,Z_PARTIAL_FLUSH:P,Z_FULL_FLUSH:Y,Z_FINISH:G,Z_BLOCK:J,Z_OK:$,Z_STREAM_END:X,Z_STREAM_ERROR:W,Z_DATA_ERROR:q,Z_BUF_ERROR:Q,Z_DEFAULT_COMPRESSION:V,Z_FILTERED:tt,Z_HUFFMAN_ONLY:et,Z_RLE:at,Z_FIXED:it,Z_DEFAULT_STRATEGY:nt,Z_UNKNOWN:st,Z_DEFLATED:rt}=N,ot=(t,e)=>(t.msg=L[e],e),lt=t=>(t<<1)-(t>4?9:0),ht=t=>{let e=t.length;for(;--e>=0;)t[e]=0;};let dt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const _t=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0));},ft=(t,e)=>{F(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,_t(t.strm);},ct=(t,e)=>{t.pending_buf[t.pending++]=e;},ut=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e;},pt=(t,e,a,i)=>{let n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,e.set(t.input.subarray(t.next_in,t.next_in+n),a),1===t.state.wrap?t.adler=D(t.adler,e,n,a):2===t.state.wrap&&(t.adler=T(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)},wt=(t,e)=>{let a,i,n=t.max_chain_length,s=t.strstart,r=t.prev_length,o=t.nice_match;const l=t.strstart>t.w_size-262?t.strstart-(t.w_size-262):0,h=t.window,d=t.w_mask,_=t.prev,f=t.strstart+258;let c=h[s+r-1],u=h[s+r];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(a=e,h[a+r]===u&&h[a+r-1]===c&&h[a]===h[s]&&h[++a]===h[s+1]){s+=2,a++;do{}while(h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&s<f);if(i=258-(f-s),s=f-258,i>r){if(t.match_start=e,r=i,i>=o)break;c=h[s+r-1],u=h[s+r];}}}while((e=_[e&d])>l&&0!=--n);return r<=t.lookahead?r:t.lookahead},gt=t=>{const e=t.w_size;let a,i,n,s,r;do{if(s=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-262)){t.window.set(t.window.subarray(e,e+e),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,i=t.hash_size,a=i;do{n=t.head[--a],t.head[a]=n>=e?n-e:0;}while(--i);i=e,a=i;do{n=t.prev[--a],t.prev[a]=n>=e?n-e:0;}while(--i);s+=e;}if(0===t.strm.avail_in)break;if(i=pt(t.strm,t.window,t.strstart+t.lookahead,s),t.lookahead+=i,t.lookahead+t.insert>=3)for(r=t.strstart-t.insert,t.ins_h=t.window[r],t.ins_h=dt(t,t.ins_h,t.window[r+1]);t.insert&&(t.ins_h=dt(t,t.ins_h,t.window[r+3-1]),t.prev[r&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=r,r++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<262&&0!==t.strm.avail_in)},bt=(t,e)=>{let a,i;for(;;){if(t.lookahead<262){if(gt(t),t.lookahead<262&&e===K)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=dt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-262&&(t.match_length=wt(t,a)),t.match_length>=3)if(i=j(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=dt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;}while(0!=--t.match_length);t.strstart++;}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=dt(t,t.ins_h,t.window[t.strstart+1]);else i=j(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(ft(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===G?(ft(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(ft(t,!1),0===t.strm.avail_out)?1:2},mt=(t,e)=>{let a,i,n;for(;;){if(t.lookahead<262){if(gt(t),t.lookahead<262&&e===K)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=dt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-262&&(t.match_length=wt(t,a),t.match_length<=5&&(t.strategy===tt||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-3,i=j(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=n&&(t.ins_h=dt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,i&&(ft(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(i=j(t,0,t.window[t.strstart-1]),i&&ft(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--;}return t.match_available&&(i=j(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===G?(ft(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(ft(t,!1),0===t.strm.avail_out)?1:2};function kt(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n;}const yt=[new kt(0,0,0,0,((t,e)=>{let a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(gt(t),0===t.lookahead&&e===K)return 1;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;const i=t.block_start+a;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,ft(t,!1),0===t.strm.avail_out))return 1;if(t.strstart-t.block_start>=t.w_size-262&&(ft(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===G?(ft(t,!0),0===t.strm.avail_out?3:4):(t.strstart>t.block_start&&ft(t,!1),1)})),new kt(4,4,8,4,bt),new kt(4,5,16,8,bt),new kt(4,6,32,32,bt),new kt(4,4,16,16,mt),new kt(8,16,32,32,mt),new kt(8,16,128,128,mt),new kt(8,32,128,256,mt),new kt(32,128,258,1024,mt),new kt(32,258,258,4096,mt)];function vt(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=rt,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),ht(this.dyn_ltree),ht(this.dyn_dtree),ht(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),ht(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),ht(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0;}const xt=t=>{if(!t||!t.state)return ot(t,W);t.total_in=t.total_out=0,t.data_type=st;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?42:113,t.adler=2===e.wrap?0:1,e.last_flush=K,B(e),$},zt=t=>{const e=xt(t);var a;return e===$&&((a=t.state).window_size=2*a.w_size,ht(a.head),a.max_lazy_match=yt[a.level].max_lazy,a.good_match=yt[a.level].good_length,a.nice_match=yt[a.level].nice_length,a.max_chain_length=yt[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e},At=(t,e,a,i,n,s)=>{if(!t)return W;let r=1;if(e===V&&(e=6),i<0?(r=0,i=-i):i>15&&(r=2,i-=16),n<1||n>9||a!==rt||i<8||i>15||e<0||e>9||s<0||s>it)return ot(t,W);8===i&&(i=9);const o=new vt;return t.state=o,o.strm=t,o.wrap=r,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new Uint8Array(2*o.w_size),o.head=new Uint16Array(o.hash_size),o.prev=new Uint16Array(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new Uint8Array(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=e,o.strategy=s,o.method=a,zt(t)};var Et={deflateInit:(t,e)=>At(t,e,rt,15,8,nt),deflateInit2:At,deflateReset:zt,deflateResetKeep:xt,deflateSetHeader:(t,e)=>t&&t.state?2!==t.state.wrap?W:(t.state.gzhead=e,$):W,deflate:(t,e)=>{let a,i;if(!t||!t.state||e>J||e<0)return t?ot(t,W):W;const n=t.state;if(!t.output||!t.input&&0!==t.avail_in||666===n.status&&e!==G)return ot(t,0===t.avail_out?Q:W);n.strm=t;const s=n.last_flush;if(n.last_flush=e,42===n.status)if(2===n.wrap)t.adler=0,ct(n,31),ct(n,139),ct(n,8),n.gzhead?(ct(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),ct(n,255&n.gzhead.time),ct(n,n.gzhead.time>>8&255),ct(n,n.gzhead.time>>16&255),ct(n,n.gzhead.time>>24&255),ct(n,9===n.level?2:n.strategy>=et||n.level<2?4:0),ct(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(ct(n,255&n.gzhead.extra.length),ct(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(t.adler=T(t.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(ct(n,0),ct(n,0),ct(n,0),ct(n,0),ct(n,0),ct(n,9===n.level?2:n.strategy>=et||n.level<2?4:0),ct(n,3),n.status=113);else {let e=rt+(n.w_bits-8<<4)<<8,a=-1;a=n.strategy>=et||n.level<2?0:n.level<6?1:6===n.level?2:3,e|=a<<6,0!==n.strstart&&(e|=32),e+=31-e%31,n.status=113,ut(n,e),0!==n.strstart&&(ut(n,t.adler>>>16),ut(n,65535&t.adler)),t.adler=1;}if(69===n.status)if(n.gzhead.extra){for(a=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>a&&(t.adler=T(t.adler,n.pending_buf,n.pending-a,a)),_t(t),a=n.pending,n.pending!==n.pending_buf_size));)ct(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>a&&(t.adler=T(t.adler,n.pending_buf,n.pending-a,a)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73);}else n.status=73;if(73===n.status)if(n.gzhead.name){a=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>a&&(t.adler=T(t.adler,n.pending_buf,n.pending-a,a)),_t(t),a=n.pending,n.pending===n.pending_buf_size)){i=1;break}i=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,ct(n,i);}while(0!==i);n.gzhead.hcrc&&n.pending>a&&(t.adler=T(t.adler,n.pending_buf,n.pending-a,a)),0===i&&(n.gzindex=0,n.status=91);}else n.status=91;if(91===n.status)if(n.gzhead.comment){a=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>a&&(t.adler=T(t.adler,n.pending_buf,n.pending-a,a)),_t(t),a=n.pending,n.pending===n.pending_buf_size)){i=1;break}i=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,ct(n,i);}while(0!==i);n.gzhead.hcrc&&n.pending>a&&(t.adler=T(t.adler,n.pending_buf,n.pending-a,a)),0===i&&(n.status=103);}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&_t(t),n.pending+2<=n.pending_buf_size&&(ct(n,255&t.adler),ct(n,t.adler>>8&255),t.adler=0,n.status=113)):n.status=113),0!==n.pending){if(_t(t),0===t.avail_out)return n.last_flush=-1,$}else if(0===t.avail_in&&lt(e)<=lt(s)&&e!==G)return ot(t,Q);if(666===n.status&&0!==t.avail_in)return ot(t,Q);if(0!==t.avail_in||0!==n.lookahead||e!==K&&666!==n.status){let a=n.strategy===et?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(gt(t),0===t.lookahead)){if(e===K)return 1;break}if(t.match_length=0,a=j(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(ft(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===G?(ft(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(ft(t,!1),0===t.strm.avail_out)?1:2})(n,e):n.strategy===at?((t,e)=>{let a,i,n,s;const r=t.window;for(;;){if(t.lookahead<=258){if(gt(t),t.lookahead<=258&&e===K)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=t.strstart-1,i=r[n],i===r[++n]&&i===r[++n]&&i===r[++n])){s=t.strstart+258;do{}while(i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&n<s);t.match_length=258-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead);}if(t.match_length>=3?(a=j(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=j(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(ft(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===G?(ft(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(ft(t,!1),0===t.strm.avail_out)?1:2})(n,e):yt[n.level].func(n,e);if(3!==a&&4!==a||(n.status=666),1===a||3===a)return 0===t.avail_out&&(n.last_flush=-1),$;if(2===a&&(e===P?H(n):e!==J&&(C(n,0,0,!1),e===Y&&(ht(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),_t(t),0===t.avail_out))return n.last_flush=-1,$}return e!==G?$:n.wrap<=0?X:(2===n.wrap?(ct(n,255&t.adler),ct(n,t.adler>>8&255),ct(n,t.adler>>16&255),ct(n,t.adler>>24&255),ct(n,255&t.total_in),ct(n,t.total_in>>8&255),ct(n,t.total_in>>16&255),ct(n,t.total_in>>24&255)):(ut(n,t.adler>>>16),ut(n,65535&t.adler)),_t(t),n.wrap>0&&(n.wrap=-n.wrap),0!==n.pending?$:X)},deflateEnd:t=>{if(!t||!t.state)return W;const e=t.state.status;return 42!==e&&69!==e&&73!==e&&91!==e&&103!==e&&113!==e&&666!==e?ot(t,W):(t.state=null,113===e?ot(t,q):$)},deflateSetDictionary:(t,e)=>{let a=e.length;if(!t||!t.state)return W;const i=t.state,n=i.wrap;if(2===n||1===n&&42!==i.status||i.lookahead)return W;if(1===n&&(t.adler=D(t.adler,e,a,0)),i.wrap=0,a>=i.w_size){0===n&&(ht(i.head),i.strstart=0,i.block_start=0,i.insert=0);let t=new Uint8Array(i.w_size);t.set(e.subarray(a-i.w_size,a),0),e=t,a=i.w_size;}const s=t.avail_in,r=t.next_in,o=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,gt(i);i.lookahead>=3;){let t=i.strstart,e=i.lookahead-2;do{i.ins_h=dt(i,i.ins_h,i.window[t+3-1]),i.prev[t&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=t,t++;}while(--e);i.strstart=t,i.lookahead=2,gt(i);}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=2,i.match_available=0,t.next_in=r,t.input=o,t.avail_in=s,i.wrap=n,$},deflateInfo:"pako deflate (from Nodeca project)"};const Rt=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var Zt=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(const e in a)Rt(a,e)&&(t[e]=a[e]);}}return t},Ot=t=>{let e=0;for(let a=0,i=t.length;a<i;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,i=0,n=t.length;e<n;e++){let n=t[e];a.set(n,i),i+=n.length;}return a};let St=!0;try{String.fromCharCode.apply(null,new Uint8Array(1));}catch(t){St=!1;}const Ut=new Uint8Array(256);for(let t=0;t<256;t++)Ut[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Ut[254]=Ut[254]=1;var It=t=>{let e,a,i,n,s,r=t.length,o=0;for(n=0;n<r;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),o+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(o),s=0,n=0;s<o;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),a<128?e[s++]=a:a<2048?(e[s++]=192|a>>>6,e[s++]=128|63&a):a<65536?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},Dt=(t,e)=>{let a,i;const n=e||t.length,s=new Array(2*n);for(i=0,a=0;a<n;){let e=t[a++];if(e<128){s[i++]=e;continue}let r=Ut[e];if(r>4)s[i++]=65533,a+=r-1;else {for(e&=2===r?31:3===r?15:7;r>1&&a<n;)e=e<<6|63&t[a++],r--;r>1?s[i++]=65533:e<65536?s[i++]=e:(e-=65536,s[i++]=55296|e>>10&1023,s[i++]=56320|1023&e);}}return ((t,e)=>{if(e<65534&&t.subarray&&St)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));let a="";for(let i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a})(s,i)},Mt=(t,e)=>{(e=e||t.length)>t.length&&(e=t.length);let a=e-1;for(;a>=0&&128==(192&t[a]);)a--;return a<0||0===a?e:a+Ut[t[a]]>e?a:e};var Tt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0;};const Lt=Object.prototype.toString,{Z_NO_FLUSH:Nt,Z_SYNC_FLUSH:Bt,Z_FULL_FLUSH:Ct,Z_FINISH:Ft,Z_OK:jt,Z_STREAM_END:Ht,Z_DEFAULT_COMPRESSION:Kt,Z_DEFAULT_STRATEGY:Pt,Z_DEFLATED:Yt}=N;function Gt(t){this.options=Zt({level:Kt,method:Yt,chunkSize:16384,windowBits:15,memLevel:8,strategy:Pt},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new Tt,this.strm.avail_out=0;let a=Et.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==jt)throw new Error(L[a]);if(e.header&&Et.deflateSetHeader(this.strm,e.header),e.dictionary){let t;if(t="string"==typeof e.dictionary?It(e.dictionary):"[object ArrayBuffer]"===Lt.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=Et.deflateSetDictionary(this.strm,t),a!==jt)throw new Error(L[a]);this._dict_set=!0;}}function Jt(t,e){const a=new Gt(e);if(a.push(t,!0),a.err)throw a.msg||L[a.err];return a.result}Gt.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize;let n,s;if(this.ended)return !1;for(s=e===~~e?e:!0===e?Ft:Nt,a.input="string"==typeof t?It(t):"[object ArrayBuffer]"===Lt.call(t)?new Uint8Array(t):t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),(s===Bt||s===Ct)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else {if(n=Et.deflate(a,s),n===Ht)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),n=Et.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===jt;if(0!==a.avail_out){if(s>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output);}return !0},Gt.prototype.onData=function(t){this.chunks.push(t);},Gt.prototype.onEnd=function(t){t===jt&&(this.result=Ot(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg;};var $t={Deflate:Gt,deflate:Jt,deflateRaw:function(t,e){return (e=e||{}).raw=!0,Jt(t,e)},gzip:function(t,e){return (e=e||{}).gzip=!0,Jt(t,e)},constants:N};var Xt=function(t,e){let a,i,n,s,r,o,l,h,d,_,f,c,u,p,w,g,b,m,k,y,v,x,z,A;const E=t.state;a=t.next_in,z=t.input,i=a+(t.avail_in-5),n=t.next_out,A=t.output,s=n-(e-t.avail_out),r=n+(t.avail_out-257),o=E.dmax,l=E.wsize,h=E.whave,d=E.wnext,_=E.window,f=E.hold,c=E.bits,u=E.lencode,p=E.distcode,w=(1<<E.lenbits)-1,g=(1<<E.distbits)-1;t:do{c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),b=u[f&w];e:for(;;){if(m=b>>>24,f>>>=m,c-=m,m=b>>>16&255,0===m)A[n++]=65535&b;else {if(!(16&m)){if(0==(64&m)){b=u[(65535&b)+(f&(1<<m)-1)];continue e}if(32&m){E.mode=12;break t}t.msg="invalid literal/length code",E.mode=30;break t}k=65535&b,m&=15,m&&(c<m&&(f+=z[a++]<<c,c+=8),k+=f&(1<<m)-1,f>>>=m,c-=m),c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),b=p[f&g];a:for(;;){if(m=b>>>24,f>>>=m,c-=m,m=b>>>16&255,!(16&m)){if(0==(64&m)){b=p[(65535&b)+(f&(1<<m)-1)];continue a}t.msg="invalid distance code",E.mode=30;break t}if(y=65535&b,m&=15,c<m&&(f+=z[a++]<<c,c+=8,c<m&&(f+=z[a++]<<c,c+=8)),y+=f&(1<<m)-1,y>o){t.msg="invalid distance too far back",E.mode=30;break t}if(f>>>=m,c-=m,m=n-s,y>m){if(m=y-m,m>h&&E.sane){t.msg="invalid distance too far back",E.mode=30;break t}if(v=0,x=_,0===d){if(v+=l-m,m<k){k-=m;do{A[n++]=_[v++];}while(--m);v=n-y,x=A;}}else if(d<m){if(v+=l+d-m,m-=d,m<k){k-=m;do{A[n++]=_[v++];}while(--m);if(v=0,d<k){m=d,k-=m;do{A[n++]=_[v++];}while(--m);v=n-y,x=A;}}}else if(v+=d-m,m<k){k-=m;do{A[n++]=_[v++];}while(--m);v=n-y,x=A;}for(;k>2;)A[n++]=x[v++],A[n++]=x[v++],A[n++]=x[v++],k-=3;k&&(A[n++]=x[v++],k>1&&(A[n++]=x[v++]));}else {v=n-y;do{A[n++]=A[v++],A[n++]=A[v++],A[n++]=A[v++],k-=3;}while(k>2);k&&(A[n++]=A[v++],k>1&&(A[n++]=A[v++]));}break}}break}}while(a<i&&n<r);k=c>>3,a-=k,c-=k<<3,f&=(1<<c)-1,t.next_in=a,t.next_out=n,t.avail_in=a<i?i-a+5:5-(a-i),t.avail_out=n<r?r-n+257:257-(n-r),E.hold=f,E.bits=c;};const Wt=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),qt=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),Qt=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),Vt=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]);var te=(t,e,a,i,n,s,r,o)=>{const l=o.bits;let h,d,_,f,c,u,p=0,w=0,g=0,b=0,m=0,k=0,y=0,v=0,x=0,z=0,A=null,E=0;const R=new Uint16Array(16),Z=new Uint16Array(16);let O,S,U,I=null,D=0;for(p=0;p<=15;p++)R[p]=0;for(w=0;w<i;w++)R[e[a+w]]++;for(m=l,b=15;b>=1&&0===R[b];b--);if(m>b&&(m=b),0===b)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(g=1;g<b&&0===R[g];g++);for(m<g&&(m=g),v=1,p=1;p<=15;p++)if(v<<=1,v-=R[p],v<0)return -1;if(v>0&&(0===t||1!==b))return -1;for(Z[1]=0,p=1;p<15;p++)Z[p+1]=Z[p]+R[p];for(w=0;w<i;w++)0!==e[a+w]&&(r[Z[e[a+w]]++]=w);if(0===t?(A=I=r,u=19):1===t?(A=Wt,E-=257,I=qt,D-=257,u=256):(A=Qt,I=Vt,u=-1),z=0,w=0,p=g,c=s,k=m,y=0,_=-1,x=1<<m,f=x-1,1===t&&x>852||2===t&&x>592)return 1;for(;;){O=p-y,r[w]<u?(S=0,U=r[w]):r[w]>u?(S=I[D+r[w]],U=A[E+r[w]]):(S=96,U=0),h=1<<p-y,d=1<<k,g=d;do{d-=h,n[c+(z>>y)+d]=O<<24|S<<16|U|0;}while(0!==d);for(h=1<<p-1;z&h;)h>>=1;if(0!==h?(z&=h-1,z+=h):z=0,w++,0==--R[p]){if(p===b)break;p=e[a+r[w]];}if(p>m&&(z&f)!==_){for(0===y&&(y=m),c+=g,k=p-y,v=1<<k;k+y<b&&(v-=R[k+y],!(v<=0));)k++,v<<=1;if(x+=1<<k,1===t&&x>852||2===t&&x>592)return 1;_=z&f,n[_]=m<<24|k<<16|c-s|0;}}return 0!==z&&(n[c+z]=p-y<<24|64<<16|0),o.bits=m,0};const{Z_FINISH:ee,Z_BLOCK:ae,Z_TREES:ie,Z_OK:ne,Z_STREAM_END:se,Z_NEED_DICT:re,Z_STREAM_ERROR:oe,Z_DATA_ERROR:le,Z_MEM_ERROR:he,Z_BUF_ERROR:de,Z_DEFLATED:_e}=N,fe=t=>(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24);function ce(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0;}const ue=t=>{if(!t||!t.state)return oe;const e=t.state;return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=1,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Int32Array(852),e.distcode=e.distdyn=new Int32Array(592),e.sane=1,e.back=-1,ne},pe=t=>{if(!t||!t.state)return oe;const e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,ue(t)},we=(t,e)=>{let a;if(!t||!t.state)return oe;const i=t.state;return e<0?(a=0,e=-e):(a=1+(e>>4),e<48&&(e&=15)),e&&(e<8||e>15)?oe:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,pe(t))},ge=(t,e)=>{if(!t)return oe;const a=new ce;t.state=a,a.window=null;const i=we(t,e);return i!==ne&&(t.state=null),i};let be,me,ke=!0;const ye=t=>{if(ke){be=new Int32Array(512),me=new Int32Array(32);let e=0;for(;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(te(1,t.lens,0,288,be,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;te(2,t.lens,0,32,me,0,t.work,{bits:5}),ke=!1;}t.lencode=be,t.lenbits=9,t.distcode=me,t.distbits=5;},ve=(t,e,a,i)=>{let n;const s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new Uint8Array(s.wsize)),i>=s.wsize?(s.window.set(e.subarray(a-s.wsize,a),0),s.wnext=0,s.whave=s.wsize):(n=s.wsize-s.wnext,n>i&&(n=i),s.window.set(e.subarray(a-i,a-i+n),s.wnext),(i-=n)?(s.window.set(e.subarray(a-i,a),0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0};var xe={inflateReset:pe,inflateReset2:we,inflateResetKeep:ue,inflateInit:t=>ge(t,15),inflateInit2:ge,inflate:(t,e)=>{let a,i,n,s,r,o,l,h,d,_,f,c,u,p,w,g,b,m,k,y,v,x,z=0;const A=new Uint8Array(4);let E,R;const Z=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return oe;a=t.state,12===a.mode&&(a.mode=13),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,_=o,f=l,x=ne;t:for(;;)switch(a.mode){case 1:if(0===a.wrap){a.mode=13;break}for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(2&a.wrap&&35615===h){a.check=0,A[0]=255&h,A[1]=h>>>8&255,a.check=T(a.check,A,2,0),h=0,d=0,a.mode=2;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=30;break}if((15&h)!==_e){t.msg="unknown compression method",a.mode=30;break}if(h>>>=4,d-=4,v=8+(15&h),0===a.wbits)a.wbits=v;else if(v>a.wbits){t.msg="invalid window size",a.mode=30;break}a.dmax=1<<a.wbits,t.adler=a.check=1,a.mode=512&h?10:12,h=0,d=0;break;case 2:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(a.flags=h,(255&a.flags)!==_e){t.msg="unknown compression method",a.mode=30;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=30;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,a.check=T(a.check,A,2,0)),h=0,d=0,a.mode=3;case 3:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}a.head&&(a.head.time=h),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,A[2]=h>>>16&255,A[3]=h>>>24&255,a.check=T(a.check,A,4,0)),h=0,d=0,a.mode=4;case 4:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,a.check=T(a.check,A,2,0)),h=0,d=0,a.mode=5;case 5:if(1024&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,a.check=T(a.check,A,2,0)),h=0,d=0;}else a.head&&(a.head.extra=null);a.mode=6;case 6:if(1024&a.flags&&(c=a.length,c>o&&(c=o),c&&(a.head&&(v=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Uint8Array(a.head.extra_len)),a.head.extra.set(i.subarray(s,s+c),v)),512&a.flags&&(a.check=T(a.check,i,c,s)),o-=c,s+=c,a.length-=c),a.length))break t;a.length=0,a.mode=7;case 7:if(2048&a.flags){if(0===o)break t;c=0;do{v=i[s+c++],a.head&&v&&a.length<65536&&(a.head.name+=String.fromCharCode(v));}while(v&&c<o);if(512&a.flags&&(a.check=T(a.check,i,c,s)),o-=c,s+=c,v)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=8;case 8:if(4096&a.flags){if(0===o)break t;c=0;do{v=i[s+c++],a.head&&v&&a.length<65536&&(a.head.comment+=String.fromCharCode(v));}while(v&&c<o);if(512&a.flags&&(a.check=T(a.check,i,c,s)),o-=c,s+=c,v)break t}else a.head&&(a.head.comment=null);a.mode=9;case 9:if(512&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=30;break}h=0,d=0;}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=12;break;case 10:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}t.adler=a.check=fe(h),h=0,d=0,a.mode=11;case 11:if(0===a.havedict)return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,re;t.adler=a.check=1,a.mode=12;case 12:if(e===ae||e===ie)break t;case 13:if(a.last){h>>>=7&d,d-=7&d,a.mode=27;break}for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}switch(a.last=1&h,h>>>=1,d-=1,3&h){case 0:a.mode=14;break;case 1:if(ye(a),a.mode=20,e===ie){h>>>=2,d-=2;break t}break;case 2:a.mode=17;break;case 3:t.msg="invalid block type",a.mode=30;}h>>>=2,d-=2;break;case 14:for(h>>>=7&d,d-=7&d;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=30;break}if(a.length=65535&h,h=0,d=0,a.mode=15,e===ie)break t;case 15:a.mode=16;case 16:if(c=a.length,c){if(c>o&&(c=o),c>l&&(c=l),0===c)break t;n.set(i.subarray(s,s+c),r),o-=c,s+=c,l-=c,r+=c,a.length-=c;break}a.mode=12;break;case 17:for(;d<14;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=30;break}a.have=0,a.mode=18;case 18:for(;a.have<a.ncode;){for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}a.lens[Z[a.have++]]=7&h,h>>>=3,d-=3;}for(;a.have<19;)a.lens[Z[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,E={bits:a.lenbits},x=te(0,a.lens,0,19,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid code lengths set",a.mode=30;break}a.have=0,a.mode=19;case 19:for(;a.have<a.nlen+a.ndist;){for(;z=a.lencode[h&(1<<a.lenbits)-1],w=z>>>24,g=z>>>16&255,b=65535&z,!(w<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(b<16)h>>>=w,d-=w,a.lens[a.have++]=b;else {if(16===b){for(R=w+2;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(h>>>=w,d-=w,0===a.have){t.msg="invalid bit length repeat",a.mode=30;break}v=a.lens[a.have-1],c=3+(3&h),h>>>=2,d-=2;}else if(17===b){for(R=w+3;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}h>>>=w,d-=w,v=0,c=3+(7&h),h>>>=3,d-=3;}else {for(R=w+7;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}h>>>=w,d-=w,v=0,c=11+(127&h),h>>>=7,d-=7;}if(a.have+c>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=30;break}for(;c--;)a.lens[a.have++]=v;}}if(30===a.mode)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=30;break}if(a.lenbits=9,E={bits:a.lenbits},x=te(1,a.lens,0,a.nlen,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid literal/lengths set",a.mode=30;break}if(a.distbits=6,a.distcode=a.distdyn,E={bits:a.distbits},x=te(2,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,E),a.distbits=E.bits,x){t.msg="invalid distances set",a.mode=30;break}if(a.mode=20,e===ie)break t;case 20:a.mode=21;case 21:if(o>=6&&l>=258){t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,Xt(t,f),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,12===a.mode&&(a.back=-1);break}for(a.back=0;z=a.lencode[h&(1<<a.lenbits)-1],w=z>>>24,g=z>>>16&255,b=65535&z,!(w<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(g&&0==(240&g)){for(m=w,k=g,y=b;z=a.lencode[y+((h&(1<<m+k)-1)>>m)],w=z>>>24,g=z>>>16&255,b=65535&z,!(m+w<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}h>>>=m,d-=m,a.back+=m;}if(h>>>=w,d-=w,a.back+=w,a.length=b,0===g){a.mode=26;break}if(32&g){a.back=-1,a.mode=12;break}if(64&g){t.msg="invalid literal/length code",a.mode=30;break}a.extra=15&g,a.mode=22;case 22:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra;}a.was=a.length,a.mode=23;case 23:for(;z=a.distcode[h&(1<<a.distbits)-1],w=z>>>24,g=z>>>16&255,b=65535&z,!(w<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(0==(240&g)){for(m=w,k=g,y=b;z=a.distcode[y+((h&(1<<m+k)-1)>>m)],w=z>>>24,g=z>>>16&255,b=65535&z,!(m+w<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}h>>>=m,d-=m,a.back+=m;}if(h>>>=w,d-=w,a.back+=w,64&g){t.msg="invalid distance code",a.mode=30;break}a.offset=b,a.extra=15&g,a.mode=24;case 24:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra;}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=30;break}a.mode=25;case 25:if(0===l)break t;if(c=f-l,a.offset>c){if(c=a.offset-c,c>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=30;break}c>a.wnext?(c-=a.wnext,u=a.wsize-c):u=a.wnext-c,c>a.length&&(c=a.length),p=a.window;}else p=n,u=r-a.offset,c=a.length;c>l&&(c=l),l-=c,a.length-=c;do{n[r++]=p[u++];}while(--c);0===a.length&&(a.mode=21);break;case 26:if(0===l)break t;n[r++]=a.length,l--,a.mode=21;break;case 27:if(a.wrap){for(;d<32;){if(0===o)break t;o--,h|=i[s++]<<d,d+=8;}if(f-=l,t.total_out+=f,a.total+=f,f&&(t.adler=a.check=a.flags?T(a.check,n,f,r-f):D(a.check,n,f,r-f)),f=l,(a.flags?h:fe(h))!==a.check){t.msg="incorrect data check",a.mode=30;break}h=0,d=0;}a.mode=28;case 28:if(a.wrap&&a.flags){for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8;}if(h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=30;break}h=0,d=0;}a.mode=29;case 29:x=se;break t;case 30:x=le;break t;case 31:return he;case 32:default:return oe}return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,(a.wsize||f!==t.avail_out&&a.mode<30&&(a.mode<27||e!==ee))&&ve(t,t.output,t.next_out,f-t.avail_out),_-=t.avail_in,f-=t.avail_out,t.total_in+=_,t.total_out+=f,a.total+=f,a.wrap&&f&&(t.adler=a.check=a.flags?T(a.check,n,f,t.next_out-f):D(a.check,n,f,t.next_out-f)),t.data_type=a.bits+(a.last?64:0)+(12===a.mode?128:0)+(20===a.mode||15===a.mode?256:0),(0===_&&0===f||e===ee)&&x===ne&&(x=de),x},inflateEnd:t=>{if(!t||!t.state)return oe;let e=t.state;return e.window&&(e.window=null),t.state=null,ne},inflateGetHeader:(t,e)=>{if(!t||!t.state)return oe;const a=t.state;return 0==(2&a.wrap)?oe:(a.head=e,e.done=!1,ne)},inflateSetDictionary:(t,e)=>{const a=e.length;let i,n,s;return t&&t.state?(i=t.state,0!==i.wrap&&11!==i.mode?oe:11===i.mode&&(n=1,n=D(n,e,a,0),n!==i.check)?le:(s=ve(t,e,a,a),s?(i.mode=31,he):(i.havedict=1,ne))):oe},inflateInfo:"pako inflate (from Nodeca project)"};var ze=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1;};const Ae=Object.prototype.toString,{Z_NO_FLUSH:Ee,Z_FINISH:Re,Z_OK:Ze,Z_STREAM_END:Oe,Z_NEED_DICT:Se,Z_STREAM_ERROR:Ue,Z_DATA_ERROR:Ie,Z_MEM_ERROR:De}=N;function Me(t){this.options=Zt({chunkSize:65536,windowBits:15,to:""},t||{});const e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new Tt,this.strm.avail_out=0;let a=xe.inflateInit2(this.strm,e.windowBits);if(a!==Ze)throw new Error(L[a]);if(this.header=new ze,xe.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=It(e.dictionary):"[object ArrayBuffer]"===Ae.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=xe.inflateSetDictionary(this.strm,e.dictionary),a!==Ze)))throw new Error(L[a])}function Te(t,e){const a=new Me(e);if(a.push(t),a.err)throw a.msg||L[a.err];return a.result}Me.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize,n=this.options.dictionary;let s,r,o;if(this.ended)return !1;for(r=e===~~e?e:!0===e?Re:Ee,a.input="[object ArrayBuffer]"===Ae.call(t)?new Uint8Array(t):t,a.next_in=0,a.avail_in=a.input.length;;){for(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),s=xe.inflate(a,r),s===Se&&n&&(s=xe.inflateSetDictionary(a,n),s===Ze?s=xe.inflate(a,r):s===Ie&&(s=Se));a.avail_in>0&&s===Oe&&a.state.wrap>0&&0!==t[a.next_in];)xe.inflateReset(a),s=xe.inflate(a,r);switch(s){case Ue:case Ie:case Se:case De:return this.onEnd(s),this.ended=!0,!1}if(o=a.avail_out,a.next_out&&(0===a.avail_out||s===Oe))if("string"===this.options.to){let t=Mt(a.output,a.next_out),e=a.next_out-t,n=Dt(a.output,t);a.next_out=e,a.avail_out=i-e,e&&a.output.set(a.output.subarray(t,t+e),0),this.onData(n);}else this.onData(a.output.length===a.next_out?a.output:a.output.subarray(0,a.next_out));if(s!==Ze||0!==o){if(s===Oe)return s=xe.inflateEnd(this.strm),this.onEnd(s),this.ended=!0,!0;if(0===a.avail_in)break}}return !0},Me.prototype.onData=function(t){this.chunks.push(t);},Me.prototype.onEnd=function(t){t===Ze&&(this.result="string"===this.options.to?this.chunks.join(""):Ot(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg;};var Le={Inflate:Me,inflate:Te,inflateRaw:function(t,e){return (e=e||{}).raw=!0,Te(t,e)},ungzip:Te,constants:N};const{Deflate:Ne,deflate:Be,deflateRaw:Ce,gzip:Fe}=$t,{Inflate:je,inflate:He,inflateRaw:Ke,ungzip:Pe}=Le;var Ye={Deflate:Ne,deflate:Be,deflateRaw:Ce,gzip:Fe,Inflate:je,inflate:He,inflateRaw:Ke,ungzip:Pe,constants:N};class Ge{constructor(t){this.defaultOptions={ai:"$",si:","},this.keysMap=new Map,this.indexMap=new Map;let e=0,a=1;this.options=this.defaultOptions,"Object"===Object.prototype.toString.call(t[0]).slice(8,14)&&(this.options={...this.defaultOptions,...t[0]},e++,a++);this.result=this.convert2Json(t[e],t[a]);}convert2Json(t,e){if(!(t&&Array.isArray(t)&&e&&Array.isArray(e)))throw new Error("Params is not valid");const a=t.slice();for(t.forEach(((t,e)=>{a[e].i=e;const i=t.join(this.options.si);this.keysMap.set(i,e),this.indexMap.set(e,i);}));a.length;){const t=a.shift(),e=t.i,i=t.join(this.options.si);for(const[e,a]of t.entries())if("number"==typeof a){const i=this.indexMap.get(a);t[e]=i.split(this.options.si);}const n=t.flat().join(this.options.si);i!==n&&(this.keysMap.delete(i),this.keysMap.set(n,e),this.indexMap.set(e,n));}return this.convertObj(e)}convertObj(t){if(Array.isArray(t)){if(t[0]===this.options.ai){const e=t.slice(1);return this.convertArray(e)}if(!t.length)return {};const e=this.indexMap.get(t[0]),a={},i=e.split(this.options.si),n=t.slice(1);return i.forEach(((t,e)=>{const i=n[e];a[t]=Array.isArray(i)?this.convertObj(i):i;})),a}return t}convertArray(t){const e=[];return t.forEach((t=>{e.push(this.convertObj(t));})),e}}class Je{constructor(t,e){if(this.defaultOptions={arrayIdentifier:"$",separatorIdentifier:","},this.keys=[],this.values=[],this.keyMap=new Map,this.indexMap=new Map,this.getLastKeyInMap=()=>{const t=this.keyMap;return Array.from(t)[t.size-1][0]},"object"!=typeof t||null===t)throw new Error("The params json is not a object");const{arrayIdentifier:a,separatorIdentifier:i}=e||{};this.json=t,this.arrayIdentifier=a||this.defaultOptions.arrayIdentifier,this.separatorIdentifier=i||this.defaultOptions.separatorIdentifier,this.result=this.getResult();}getResult(){const t=this.json;this.values=Array.isArray(t)?[...this.deepConvertArray(t)]:this.deepConvertObj(t);const e={ai:this.arrayIdentifier===this.defaultOptions.arrayIdentifier?void 0:this.arrayIdentifier,si:this.separatorIdentifier===this.defaultOptions.separatorIdentifier?void 0:this.separatorIdentifier};return Object.keys(e).forEach((t=>{e[t]||delete e[t];})),Object.keys(e).length?[e,this.keys,this.values]:[this.keys,this.values]}deepConvertArray(t,e=!0){const a=[e?this.arrayIdentifier:""].filter(Boolean);return t.forEach((t=>{const e=typeof t;Array.isArray(t)?a.push(this.deepConvertArray(t)):a.push(null!==t&&"object"===e?this.deepConvertObj(t):t);})),a}deepConvertObj(t){const e=this.separatorIdentifier,a=[],i=Object.getOwnPropertyNames(t).sort(),n=i.join(e),s="<$index>";if(""===n&&!i.length)return a;let r=i.map((e=>t[e]));if(this.keys.length){const o=this.getIndexByKey(n);if(void 0!==o)return r=n.split(e).map((e=>t[e])),a.push(o,...this.deepConvertArray(r,!1)),a;const l=this.getLastKeyInMap();for(const[t,r]of this.keyMap){const o=n.split(e).length<t.split(e).length,h=o?t:n,d=o?n:t,_=this.keys.length,f=t=>t.split(e).map((t=>"<$"+t+">")).join(e),c=f(h),u=f(d);if(~c.indexOf(u)){const t=c.replace(u,s),i=a=>t.split(e).map((t=>t===s?a:t.substring(2,t.length-1)));if(o){const t=this.saveKey(d),n=i(t),s=this.getIndexByKey(h);this.keys.push(d.split(e)),this.keys[s]=n,a.unshift(t);}else {const t=i(r);this.saveKey(h),this.keys.push(t),a.unshift(_);}break}if(l===t){this.saveKey(n),this.keys.push([...i]),a.unshift(_);break}}}else a.unshift(this.saveKey(n)),this.keys.push(i);return a.push(...this.deepConvertArray(r,!1)),a}saveKey(t,e=this.keys.length){return this.keyMap.set(t,e),this.indexMap.set(e,t),e}getIndexByKey(t){return this.keyMap.get(t)}}function Xe(t,e){const a=function(t,e){const{result:a}=new Je(t,e);return a}(t,e),{level:i}=e||{};return Ye.gzip(JSON.stringify(a),{level:void 0!==i?i:6})}function qe(t){return function(t){const{result:e}=new Ge(t);return e}(JSON.parse(Ye.ungzip(t,{to:"string"})))}

function createStore(reducer) {
    let state = reducer({});
    const listeners = [];
    function unsubscribe() {
        listeners.length = 0;
        dispatch({ type: 'RESET', data: {} });
    }
    function subscribe(listener) {
        listeners.push(listener);
    }
    function dispatch(action) {
        state = reducer(state, action);
        listeners.forEach(listener => {
            listener(state);
        });
    }
    function getState() {
        return state;
    }
    return {
        unsubscribe,
        subscribe,
        dispatch,
        getState
    };
}

function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    return function combination(state, action) {
        const nextState = {};
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i];
            const reducer = reducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
        }
        return nextState;
    };
}

const initState$2 = {
    startTime: 0,
    endTime: 0,
    duration: 0,
    packsInfo: []
};
var ProgressReducerTypes;
(function (ProgressReducerTypes) {
    ProgressReducerTypes["RESET"] = "RESET";
    ProgressReducerTypes["PROGRESS"] = "PROGRESS";
})(ProgressReducerTypes || (ProgressReducerTypes = {}));
function ProgressReducer(state, action) {
    if (!state) {
        state = initState$2;
    }
    if (!action) {
        return state;
    }
    const { type, data } = action;
    switch (type) {
        case ProgressReducerTypes.PROGRESS:
            return Object.assign(Object.assign({}, state), data);
        case ProgressReducerTypes.RESET:
            return Object.assign({}, initState$2);
        default:
            return state;
    }
}

const initState$1 = {
    speed: 0,
    options: {}
};
var PlayerReducerTypes;
(function (PlayerReducerTypes) {
    PlayerReducerTypes["RESET"] = "RESET";
    PlayerReducerTypes["SPEED"] = "SPEED";
    PlayerReducerTypes["OPTIONS"] = "OPTIONS";
})(PlayerReducerTypes || (PlayerReducerTypes = {}));
function PlayerReducer(state, action) {
    if (!state) {
        state = initState$1;
    }
    if (!action) {
        return state;
    }
    const { type, data } = action;
    switch (type) {
        case PlayerReducerTypes.OPTIONS:
            return Object.assign(Object.assign({}, state), { options: data.options });
        case PlayerReducerTypes.SPEED:
            return Object.assign(Object.assign({}, state), { speed: data.speed });
        case PlayerReducerTypes.RESET:
            return Object.assign({}, initState$1);
        default:
            return state;
    }
}

function getPacks(records) {
    const packs = [];
    const pack = [];
    records.forEach((record, i) => {
        if (i && record.type === RecordType.HEAD) {
            packs.push(pack.slice());
            pack.length = 0;
        }
        pack.push(record);
        if (records.length - 1 === i) {
            packs.push(pack);
        }
    });
    return packs;
}
function convertAudioBuffer(audioRecords) {
    const bufferStrList = [];
    audioRecords.forEach(record => {
        const { data } = record.data;
        bufferStrList.push(...data);
    });
    const dataArray = [];
    for (let i = 0; i < bufferStrList.length; i++) {
        const data = base64ToFloat32Array(bufferStrList[i]);
        dataArray.push(data);
    }
    const opts = {
        sampleBits: 8,
        channelCount: 1,
        sampleRate: 48000
    };
    return encodeAudioData(dataArray, opts);
}

const initState = {
    records: [],
    packs: [],
    currentData: {}
};
var ReplayDataReducerTypes;
(function (ReplayDataReducerTypes) {
    ReplayDataReducerTypes["RESET"] = "RESET";
    ReplayDataReducerTypes["UPDATE_DATA"] = "UPDATE_DATA";
    ReplayDataReducerTypes["APPEND_RECORDS"] = "APPEND_RECORDS";
})(ReplayDataReducerTypes || (ReplayDataReducerTypes = {}));
function ReplayDataReducer(state, action) {
    if (!state) {
        state = initState;
    }
    if (!action) {
        return state;
    }
    const { type, data } = action;
    switch (type) {
        case ReplayDataReducerTypes.APPEND_RECORDS:
            const records = state.records;
            records.push(...data.records);
            const packs = getPacks(records);
            state.packs = packs;
            return state;
        case ReplayDataReducerTypes.UPDATE_DATA:
            if (data.currentData && data.currentData) {
                window.G_REPLAY_DATA = data.currentData;
            }
            return Object.assign(Object.assign({}, state), data);
        case ReplayDataReducerTypes.RESET:
            return Object.assign({}, initState);
        default:
            return state;
    }
}

const reducer = combineReducers({
    player: PlayerReducer,
    progress: ProgressReducer,
    replayData: ReplayDataReducer
});
const Store = createStore(reducer);

var isMobile$2 = {exports: {}};

isMobile$2.exports = isMobile$1;
isMobile$2.exports.isMobile = isMobile$1;
isMobile$2.exports.default = isMobile$1;

const mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
const notMobileRE = /CrOS/;

const tabletRE = /android|ipad|playbook|silk/i;

function isMobile$1 (opts) {
  if (!opts) opts = {};
  let ua = opts.ua;
  if (!ua && typeof navigator !== 'undefined') ua = navigator.userAgent;
  if (ua && ua.headers && typeof ua.headers['user-agent'] === 'string') {
    ua = ua.headers['user-agent'];
  }
  if (typeof ua !== 'string') return false

  let result =
    (mobileRE.test(ua) && !notMobileRE.test(ua)) ||
    (!!opts.tablet && tabletRE.test(ua));

  if (
    !result &&
    opts.tablet &&
    opts.featureDetect &&
    navigator &&
    navigator.maxTouchPoints > 1 &&
    ua.indexOf('Macintosh') !== -1 &&
    ua.indexOf('Safari') !== -1
  ) {
    result = true;
  }

  return result
}

var mobile = isMobile$2.exports;

var FIXED_CSS = "/**\n * Copyright (c) oct16.\n * https://github.com/oct16\n * \n * This source code is licensed under the GPL-3.0 license found in the\n * LICENSE file in the root directory of this source tree.\n *\n */\ntextarea,\nbutton,\ndatalist,\nfieldset,\nform,\ninput,\nlabel,\nlegend,\nmeter,\noptgroup,\noption,\noutput,\nprogress,\nselect,\niframe {\n  pointer-events: none; }\n\nhtml, body {\n  scrollbar-width: none;\n  /* firefox */ }\n  html::-webkit-scrollbar, body::-webkit-scrollbar {\n    display: none; }\n";

const ignoreNodeNames = ['VIDEO', 'IFRAME'];
function setAttribute(node, name, value) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    if (name === 'style') {
        if (typeof value === 'string') {
            node.style.cssText = completeCssHref(value);
        }
        else if (value !== null && typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                if (k[0] === '-') {
                    node.style.setProperty(k, v);
                }
                else {
                    node.style[k] = v;
                }
            }
        }
        return;
    }
    if (name === 'src' && ~ignoreNodeNames.indexOf(node.tagName)) {
        return;
    }
    if (value && typeof value === 'string' && /\.js$/.test(value)) {
        return;
    }
    if (/^\d+/.test(name)) {
        return;
    }
    if (/^on\w+$/.test(name)) {
        return;
    }
    if (value === null) {
        return node.removeAttribute(name);
    }
    value = String(value);
    if (name === 'href') {
        value = completeAttrHref(String(value), node);
    }
    if (name === 'background' || name === 'src') {
        if (value.startsWith('data:')) ;
        else {
            value = completeAttrHref(String(value), node);
        }
    }
    if (name === 'srcset') {
        const srcArray = value.split(',');
        value = srcArray
            .map(src => {
            const [url, size] = src.trim().split(' ');
            if (url && size) {
                return `${completeAttrHref(url, node)} ${size}`;
            }
            if (url) {
                return completeAttrHref(url, node);
            }
            return '';
        })
            .join(', ');
        value = decodeURIComponent(value);
    }
    if (value.startsWith('/')) {
        value = completeAttrHref(value, node);
    }
    try {
        node.setAttribute(name, value);
    }
    catch (err) {
        logError(err);
    }
}

function convertVNode(vNode, parent) {
    if (vNode === null || vNode === undefined) {
        return null;
    }
    const vs = vNode;
    if (vNode.type === Node.COMMENT_NODE) {
        return createCommentNode(vs);
    }
    if (vNode.type === Node.TEXT_NODE) {
        if (parent && parent.tag === 'style') {
            const baseUrl = parent === null || parent === void 0 ? void 0 : parent.attrs['css-url'];
            vs.value = completeCssHref(vs.value, baseUrl);
        }
        return createText(vs);
    }
    const vn = vNode;
    const output = createNode(vn);
    if ((vn.children && vn.children.length) || (output.childNodes && output.childNodes.length)) {
        travel(vn, output);
    }
    return output;
}
function travel(vNode, node) {
    const nodeChildren = [];
    const vNodeChildren = vNode.children.slice();
    vNodeChildren.forEach(vChild => {
        let child = nodeChildren.pop();
        child = convertVNode(vChild, vNode);
        if (child) {
            if (isHideComment(node.lastChild)) {
                setAttribute(child, 'style', 'visibility: hidden');
            }
            node.appendChild(child);
        }
    });
}
function createProps(vNode, node) {
    const { props } = vNode.extra;
    if (props) {
        for (const [key, val] of Object.entries(props)) {
            if (key === 'scroll') {
                const { left, top } = val;
                setTimeout(() => {
                    node.scrollTop = top;
                    node.scrollLeft = left;
                }, 1000);
            }
            else {
                node[key] = val;
            }
        }
    }
}
function createAttributes(vNode, node) {
    const attrs = getAttributes(vNode);
    for (const [name, val] of Object.entries(attrs)) {
        setAttribute(node, name, val);
    }
    if (vNode.tag === 'a') {
        node.setAttribute('target', '_blank');
    }
}
function getAttributes(vNode) {
    const attrs = Object.assign({}, vNode.attrs);
    return attrs;
}
function createSpecialNode(vsNode) {
    const { type, value, id } = vsNode;
    let output;
    switch (type) {
        case Node.TEXT_NODE:
            output = document.createTextNode(value);
            break;
        case Node.COMMENT_NODE:
            output = document.createComment(value);
            break;
    }
    nodeStore.updateNode(id, output);
    return output;
}
function createNode(vNode) {
    const { id, extra } = vNode;
    const { isSVG } = extra;
    let output;
    const tagName = transformTagName(vNode.tag);
    if (isSVG) {
        output = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    }
    else {
        output = document.createElement(tagName);
    }
    createAttributes(vNode, output);
    createProps(vNode, output);
    nodeStore.updateNode(id, output);
    return output;
}
function transformTagName(tag) {
    const tagMap = {
        script: 'noscript',
        altglyph: 'altGlyph',
        altglyphdef: 'altGlyphDef',
        altglyphitem: 'altGlyphItem',
        animatecolor: 'animateColor',
        animatemotion: 'animateMotion',
        animatetransform: 'animateTransform',
        clippath: 'clipPath',
        feblend: 'feBlend',
        fecolormatrix: 'feColorMatrix',
        fecomponenttransfer: 'feComponentTransfer',
        fecomposite: 'feComposite',
        feconvolvematrix: 'feConvolveMatrix',
        fediffuselighting: 'feDiffuseLighting',
        fedisplacementmap: 'feDisplacementMap',
        fedistantlight: 'feDistantLight',
        feflood: 'feFlood',
        fefunca: 'feFuncA',
        fefuncb: 'feFuncB',
        fefuncg: 'feFuncG',
        fefuncr: 'feFuncR',
        fegaussianblur: 'feGaussianBlur',
        feimage: 'feImage',
        femerge: 'feMerge',
        femergenode: 'feMergeNode',
        femorphology: 'feMorphology',
        feoffset: 'feOffset',
        fepointLight: 'fePointLight',
        fespecularlighting: 'feSpecularLighting',
        fespotlight: 'feSpotLight',
        fetile: 'feTile',
        feturbulence: 'feTurbulence',
        foreignobject: 'foreignObject',
        lineargradient: 'linearGradient',
        radialgradient: 'radialGradient',
        textpath: 'textPath'
    };
    const tagName = tagMap[tag] || tag;
    return tagName;
}
function createText(vs) {
    const { value, id } = vs;
    const output = document.createTextNode(value);
    nodeStore.updateNode(id, output);
    return output;
}
function createCommentNode(vs) {
    const { value, id } = vs;
    const output = document.createComment(value);
    nodeStore.updateNode(id, output);
    return output;
}

function download(src, name) {
    const tag = document.createElement('a');
    tag.download = name;
    if (typeof src === 'string') {
        tag.href = src;
        tag.click();
    }
    else {
        tag.href = URL.createObjectURL(src);
        tag.click();
        URL.revokeObjectURL(tag.href);
    }
}
function transToReplayData(records) {
    function isAudioPCMStr(record) {
        return record.type === 'pcm' && record.encode === 'base64';
    }
    function isAudioWAVStr(record) {
        return record.type === 'wav' && record.encode === 'base64';
    }
    const audio = {
        src: '',
        pcmStrList: [],
        wavStrList: [],
        subtitles: [],
        opts: {}
    };
    const replayData = {
        head: {},
        snapshot: {},
        records: [],
        audio,
        videos: []
    };
    const videosMap = new Map();
    records.forEach((record, index) => {
        const next = records[index + 1];
        if (record.type === RecordType.HEAD) {
            if (next && !next.data.frameId) {
                replayData.head = record;
            }
        }
        else if (record.type === RecordType.SNAPSHOT) {
            if (!record.data.frameId) {
                if (replayData) {
                    replayData.snapshot = record;
                }
            }
            else {
                replayData.records.push(record);
            }
        }
        else {
            switch (record.type) {
                case RecordType.AUDIO:
                    const { data: audioData } = record;
                    if (audioData.src) {
                        const data = audioData;
                        replayData.audio.src = data.src;
                        replayData.audio.subtitles = data.subtitles;
                    }
                    else if (isAudioPCMStr(audioData)) {
                        replayData.audio.pcmStrList.push(...audioData.data);
                    }
                    else if (isAudioWAVStr(audioData)) {
                        replayData.audio.wavStrList.push(...audioData.data);
                    }
                    else {
                        replayData.audio.opts = audioData.data;
                    }
                    replayData.records.push(record);
                    break;
                case RecordType.VIDEO:
                    const { data, time } = record;
                    const { id, dataStr } = data;
                    if (!dataStr) {
                        break;
                    }
                    const videoData = videosMap.get(id);
                    if (videoData) {
                        videoData.bufferStrList.push(dataStr);
                        videoData.endTime = time;
                    }
                    else {
                        const newVideoData = {
                            id,
                            startTime: time,
                            endTime: time,
                            bufferStrList: [dataStr]
                        };
                        videosMap.set(id, newVideoData);
                    }
                    replayData.records.push(record);
                    break;
            }
            if (replayData) {
                replayData.records.push(record);
            }
        }
    });
    if (videosMap.size) {
        const videos = Array.from(videosMap.entries()).map(([, video]) => {
            const { bufferStrList, startTime, endTime, id } = video;
            const chunks = bufferStrList.map(str => {
                const buffer = base64ToBufferArray(str);
                const blob = new Blob([buffer], { type: 'video/webm;codecs=vp9' });
                return blob;
            });
            const steam = new Blob(chunks, { type: 'video/webm' });
            const blobUrl = window.URL.createObjectURL(steam);
            return {
                id,
                src: blobUrl,
                startTime,
                endTime
            };
        });
        replayData.videos.push(...videos);
    }
    return replayData;
}
function getGZipData() {
    const str = window.G_REPLAY_STR_RECORDS;
    if (!str) {
        return null;
    }
    const byteArray = asciiToUint8Array(str);
    return qe(byteArray);
}
function getRecordsFromStore() {
    const records = Store.getState().replayData.records;
    return records.length ? records : null;
}
function getRecordsFromDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield idb.readAll();
        if (records && records.length) {
            return records;
        }
        return null;
    });
}
function parseHtmlStr(htmlStr) {
    const parser = new DOMParser();
    const children = parser.parseFromString(htmlStr, 'text/html').body.children;
    return [...children];
}
function isMobile(ua) {
    if (!ua) {
        return false;
    }
    return mobile({ ua });
}
function showStartMask(c) {
    const startPage = c.container.querySelector('.player-start-page');
    startPage.setAttribute('style', '');
}
function showStartBtn(el) {
    const startPage = el.querySelector('.player-start-page');
    const btn = startPage.querySelector('.play-btn');
    btn.classList.add('show');
    return btn;
}
function removeStartPage(el) {
    var _a;
    const startPage = el.querySelector('.player-start-page');
    (_a = startPage === null || startPage === void 0 ? void 0 : startPage.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(startPage);
}
function waitStart(el) {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = showStartBtn(el);
        return new Promise(r => {
            btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                btn.classList.remove('show');
                yield delay(500);
                r();
            }));
        });
    });
}
function createIframeDOM(contentDocument, snapshotData) {
    contentDocument.open();
    const doctype = snapshotData.doctype;
    const doc = `<!DOCTYPE ${doctype.name} ${doctype.publicId ? 'PUBLIC ' + '"' + doctype.publicId + '"' : ''} ${doctype.systemId ? '"' + doctype.systemId + '"' : ''}><html><head></head><body></body></html>`;
    contentDocument.write(doc);
    contentDocument.close();
}
function injectIframeContent(contentDocument, snapshotData) {
    const content = convertVNode(snapshotData.vNode);
    if (content) {
        const head = content.querySelector('head');
        if (head) {
            const style = parseHtmlStr(`<div>
                    <style>
                        ${FIXED_CSS}
                    </style>
                </div>`)[0].firstElementChild;
            head.appendChild(style);
        }
        const documentElement = contentDocument.documentElement;
        content.scrollLeft = snapshotData.scrollLeft;
        content.scrollTop = snapshotData.scrollTop;
        contentDocument.replaceChild(content, documentElement);
    }
}

const shallowEqual = (prevProps, nextProps) => {
    if (prevProps === nextProps) {
        return true;
    }
    if (!(typeof prevProps === 'object' && prevProps != null) ||
        !(typeof nextProps === 'object' && nextProps != null)) {
        return false;
    }
    const keysA = Object.keys(prevProps);
    const keysB = Object.keys(nextProps);
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (let i = 0; i < keysA.length; i++) {
        if (nextProps.hasOwnProperty(keysA[i])) {
            if (prevProps[keysA[i]] !== nextProps[keysA[i]]) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    return true;
};
const provider = (store) => {
    return (mapStateToProps) => {
        let props;
        return (render) => {
            const getProps = () => mapStateToProps(store.getState());
            store.subscribe(() => {
                const newProps = getProps();
                if (shallowEqual(newProps, props)) {
                    return;
                }
                render((props = newProps));
            });
        };
    };
};
const connect = provider(Store);
const ConnectProps = (mapStateToProps) => {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (cb) {
            connect(mapStateToProps)(state => {
                originalMethod.call(this, state);
                cb && cb(state);
            });
        };
    };
};

class HeatBarBase {
    constructor(target, points = []) {
        this.ratio = 2;
        this.target = target;
        this.points = points;
        const targetWidth = this.target.offsetWidth * this.ratio;
        const targetHeight = this.target.offsetHeight * this.ratio;
        this.targetWidth = target.width = targetWidth;
        this.targetHeight = target.height = targetHeight;
        this.context = target.getContext('2d');
    }
    radiusRect(x, y, w, h, r, color = '#fff') {
        const min_size = Math.min(w, h);
        if (r > min_size / 2) {
            r = min_size / 2;
        }
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(x + r, y);
        this.context.arcTo(x + w, y, x + w, y + h, r);
        this.context.arcTo(x + w, y + h, x, y + h, r);
        this.context.arcTo(x, y + h, x, y, r);
        this.context.arcTo(x, y, x + w, y, r);
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }
}

class Pillar extends HeatBarBase {
    constructor(target, points) {
        super(target, points);
        this.draw();
    }
    draw() {
        const points = this.points;
        const len = points.length;
        const reactWidth = this.targetWidth / (len * 2);
        const reactHeight = this.targetHeight;
        const max = Math.max.apply(null, points.map(p => p.step));
        for (let i = 0; i < len; i++) {
            const point = points[i];
            if (!point.step) {
                continue;
            }
            const x = i * 2 * reactWidth;
            const y = 2;
            const w = reactWidth;
            const maxHeight = reactHeight * 0.9;
            const sinCurve = Math.sin((point.step / max) * (Math.PI / 2));
            const z = 0.16;
            const scale = sinCurve * (1 - z) + z;
            const h = point.snapshot ? maxHeight : scale * maxHeight;
            const color = point.snapshot ? '#6AD1C7' : '#fff';
            this.radiusRect(x, y, w, h, 2, color);
        }
    }
}

class NormalLine extends HeatBarBase {
    constructor(target) {
        super(target);
        this.draw();
    }
    draw() {
        if (!this.targetWidth) {
            return;
        }
        const radius = 4;
        this.radiusRect(radius, 2 * radius, this.targetWidth - 2 * radius, 8, radius);
    }
}

function Component(name, html, opts) {
    return function (constructor) {
        if (!customElements.get(name))
            customElements.define(name, class extends HTMLElement {
                constructor() {
                    var _a, _b;
                    super();
                    const child = parseHtmlStr(html)[0];
                    constructor.prototype.target = child;
                    const slot = child.getElementsByTagName('slot')[0];
                    if (slot && ((_a = this.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        const parent = slot.parentElement;
                        [...this.children].forEach(el => parent === null || parent === void 0 ? void 0 : parent.insertBefore(el, null));
                        parent === null || parent === void 0 ? void 0 : parent.removeChild(slot);
                    }
                    if (opts === null || opts === void 0 ? void 0 : opts.isShadow) {
                        this.attachShadow({ mode: 'open' }).append(child);
                    }
                    else {
                        (_b = this.parentElement) === null || _b === void 0 ? void 0 : _b.replaceChild(child, this);
                    }
                    constructor.prototype.parent = child.parentElement;
                }
            });
    };
}
const html = function (strings, ...values) {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return str;
};

function disableScrolling(target) {
    const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    function preventDefault(e) {
        e.preventDefault();
    }
    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }
    let supportsPassive = false;
    try {
        target.addEventListener('test', () => { }, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            }
        }));
    }
    catch (e) { }
    const wheelOpt = supportsPassive ? { passive: false } : false;
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    function disableScroll() {
        target.addEventListener('DOMMouseScroll', preventDefault, false);
        target.addEventListener(wheelEvent, preventDefault, wheelOpt);
        target.addEventListener('touchmove', preventDefault, wheelOpt);
        target.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    disableScroll();
}

const emptyTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no, viewport-fit=cover">
    <meta http-equiv="Content-Security-Policy-Report-Only" />
    <title>TimeCat</title>
</head>
<body style="margin: 0; overflow: hidden">
</body>
</html>
`;
const pacmanCss = `.pacman-box{margin:0 auto;display:flex;vertical-align:middle;height:100vh;flex:0 1 auto;flex-direction:column;flex-grow:1;flex-shrink:0;flex-basis:25%;max-width:25%;align-items:center;justify-content:center}.pacman>div:first-of-type,.pacman>div:nth-child(2){width:0;height:0;border-right:25px solid transparent;border-top:25px solid grey;border-left:25px solid grey;border-bottom:25px solid grey;border-radius:25px;position:relative;left:-30px}@-webkit-keyframes rotate_pacman_half_up{0%,100%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}50%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes rotate_pacman_half_up{0%,100%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}50%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes rotate_pacman_half_down{0%,100%{-webkit-transform:rotate(90deg);transform:rotate(90deg)}50%{-webkit-transform:rotate(0);transform:rotate(0)}}@keyframes rotate_pacman_half_down{0%,100%{-webkit-transform:rotate(90deg);transform:rotate(90deg)}50%{-webkit-transform:rotate(0);transform:rotate(0)}}@-webkit-keyframes pacman-balls{75%{opacity:.7}100%{-webkit-transform:translate(-100px,-6.25px);transform:translate(-100px,-6.25px)}}@keyframes pacman-balls{75%{opacity:.7}100%{-webkit-transform:translate(-100px,-6.25px);transform:translate(-100px,-6.25px)}}.pacman{transform: translateX(30px);position:relative}.pacman>div:nth-child(3){-webkit-animation:pacman-balls 1s -.66s infinite linear;animation:pacman-balls 1s -.66s infinite linear}.pacman>div:nth-child(4){-webkit-animation:pacman-balls 1s -.33s infinite linear;animation:pacman-balls 1s -.33s infinite linear}.pacman>div:nth-child(5){-webkit-animation:pacman-balls 1s 0s infinite linear;animation:pacman-balls 1s 0s infinite linear}.pacman>div:first-of-type{-webkit-animation:rotate_pacman_half_up .5s 0s infinite;animation:rotate_pacman_half_up .5s 0s infinite}.pacman>div:nth-child(2){-webkit-animation:rotate_pacman_half_down .5s 0s infinite;animation:rotate_pacman_half_down .5s 0s infinite;margin-top:-50px}.pacman>div:nth-child(3),.pacman>div:nth-child(4),.pacman>div:nth-child(5),.pacman>div:nth-child(6){background-color:grey;border-radius:100%;margin:2px;width:10px;height:10px;position:absolute;-webkit-transform:translate(0,-6.25px);transform:translate(0,-6.25px);top:25px;left:70px}`;
const loadingScriptContent = `const loadingNode = document.createElement('div')
loadingNode.className = 'pacman-box';
loadingNode.innerHTML = '<style>${pacmanCss}<\/style><div class="pacman"><div><\/div><div><\/div><div><\/div><div><\/div><div><\/div><\/div>'
loadingNode.setAttribute('style', 'text-align: center;vertical-align: middle;line-height: 100vh;')
document.body.insertBefore(loadingNode, document.body.firstChild);window.addEventListener('DOMContentLoaded', () => loadingNode.parentNode.removeChild(loadingNode))`;
const ringCss = `.lds-ring{margin-left:-40px;margin-top:-40px;width:80px;height:80px;position:absolute;left:50%;top:50%}.lds-ring div{box-sizing:border-box;display:block;position:absolute;width:64px;height:64px;margin:8px;border:8px solid grey;border-radius:50%;animation:lds-ring 1.2s cubic-bezier(0.5,0,0.5,1) infinite;border-color:grey transparent transparent transparent}.lds-ring div:nth-child(1){animation-delay:-0.45s}.lds-ring div:nth-child(2){animation-delay:-0.3s}.lds-ring div:nth-child(3){animation-delay:-0.15s}@keyframes lds-ring{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`;
const normalLoading = `<div class="lds-ring"><style>${ringCss}<\/style><div></div><div></div><div></div><div></div></div>`;

class RecoverNative {
    constructor() {
        const frame = document.createElement('iframe');
        frame.style.display = 'none';
        frame.style.visibility = 'hidden';
        document.body.appendChild(frame);
        this.safeWindow = frame.contentWindow;
    }
    getObjByPath(path, target) {
        if (!path) {
            return target;
        }
        const pathArray = this.getMethodAtPath(path);
        let method = target;
        pathArray.forEach(key => {
            method = method[key];
        });
        return method;
    }
    getMethodAtPath(path) {
        return path.split('.');
    }
    recoverMethod(path) {
        const currFn = this.getObjByPath(path, window);
        if (!this.isNative(currFn)) {
            const nativeFn = this.getObjByPath(path, this.safeWindow);
            this.recover(path, nativeFn);
        }
    }
    recover(path, fn) {
        const pathArray = this.getMethodAtPath(path);
        const [methodName, ..._path] = pathArray.reverse();
        const host = this.getObjByPath(_path.reverse().join('.'), window);
        host[methodName] = fn;
    }
    isNative(value) {
        const toString = Object.prototype.toString;
        const fnToString = Function.prototype.toString;
        const reHostCtor = /^\[object .+?Constructor\]$/;
        const reNative = RegExp('^' +
            String(toString)
                .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
                .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
            '$');
        const type = typeof value;
        return type == 'function'
            ?
                reNative.test(fnToString.call(value))
            :
                (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
    }
}
function recoverDefaults(list) {
    list.forEach(recoverNative.recoverMethod.bind(recoverNative));
}
const recoverNative = new RecoverNative();
recoverDefaults(['MutationObserver', 'console.warn', 'console.error', 'console.log']);

const EXPORT_NAME_LABEL = 'TimeCat';
function exportReplay(exportOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        recoveryMethods();
        const html = yield createReplayDocument(exportOptions);
        const htmlStr = html.documentElement.outerHTML;
        const exportName = exportOptions.exportName;
        const fileName = `${exportName || EXPORT_NAME_LABEL}-${getRandomCode()}`;
        downloadHTML(fileName, htmlStr);
    });
}
function createReplayDocument(exportOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = new DOMParser();
        const html = parser.parseFromString(emptyTemplate, 'text/html');
        yield injectLoading(html);
        yield injectData(html, exportOptions);
        yield initOptions(html, exportOptions);
        return html;
    });
}
function recoveryMethods() {
    const methods = [
        'HTMLElement.prototype.appendChild'
    ];
    methods.forEach(recoverNative.recoverMethod.bind(recoverNative));
}
function downloadHTML(name, content) {
    const blob = new Blob([content], { type: 'text/html' });
    download(blob, `${name}.html`);
}
function initOptions(html, exportOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { scripts, autoplay } = exportOptions;
        const options = { autoplay };
        const scriptList = scripts || [];
        if (!scriptList.some(item => item.name === 'timecat-init')) {
            scriptList.push({
                name: 'timecat-init',
                src: `new TimeCat.Player(${JSON.stringify(options)})`
            });
        }
        yield injectScripts(html, scriptList);
    });
}
function injectScripts(html, scripts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (scripts) {
            for (const scriptItem of scripts) {
                const { src, name } = scriptItem;
                let scriptContent = src;
                const script = document.createElement('script');
                if (name) {
                    script.id = name;
                }
                const isUrlReg = /^((chrome-extension|https?):)?\/\/.+/;
                if (isUrlReg.test(src)) {
                    {
                        scriptContent = yield getScript(src);
                    }
                }
                script.text = scriptContent;
                html.body.appendChild(script);
            }
        }
    });
}
function extract(packs, exportOptions) {
    return packs.map(extractAudio);
}
function extractAudio(records) {
    const audioPCMRecords = [];
    const extractedRecords = [];
    records.forEach(record => {
        if (record.type === RecordType.AUDIO) {
            const recordData = record.data;
            if (recordData.type === 'pcm') {
                audioPCMRecords.push(record);
                return;
            }
        }
        extractedRecords.push(record);
    });
    if (audioPCMRecords.length) {
        const dataView = convertAudioBuffer(audioPCMRecords);
        const buffer = dataView.buffer;
        const wavBase64Str = bufferArrayToBase64(buffer);
        const insertIndex = extractedRecords.length - 1;
        const prevRecord = extractedRecords[insertIndex];
        const data = {
            type: 'wav',
            encode: 'base64',
            data: [wavBase64Str]
        };
        const wavRecord = Object.assign(Object.assign({}, prevRecord), { time: audioPCMRecords.slice(-1)[0].time, type: RecordType.AUDIO, data });
        extractedRecords.splice(insertIndex, 0, wavRecord);
    }
    return extractedRecords;
}
function injectLoading(html) {
    return __awaiter(this, void 0, void 0, function* () {
        injectScripts(html, [{ src: loadingScriptContent }]);
    });
}
function injectData(html, exportOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const records = exportOptions.records || getGZipData() || getRecordsFromStore() || (yield getRecordsFromDB());
        if (!records) {
            return logError('Records not found');
        }
        const packs = getPacks(records);
        const extractedRecords = extract(packs).flat(1);
        const zipArray = Xe(extractedRecords);
        const outputStr = uint8ArrayToAscii(zipArray);
        const replayData = `var G_REPLAY_STR_RECORDS =  '${outputStr}'`;
        injectScripts(html, [{ src: replayData }]);
    });
}

var PlayerEventTypes;
(function (PlayerEventTypes) {
    PlayerEventTypes["INIT"] = "init";
    PlayerEventTypes["PLAY"] = "play";
    PlayerEventTypes["PAUSE"] = "pause";
    PlayerEventTypes["STOP"] = "stop";
    PlayerEventTypes["SPEED"] = "speed";
    PlayerEventTypes["RESIZE"] = "resize";
    PlayerEventTypes["PROGRESS"] = "progress";
    PlayerEventTypes["JUMP"] = "jump";
})(PlayerEventTypes || (PlayerEventTypes = {}));

let KeyboardComponent = class KeyboardComponent {
    constructor(options, container) {
        this.options = options;
        this.c = container;
        this.init();
    }
    watchPlayerSpeed(state) {
        if (state) {
            this.paly(state.speed);
            this.setSpeed(state.speed);
        }
    }
    init() {
        this.controller = this.c.container.querySelector('.player-keyboard');
        this.playOrPauseBtn = this.c.container.querySelector('.play-or-pause');
        this.createFastForwards(this.options.fastForward);
        const controllerHandler = (e) => {
            if (e.target && e.target.type === 'button') {
                const speed = Number(e.target.getAttribute('speed'));
                this.dispatchPlay(speed);
            }
        };
        this.controller.addEventListener('click', controllerHandler, false);
        this.options.destroyStore.add(() => {
            this.controller.removeEventListener('click', controllerHandler, false);
        });
        this.watchPlayerSpeed();
        this.detectWindowIsActive();
    }
    createFastForwards(speeds) {
        speeds = Array.from(new Set([1].concat(speeds)));
        if (speeds) {
            const htmlStr = speeds.reduce((s, speed) => s + html `<button type="button" class="speed" speed="${speed}">${speed}x</button>`, '');
            this.controller.append(...parseHtmlStr(htmlStr));
        }
    }
    dispatchPlay(speed = 0) {
        Store.dispatch({
            type: PlayerReducerTypes.SPEED,
            data: {
                speed
            }
        });
    }
    detectWindowIsActive() {
        const handler = () => {
            if (document.visibilityState === 'hidden') {
                this.dispatchPlay(0);
            }
        };
        document.addEventListener('visibilitychange', handler, false);
        this.options.destroyStore.add(() => {
            document.removeEventListener('visibilitychange', handler, false);
        });
    }
    paly(speed) {
        if (speed !== 0) {
            this.playOrPauseBtn.innerText = '〓';
            this.playOrPauseBtn.setAttribute('style', 'letter-spacing: 1px;font-weight: bold;');
            this.playOrPauseBtn.removeAttribute('speed');
        }
        else {
            this.playOrPauseBtn.innerText = '▲';
            this.playOrPauseBtn.removeAttribute('style');
            this.playOrPauseBtn.setAttribute('speed', '1');
        }
    }
    setSpeed(speed) {
        const speedNodes = this.c.container.querySelectorAll('.speed');
        [...speedNodes].forEach(node => {
            node.removeAttribute('disabled');
        });
        const index = getBtnIndex(speed);
        function getBtnIndex(speed) {
            return [...speedNodes].findIndex(node => node.getAttribute('speed') === speed.toString());
        }
        if (index > -1) {
            speedNodes[index].setAttribute('disabled', '');
        }
    }
};
__decorate([
    ConnectProps(state => ({
        speed: state.player.speed
    }))
], KeyboardComponent.prototype, "watchPlayerSpeed", null);
KeyboardComponent = __decorate([
    Component('player-keyboard', html `<div class="player-keyboard">
        <button class="play-or-pause" type="button" speed="1">▲</button>
    </div>`)
], KeyboardComponent);

function renderCanvas2D(canvasRecordData) {
    const data = canvasRecordData;
    const { src, status, id, strokes } = data;
    const canvas = nodeStore.getNode(id);
    if (!canvas || canvas.constructor.name !== 'HTMLCanvasElement') {
        return;
    }
    if (!canvas.contextType) {
        canvas.contextType = '2d';
    }
    else if (canvas.contextType === 'webgl' || canvas.contextType === 'experimental-webgl') {
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    if (src) {
        const image = new Image();
        image.src = src;
        image.onload = function () {
            ctx.drawImage(this, 0, 0);
        };
    }
    else if (status) {
        Object.keys(status).forEach(key => {
            ctx[key] = status[key];
        });
    }
    else {
        for (const stroke of strokes) {
            const { name: key, args: strokeArgs } = stroke;
            const name = typeof key === 'number' ? canvasContext2DKeys[key] : key;
            if (!Array.isArray(strokeArgs)) {
                ctx[name] = strokeArgs;
            }
            else {
                const args = strokeArgs.slice();
                if (name === 'createPattern') {
                    const nodeId = args[0];
                    args[0] = nodeStore.getNode(nodeId);
                }
                else if (name === 'drawImage') {
                    const img = new Image();
                    const src = args[0];
                    if (src.length < 10) {
                        continue;
                    }
                    img.src = src;
                    args[0] = img;
                }
                else if (name === 'putImageData') {
                    const data = args[0].data;
                    args[0] = new ImageData(new Uint8ClampedArray(data), args[1], args[2]);
                }
                ctx[name].apply(ctx, args);
            }
        }
    }
}

const WebGLConstructors = [
    WebGLActiveInfo,
    WebGLBuffer,
    WebGLFramebuffer,
    WebGLProgram,
    WebGLRenderbuffer,
    WebGLShader,
    WebGLShaderPrecisionFormat,
    WebGLTexture,
    WebGLUniformLocation
];
const GLVars = Object.create(null);
const getWebGLVariable = (value) => {
    return GLVars[value] || (GLVars[value] = []);
};
function renderWebGL(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield delay();
        const { id, args } = data;
        const canvas = nodeStore.getNode(id);
        if (!canvas) {
            return;
        }
        if (!canvas.contextType) {
            canvas.contextType = 'webgl';
        }
        else if (canvas.contextType === '2d') {
            return;
        }
        const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
        if (!gl) {
            return;
        }
        args.forEach(({ name, args }) => {
            const command = gl[name];
            if (typeof command === 'function') {
                args = args.map((arg) => {
                    if (typeof arg === 'string') {
                        if (arg.startsWith('$f32arr')) {
                            const float32Arr = arg.slice(7).split(',');
                            return new Float32Array(float32Arr);
                        }
                        else if (arg.startsWith('$arr')) {
                            const arr = new Array(...arg.slice(4).split(','));
                            return arr.map(i => (isNumeric(i) ? +i : i));
                        }
                        else if (arg.startsWith('$')) {
                            const [name, val] = arg.slice(1).split('@');
                            if (name === 'src') {
                                const img = document.createElement('img');
                                img.setAttribute(name, val);
                                return img;
                            }
                            const varList = getWebGLVariable(name);
                            return varList[+val];
                        }
                    }
                    return arg;
                });
                const ret = command.apply(gl, args);
                if (ret === null || ret === void 0 ? void 0 : ret.constructor) {
                    const ctorName = ret.constructor.name;
                    if (WebGLConstructors.some(item => item.name === ctorName) || name === 'getExtension') {
                        const varList = getWebGLVariable(ctorName);
                        if (ret && Array.isArray(varList)) {
                            if (!~varList.indexOf(ret)) {
                                varList.push(ret);
                            }
                        }
                    }
                }
            }
        });
    });
}

function renderCanvasSnapshot(data) {
    const { src, id } = data;
    const canvas = nodeStore.getNode(id);
    if (!canvas || canvas.constructor.name !== 'HTMLCanvasElement') {
        return;
    }
    if (!canvas.contextType) {
        canvas.contextType = '2d';
    }
    else if (canvas.contextType === 'webgl' || canvas.contextType === 'experimental-webgl') {
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    if (src) {
        const image = new Image();
        image.src = src;
        image.onload = function () {
            ctx.drawImage(this, 0, 0);
        };
    }
}

function renderFont(data) {
    const { family, source } = data;
    const buffer = new Uint8Array(source.length);
    for (let i = 0; i < source.length; i++) {
        const code = source.charCodeAt(i);
        buffer[i] = code;
    }
    const font = new window.FontFace(family, buffer);
    this.c.sandBoxDoc.fonts.add(font);
    document.fonts.add(font);
}

function renderPatch(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, key, url, tag, text } = data;
        const node = nodeStore.getNode(id);
        if (!node) {
            yield delay(1000);
        }
        const n = node;
        if (n && n.getAttribute(key) === url && n.tagName === tag.toUpperCase()) {
            if (tag === 'link') {
                const replaceNode = document.createElement('style');
                replaceNode.setAttribute('type', 'text/css');
                replaceNode.setAttribute('css-url', url);
                replaceNode.innerHTML = text;
                n.replaceWith(replaceNode);
            }
        }
    });
}

function renderLocation(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { path, hash, href, contextNodeId } = data;
        const contextNode = nodeStore.getNode(contextNodeId);
        if (contextNode) {
            const context = contextNode.ownerDocument.defaultView;
            context.G_REPLAY_LOCATION = Object.assign(Object.assign({}, context.G_REPLAY_LOCATION), { path, hash, href });
        }
    });
}

function renderSnapshot(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshotData = data;
        const { frameId } = snapshotData;
        if (frameId) {
            const iframeNode = nodeStore.getNode(frameId);
            if (iframeNode) {
                const src = iframeNode.getAttribute('src');
                if (src) {
                    setAttribute(iframeNode, 'disabled-src', src);
                    setAttribute(iframeNode, 'src', null);
                }
                const contentDocument = iframeNode.contentDocument;
                createIframeDOM(contentDocument, snapshotData);
                injectIframeContent(contentDocument, snapshotData);
            }
        }
    });
}

function renderScroll(data) {
    var _a;
    const { top, left, id, behavior: b } = data;
    const target = id ? nodeStore.getNode(id) : this.c.sandBoxDoc.documentElement;
    if (!target) {
        return;
    }
    const curTop = target.scrollTop;
    const height = window.G_REPLAY_DATA.snapshot.data.height;
    const behavior = b || Math.abs(top - curTop) > height * 3 ? 'auto' : 'smooth';
    const opts = {
        top,
        left,
        behavior
    };
    try {
        target.scroll(opts);
    }
    catch (error) {
        if (target.nodeName === 'HTML') {
            (_a = target.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.scroll(opts);
        }
        else {
            target.scrollLeft = left;
            target.scrollTop = top;
        }
    }
}

function renderWindow(data) {
    const { width, height, id } = data;
    let target;
    if (id) {
        target = nodeStore.getNode(id);
        target.style.width = width + 'px';
        target.style.height = height + 'px';
    }
    else {
        target = this.c.sandBoxDoc.body;
        this.c.resize({ setWidth: width, setHeight: height });
    }
}

function renderMouse(data) {
    const { x, y, id, type } = data;
    let left = 0, top = 0;
    if (id) {
        const node = nodeStore.getNode(id);
        let rect = {};
        if (node && node.getBoundingClientRect) {
            rect = node.getBoundingClientRect();
        }
        const { left: nodeLeft, top: nodeTop } = rect;
        left = nodeLeft;
        top = nodeTop;
    }
    if (type === MouseEventType.MOVE) {
        this.pointer.move(x + left, y + top);
    }
    else if (type === MouseEventType.CLICK) {
        this.pointer.click(x + left, y + top);
    }
}

function renderFormEl(data, opts) {
    const { isJumping } = opts || {};
    const { id, key, type: formType, value, patches } = data;
    const node = nodeStore.getNode(id);
    const { mode } = Store.getState().player.options;
    if (node) {
        if (formType === FormElementEvent.INPUT || formType === FormElementEvent.CHANGE) {
            if (patches && patches.length) {
                const newValue = revertStrByPatches(node.value, patches);
                node.value = newValue;
            }
            else if (key) {
                node[key] = value;
            }
        }
        else if (formType === FormElementEvent.FOCUS) {
            mode !== 'live' && !isJumping && node.focus && node.focus({ preventScroll: true });
        }
        else if (formType === FormElementEvent.BLUR) {
            mode !== 'live' && !isJumping && node.blur && node.blur();
        }
        else if (formType === FormElementEvent.PROP) {
            if (key) {
                node[key] = value;
            }
        }
    }
}

function insertOrMoveNode(data, orderSet) {
    const { parentId, nextId, node } = data;
    const parentNode = nodeStore.getNode(parentId);
    const findNextNode = (nextId) => {
        return nextId ? nodeStore.getNode(nextId) : null;
    };
    if (parentNode && isElementNode(parentNode)) {
        let nextNode = null;
        if (nextId) {
            if (orderSet.has(nextId)) {
                return true;
            }
            nextNode = findNextNode(nextId);
            if (!nextNode) {
                return true;
            }
            if (!parentNode.contains(nextNode)) {
                return true;
            }
        }
        const n = node;
        let insertNode;
        if (typeof node === 'number') {
            insertNode = nodeStore.getNode(node);
            if (orderSet.has(node)) {
                orderSet.delete(node);
            }
        }
        else if (isVNode(n)) {
            insertNode = convertVNode(n);
        }
        else {
            insertNode = createSpecialNode(n);
        }
        if (insertNode) {
            parentNode.insertBefore(insertNode, nextNode);
        }
    }
    else {
        return true;
    }
}
function renderDom(data) {
    const { addedNodes, movedNodes, removedNodes, attrs, texts } = data;
    removedNodes &&
        removedNodes.forEach((data) => {
            const { parentId, id } = data;
            const parentNode = nodeStore.getNode(parentId);
            const node = nodeStore.getNode(id);
            if (node && parentNode && parentNode.contains(node)) {
                parentNode.removeChild(node);
            }
        });
    const orderSet = new Set();
    const movedList = (movedNodes && movedNodes.slice()) || [];
    movedList.forEach(data => {
        if (data.nextId) {
            if (movedList.some(a => a.id === data.nextId)) {
                orderSet.add(data.nextId);
            }
        }
    });
    const addedList = movedList
        .map(item => {
        const { id, parentId, nextId } = item;
        return {
            node: id,
            parentId,
            nextId
        };
    })
        .concat((addedNodes && addedNodes.slice()) || []);
    if (addedList) {
        const n = addedList.length;
        const maxRevertCount = n > 0 ? (n * n + n) / 2 : 0;
        let revertCount = 0;
        while (addedList.length) {
            const addData = addedList.shift();
            if (addData) {
                if (insertOrMoveNode(addData, orderSet)) {
                    if (revertCount++ < maxRevertCount) {
                        addedList.push(addData);
                    }
                }
            }
        }
    }
    attrs &&
        attrs.forEach((attr) => {
            const { id, key, value } = attr;
            const node = nodeStore.getNode(id);
            if (node) {
                setAttribute(node, key, value);
            }
        });
    texts &&
        texts.forEach((text) => {
            const { id, value, parentId } = text;
            const parentNode = nodeStore.getNode(parentId);
            const node = nodeStore.getNode(id);
            if (parentNode && node) {
                if (isExistingNode(node)) {
                    node.textContent = value;
                    return;
                }
                parentNode.innerText = value;
            }
        });
}

function renderAll(recordData, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isJumping, speed } = opts || {};
        const delayTime = isJumping ? 0 : 200;
        const { type, data } = recordData;
        const actionDelay = () => (delayTime ? delay(delayTime) : Promise.resolve());
        switch (type) {
            case RecordType.SNAPSHOT: {
                renderSnapshot(data);
                break;
            }
            case RecordType.SCROLL: {
                renderScroll.call(this, data);
                break;
            }
            case RecordType.WINDOW: {
                renderWindow.call(this, data);
                break;
            }
            case RecordType.MOUSE: {
                renderMouse.call(this, data);
                break;
            }
            case RecordType.DOM: {
                if (!isJumping && speed === 1) {
                    yield actionDelay();
                }
                renderDom(data);
                break;
            }
            case RecordType.FORM_EL: {
                if (!isJumping && speed === 1) {
                    yield actionDelay();
                }
                renderFormEl(data, { isJumping });
                break;
            }
            case RecordType.LOCATION: {
                renderLocation(data);
                break;
            }
            case RecordType.CANVAS_SNAPSHOT: {
                renderCanvasSnapshot(data);
                break;
            }
            case RecordType.CANVAS: {
                if (!isJumping && speed === 1) {
                    yield actionDelay();
                }
                renderCanvas2D(data);
                break;
            }
            case RecordType.FONT: {
                renderFont.call(this, data);
                break;
            }
            case RecordType.PATCH: {
                renderPatch(data);
                break;
            }
            case RecordType.WEBGL: {
                renderWebGL(data);
                break;
            }
        }
    });
}

let PlayerComponent = class PlayerComponent {
    constructor(options, c, pointer, progress, broadcaster) {
        this.speed = 0;
        this.recordIndex = 0;
        this.frameIndex = 0;
        this.isFirstTimePlay = true;
        this.maxFrameInterval = 250;
        this.maxFps = 30;
        this.animationDelayTime = 300;
        this.elapsedTime = 0;
        this.audioOffset = 150;
        this.curViewDiffTime = 0;
        this.preViewsDurationTime = 0;
        this.viewIndex = 0;
        this.subtitlesIndex = 0;
        this.maxIntensityStep = 8;
        this.options = options;
        this.c = c;
        this.pointer = pointer;
        this.progress = progress;
        this.broadcaster = broadcaster;
        this.init();
    }
    watchPlayerSpeed(state) {
        if (state) {
            const speed = state.speed;
            const curSpeed = this.speed;
            this.speed = speed;
            observer.emit(PlayerEventTypes.SPEED, speed);
            if (speed > 0) {
                this.play();
                if (curSpeed === 0) {
                    observer.emit(PlayerEventTypes.PLAY);
                }
            }
            else {
                this.pause();
            }
        }
    }
    watchProgress() {
        this.recalculateProgress();
        this.viewsLength = Store.getState().replayData.packs.length;
    }
    watcherProgressJump() {
        observer.on(PlayerEventTypes.JUMP, (state) => __awaiter(this, void 0, void 0, function* () { return this.jump(state, true); }));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.audioNode = new Audio();
            this.calcFrames();
            this.viewsLength = Store.getState().replayData.packs.length;
            this.initViewState();
            this.setViewState();
            if (this.records.length <= 2) {
                window.addEventListener('record-data', this.streamHandle.bind(this));
                this.options.destroyStore.add(() => window.removeEventListener('record-data', this.streamHandle.bind(this)));
            }
            else {
                this.watchProgress();
                this.watchPlayerSpeed();
                this.watcherProgressJump();
            }
            observer.on(PlayerEventTypes.RESIZE, () => __awaiter(this, void 0, void 0, function* () {
                yield delay(500);
                this.recalculateProgress();
            }));
            observer.on(PlayerEventTypes.PROGRESS, (frame) => {
                const percent = frame / (this.frames.length - 1);
                this.progress.setProgressPosition(percent);
            });
        });
    }
    initAudio() {
        if (!this.audioData) {
            return;
        }
        if (this.audioData.src) {
            this.audioBlobUrl = location.href.split('/').slice(0, -1).join('/') + '/' + this.audioData.src;
        }
        else {
            const { wavStrList, pcmStrList } = this.audioData;
            let type = undefined;
            const list = [];
            if (wavStrList.length) {
                type = 'wav';
                list.push(...wavStrList);
            }
            else if (pcmStrList.length) {
                type = 'pcm';
                list.push(...pcmStrList);
            }
            if (!type) {
                return;
            }
            const dataArray = [];
            for (let i = 0; i < list.length; i++) {
                const data = base64ToFloat32Array(list[i]);
                dataArray.push(data);
            }
            const audioBlob = type === 'wav' ? new Blob(dataArray, { type: 'audio/wav' }) : encodeWAV(dataArray, this.audioData.opts);
            const audioBlobUrl = URL.createObjectURL(audioBlob);
            this.audioBlobUrl = audioBlobUrl;
        }
    }
    mountVideos() {
        if (!this.videos || !this.videos.length) {
            return;
        }
        this.videos.forEach(video => {
            const { src, id } = video;
            const videoElement = nodeStore.getNode(id);
            if (videoElement) {
                const target = videoElement;
                target.muted = true;
                target.autoplay = target.loop = target.controls = false;
                target.src = src;
            }
        });
    }
    streamHandle(e) {
        const record = e.detail;
        if (isSnapshot(record)) {
            Store.getState().replayData.currentData.snapshot = record;
            this.setViewState();
            return;
        }
        this.execFrame(record);
    }
    initViewState() {
        const { currentData } = Store.getState().replayData;
        const { records, audio, videos, head } = currentData;
        this.records = this.processing(records);
        this.audioData = audio;
        this.videos = videos;
        const { userAgent } = (head === null || head === void 0 ? void 0 : head.data) || {};
        if (isMobile(userAgent)) {
            this.pointer.hidePointer();
        }
        if (!this.records.length) {
            return;
        }
        this.subtitlesIndex = 0;
        this.broadcaster.cleanText();
        this.curViewStartTime = (head && head.time) || records[0].time;
        this.curViewEndTime = records.slice(-1)[0].time;
        this.preViewsDurationTime = 0;
        this.curViewDiffTime = 0;
        this.viewIndex = 0;
    }
    setViewState() {
        this.c.setViewState();
        this.initAudio();
        this.mountVideos();
    }
    jump(state, shouldLoading = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isJumping = true;
            this.shouldWaitForSync = true;
            let loading = undefined;
            const { speed } = Store.getState().player;
            const { index, time, percent } = state;
            if (shouldLoading) {
                this.pause(false);
                loading = parseHtmlStr(normalLoading)[0];
                this.c.container.appendChild(loading);
                yield delay(100);
            }
            const nextReplayData = this.getNextReplayData(index);
            if (!nextReplayData) {
                return;
            }
            this.initViewState();
            if (this.viewIndex !== index || this.startTime >= time) {
                const [{ packsInfo }, { packs }] = [Store.getState().progress, Store.getState().replayData];
                const diffTime = packsInfo[index].diffTime;
                this.curViewEndTime = packs[index].slice(-1)[0].time;
                this.curViewDiffTime = diffTime;
                this.preViewsDurationTime = packsInfo.slice(0, index).reduce((a, b) => a + b.duration, 0);
                this.viewIndex = index;
                this.records = packs[index];
            }
            const frameIndex = 1 +
                this.frames.findIndex((t, i) => {
                    const cur = t;
                    const next = this.frames[i + 1] || cur + 1;
                    if (time >= cur && time <= next) {
                        return true;
                    }
                });
            this.frameIndex = frameIndex;
            this.initTime = getTime();
            this.recordIndex = 0;
            this.audioData = nextReplayData.audio;
            this.startTime = time;
            this.subtitlesIndex = 0;
            if (percent !== undefined) {
                this.progress.moveThumb(percent);
                yield delay(100);
            }
            this.setViewState();
            this.playAudio();
            this.loopFramesByTime(this.frames[this.frameIndex]);
            if (loading) {
                yield delay(100);
                this.c.container.removeChild(loading);
                Store.dispatch({ type: PlayerReducerTypes.SPEED, data: { speed } });
            }
            this.isJumping = false;
            setTimeout(() => (this.shouldWaitForSync = false), 100);
        });
    }
    getNextReplayData(index) {
        const { packs } = Store.getState().replayData;
        const nextPack = packs[index];
        if (nextPack) {
            const nextData = transToReplayData(nextPack);
            Store.dispatch({ type: ReplayDataReducerTypes.UPDATE_DATA, data: { currentData: nextData } });
            return nextData;
        }
        return null;
    }
    loopFramesByTime(currTime, isJumping = false) {
        let nextTime = this.frames[this.frameIndex];
        while (nextTime && currTime >= nextTime) {
            if (!isJumping) {
                observer.emit(PlayerEventTypes.PROGRESS, this.frameIndex, this.frames.length - 1);
            }
            this.frameIndex++;
            this.renderEachFrame();
            nextTime = this.frames[this.frameIndex];
        }
        return nextTime;
    }
    play() {
        if (this.frameIndex === 0) {
            this.progress.moveThumb();
            if (!this.isFirstTimePlay) {
                this.getNextReplayData(0);
                this.initViewState();
                this.setViewState();
            }
            else {
                this.progress.drawHeatPoints();
            }
        }
        this.playAudio();
        this.isFirstTimePlay = false;
        if (this.RAF && this.RAF.requestID) {
            this.RAF.stop();
        }
        this.RAF = new AnimationFrame(loop.bind(this), this.maxFps);
        this.options.destroyStore.add(() => this.RAF.stop());
        this.RAF.start();
        this.initTime = getTime();
        this.startTime = this.frames[this.frameIndex];
        function loop(t, loopIndex) {
            return __awaiter(this, void 0, void 0, function* () {
                const timeStamp = getTime() - this.initTime;
                if (this.frameIndex > 0 && this.frameIndex >= this.frames.length) {
                    this.stop();
                    return;
                }
                const currTime = this.startTime + timeStamp * this.speed;
                const nextTime = this.loopFramesByTime(currTime);
                if (nextTime > this.curViewEndTime - this.curViewDiffTime && this.viewIndex < this.viewsLength - 1) {
                    const { packsInfo } = Store.getState().progress;
                    const index = this.viewIndex + 1;
                    const { startTime, diffTime } = packsInfo[index];
                    this.jump({ index: index, time: startTime - diffTime });
                }
                this.elapsedTime = (currTime - this.frames[0]) / 1000;
                this.syncAudio();
                this.syncVideos();
            });
        }
    }
    playAudio() {
        if (!this.audioData) {
            return;
        }
        if (!this.audioBlobUrl) {
            this.pauseAudio();
            return;
        }
        if (this.audioNode) {
            if (!this.audioNode.src || this.audioNode.src !== this.audioBlobUrl) {
                this.audioNode.src = this.audioBlobUrl;
            }
            this.syncAudioTargetNode();
            if (this.speed > 0) {
                this.audioNode.play();
            }
        }
    }
    syncAudio() {
        if (!this.audioNode) {
            return;
        }
        const targetCurrentTime = this.audioNode.currentTime;
        const targetExpectTime = this.elapsedTime - this.preViewsDurationTime / 1000;
        const diffTime = Math.abs(targetExpectTime - targetCurrentTime);
        const allowDiff = (100 + this.audioOffset) / 1000;
        if (diffTime > allowDiff) {
            this.syncAudioTargetNode();
        }
    }
    syncAudioTargetNode() {
        const elapsedTime = this.elapsedTime - this.preViewsDurationTime / 1000;
        const offset = this.audioOffset / 1000;
        this.audioNode.currentTime = elapsedTime + offset;
    }
    syncVideos() {
        const initTime = this.curViewStartTime;
        const currentTime = initTime + (this.elapsedTime * 1000 - this.preViewsDurationTime);
        const allowDiff = 100;
        this.videos.forEach(video => {
            const { startTime, endTime, id } = video;
            const target = nodeStore.getNode(id);
            if (!target) {
                return;
            }
            if (currentTime >= startTime && currentTime < endTime) {
                if (target.paused && this.speed > 0) {
                    target.play();
                }
                const targetCurrentTime = target.currentTime;
                const targetExpectTime = this.elapsedTime - this.preViewsDurationTime / 1000 - (startTime - initTime) / 1000;
                const diffTime = Math.abs(targetExpectTime - targetCurrentTime);
                if (diffTime > allowDiff / 1000) {
                    target.currentTime = targetExpectTime;
                }
            }
            else {
                if (!target.paused) {
                    target.pause();
                }
            }
        });
    }
    pauseAudio() {
        if (this.audioNode) {
            this.audioNode.pause();
        }
    }
    pauseVideos() {
        if (this.videos && this.videos.length) {
            this.videos.forEach(video => {
                const target = nodeStore.getNode(video.id);
                if (target) {
                    target.pause();
                }
            });
        }
    }
    renderEachFrame() {
        this.progress.updateTimer(this.frameIndex, this.frameInterval, this.curViewDiffTime);
        let data;
        while (this.recordIndex < this.records.length &&
            (data = this.records[this.recordIndex]).time - this.curViewDiffTime <= this.frames[this.frameIndex]) {
            this.execFrame(data);
            this.recordIndex++;
        }
        this.syncSubtitles();
    }
    syncSubtitles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.shouldWaitForSync) {
                return;
            }
            if (this.audioData && this.audioData.subtitles.length) {
                const subtitles = this.audioData.subtitles;
                let { text } = subtitles[this.subtitlesIndex];
                const { end } = subtitles[this.subtitlesIndex];
                const audioEndTime = toTimeStamp(end);
                if (this.elapsedTime > audioEndTime / 1000) {
                    this.broadcaster.cleanText();
                    if (this.subtitlesIndex < subtitles.length - 1) {
                        while (true) {
                            const nextEndTime = toTimeStamp(subtitles[this.subtitlesIndex].end);
                            if (nextEndTime / 1000 > this.elapsedTime) {
                                break;
                            }
                            this.subtitlesIndex++;
                        }
                        text = subtitles[this.subtitlesIndex].text;
                    }
                }
                this.broadcaster.updateText(text);
            }
        });
    }
    pause(emit = true) {
        if (this.RAF) {
            this.RAF.stop();
        }
        Store.dispatch({
            type: PlayerReducerTypes.SPEED,
            data: {
                speed: 0
            }
        });
        this.pauseAudio();
        this.pauseVideos();
        if (emit) {
            observer.emit(PlayerEventTypes.PAUSE);
        }
    }
    stop() {
        this.speed = 0;
        this.recordIndex = 0;
        this.frameIndex = 0;
        this.elapsedTime = 0;
        this.pause();
        this.audioNode.currentTime = 0;
        observer.emit(PlayerEventTypes.STOP);
    }
    execFrame(record) {
        const { isJumping, speed } = this;
        renderAll.call(this, record, { isJumping, speed });
    }
    calcFrames(maxInterval = this.maxFrameInterval) {
        if (this.options.mode === 'live') {
            return [];
        }
        const preTime = this.frames && this.frames[this.frameIndex];
        const { duration, startTime, endTime } = Store.getState().progress;
        this.frameInterval = Math.max(20, Math.min(maxInterval, (duration / 60 / 1000) * 60 - 40));
        const interval = this.frameInterval;
        const frames = [];
        let nextFrameIndex;
        for (let i = startTime; i < endTime + interval; i += interval) {
            frames.push(i);
            if (!nextFrameIndex && preTime && i >= preTime) {
                nextFrameIndex = frames.length - 1;
            }
        }
        frames.push(endTime);
        if (nextFrameIndex) {
            this.frameIndex = nextFrameIndex;
        }
        this.frames = frames;
    }
    calcHeatPointsData() {
        const frames = this.frames;
        if (!(frames === null || frames === void 0 ? void 0 : frames.length) || !this.options.heatPoints) {
            return [];
        }
        const state = Store.getState();
        const { packs } = state.replayData;
        const { duration } = state.progress;
        const sliderWidth = this.progress.slider.offsetWidth;
        const column = Math.floor(sliderWidth / 7);
        const gap = duration / column;
        const heatPoints = packs.reduce((acc, records) => {
            let index = 0;
            let step = 0;
            let snapshot = false;
            const endTime = records.slice(-1)[0].time;
            let currentTime = records[0].time;
            while (currentTime < endTime && index < records.length) {
                const nextTime = currentTime + gap;
                const record = records[index];
                if (record.time < nextTime) {
                    index++;
                    step++;
                    if (isSnapshot(record)) {
                        snapshot = true;
                    }
                    continue;
                }
                acc.push({ step, snapshot });
                step = 0;
                snapshot = false;
                currentTime += gap;
            }
            return acc;
        }, []);
        return heatPoints;
    }
    orderRecords(records) {
        if (!records.length) {
            return [];
        }
        records.sort((a, b) => {
            return a.time - b.time;
        });
        return records;
    }
    recalculateProgress() {
        this.calcFrames();
        this.progress.drawHeatPoints(this.calcHeatPointsData());
    }
    processing(records) {
        return this.orderRecords(records);
    }
};
__decorate([
    ConnectProps(state => ({
        speed: state.player.speed
    }))
], PlayerComponent.prototype, "watchPlayerSpeed", null);
__decorate([
    ConnectProps(state => ({
        endTime: state.progress.endTime
    }))
], PlayerComponent.prototype, "watchProgress", null);
PlayerComponent = __decorate([
    Component('timecat-player', html `<div class="timecat-player">
        <iframe
            class="player-sandbox"
            sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
    </div>`)
], PlayerComponent);

let PointerComponent = class PointerComponent {
    constructor(c) {
        this.x = 0;
        this.y = 0;
        this.c = c;
        this.initPointer();
        this.togglePointer(true);
    }
    initPointer() {
        this.pointer = this.c.container.querySelector('.player-pointer');
    }
    togglePointer(show = !this.show) {
        this.show = show;
        this.pointer.firstElementChild.style.display = this.show ? 'inherit' : 'none';
    }
    hidePointer() {
        this.togglePointer((this.show = false));
    }
    move(x, y) {
        this.x = x;
        this.y = y;
        this.pointer.style.left = this.x + 'px';
        this.pointer.style.top = this.y + 'px';
    }
    click(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            this.move(x, y);
            if (this.pointer.hasAttribute('active')) {
                return;
            }
            yield delay(200);
            setAttribute(this.pointer, 'active', '');
            yield delay(400);
            setAttribute(this.pointer, 'active', null);
        });
    }
};
PointerComponent = __decorate([
    Component('player-pointer', html `<div class="player-pointer">
        <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAACACAQAAAAhBLbAAAAMkklEQVR42u2ceXAb5RXAfyvJh2xLcqw4dmQ7thPbOSGEOLJbjtIUBgi0wxSmMNNSoDTQMrRAIIUm8E+HuwfD0OkwPZgGUmiBNswUmvhIoBkIsS0DCTShSYAcxHYS27ItW7e0/UOr9a7sla3Tnqnfjjz77fft6uent+977+0BczInczInczInWRYBQf47a0RIqE+cadypoAXpI6KTgMXZgq2LiyyWFK4wEyIHPTp0s81MJkLrMEBx7WdtVzUAJozkYkA3m7EF9OSAYB4LiM6aYqCEQvJmN7YOPXkIwvxTvaJ4+COzBVhAEfnkzF5sAQNGcgTbqV5RFMXDn5hLgXJMsxdbQEcOheQL1af6RFEURfHTQ2YbAgsV2DMGrovTF0GX0JYu73rbXMkZishBj34mda0NLUgeRIZraHDsNlfJ2DOoa13cXkHdX1/vaLcs4ixF5Eh+ZEawp4KOwaqv69o989i6RHeoX9zVVlzDuZnEngp6EqD6JZ0tJTWytvXZx57KPCaV+iUdLdZaCVuffeyEzSMidYs7W621KgeYRfAEoN+lQ9FaXOtosy6O8dtZwk4A+gDNnFK0a2q62+cvmYnpJgFoG7CWHsWW6mpH+/y67E83Cdr0ORr5Uom9qLu9tI4zmLLpABM+EXu5BKeivajK0V7aQF82HWAS3uM4zTHYXa1lS2M8yWyDhiM0MaBoV1d1tpRHsHOzgZ2knz4ag72oqqvVtow+CrPht5OEhs+wq7ArK7tabcsl286w304aGj6nUYVtq3C02ZbThynT2ClAw3HW0q9oL7Q5dttW0Kuw7YxIStBwgkY1dnn3bttKFXYGwFOEhhOs45yiXV7W3VZxHr0UZg47ZWg4jp0zSuxyR2tlFDsj000aoOE4TfSpsLtaFp1Pb6amm7RAwwma6FVhd7ZUr6ZHZSRpA08TNJzErsIuK+9qrblAZdtpc4Bpg4YvaVRhly5wRLCL0o2dRmjoYa0K21rqaK9ZQw9F8imZFuy0QkNvTJpgtXa3166RTklDuqabNENDL40q7JKSfW/aooFrmhxg2qEj2MrsptzmaLXVpxM7A9DQi52TivbCqq7WijRiZwQaemnihKJtq+psrWpIV50kQ9DQh53jauyWRersJmlPkjFoOMs6FXZ5VVdL9bJ0YGcQGvpjsBdUOlqql9GXqt/OKDT006jCnl/haK1eoSo4JCEZhoaBWGybo616ZWp1koxDR7A/V2KXd7fVpISdBWgYwM5nira1zNFauyp57KxAwwBNHFVil3e1LF6likkSAM8SdAT7iAq7s6Xu/JhQaprYWYMGJ3b+G4Ndf0Ey5Z0sQsMwdpW255V17WpYLaUJCWg7q9AwwjoVtmVBZ0vDGnql+vY0/XaWoSPYSiOxlHa1NkSym2l7kqxDwwh2PlW0zdautoYLYzzJbIOOYB9SYpd0tSy9UJFLTnE/yYxAg4tmlZGYrZ0tyxvpoVBx7UYTfIagwcVlqgt8ZmvHrhWNKtvW9CQzBh1JE5TZjcna0bLKTg+mqRzgDEJPzG6KSjp2ntfEabl0qZsce0ahJ2Y3BSX7d53XLJ+SGrY9w9DQTy1tSuzijl3nNXMaE3laoZQhk0DzuZ1RgnHH5HCQ3Vyh2GK0dLTYr/pkPzZAIEgImMZdrgI6cjFhEVadOidK8g+RhJducToSFsMxW9zD538VgSrmUUBu7ISTYfO4Z1qjJpqt0dyxc/VXOCUVinXqUzLD0O/y1yT3zDd37FzTzJcUTLx1MU3QC5iv0fN40sfMM3/wzqVX0DPxtty0QFs5zcMafR/zvKIVCA6PESYkLWHVElIsQYIEyHvnxSY7ThlZAk+D97DSgYFbeJyzGrr+AbnSeo7h7pe2d9ZaQ34hRGjSu99FREJCEJ/gDYzUlrgMFEojhOjIlKEr2UcVUMxmNk864hS/YovcunXd9te/OEsQPwFChCdxZWFEQvjx4fnShQEjY+oBKZpHDR9SJa1volZj1NOKq7rfWHXLFZxDT5gQAfyTLAHJN+vJw4SAT/rX5H8vJeilOBQnoI6tGuOGeUrRevg6vZEBxhhhGCdOBlXLAIMM4mSYEUZx4yNISAIWU4a+kANYVVtuZ43G2GcVxZq6mnuv5CQB3LhwMRyzjEh/RxhlDA8+goTVZpQ09FreJ2/CVi1dB1S63nKzpRInIfx48eDGzZhicePGjQcPXvwECMinbGrQ63HIHkEp1/N1jT3+wEfyeknpz79DPzpEQgQJ4JvUtqPA4VibnlymiD3WxwYPofHgoU0zDrlBGVuMVl5COZUUY5SfolEvkZvOhcmivCQ0fQO7VW2X52vPvSMX6i7nOo39Xudted1YuOU23KonZ0RE1VQT3SaqTSMpTd8Yo2SPr+kxLrrl9+NbHJq6Vv1CwVVXMp9KisnHkFjdNAFNh4GbYwKgMW/jIx3vUb+ttVtOrtdym8YR9rBjvKHfupEQuXL2nYAkAH2CDbwYg2zf+p9uivFw5rG/jW/fqnkMZfh00/UXrcdJPoZEnwtLAPqWGC33j6y+/1A3ZgYZJG/Hzrf3R3uWcJ/GMRz8WdHaupEcDIk/E5YAtBWTonV2aO2mzw5ixomTIdw4H31pvHezaqxa12F5/eorr9lAP/lZqk/3Ou2bTx7FgpMhaRYr2tP299Zo/0Ie0NjzKM8qWg/fiQVBkZ1kDvrT3lU/PXEEE06GGMGFCxceAk+8MD7mfio19n4Sl7ze3Pz96+jHKD8PlqlS7+Ee+/2DpyjCKcUHkSl3DFP3vj+9Fh1VyM809j/LLxWth35MGSFypCkmM5o+cNL+gKuHIobkkMaPDx9ePBge3xb0R0f+hGUax/i14o6Q5SvuuokBjHK1NOUrARNmon1H19w32kchgxKyV4p/A/jxUvj5h79RnI5ars/NE4rWljsKa/FLdp0WTauw3zty8YPiEEacjOBiDC8BOasL4MdDwVMvj8h3hH+PJo3D/pbD8npF9aabccoxSHqvBLR+fPED4hB5kpbdeKUcIxI1RAJN4+DhJ7eN7/OI5tGU08yDd5Stwj39m2qn1rSk6ze7r7yX0QnIYTmyCBHEzxjFz7x6Ur6t5hqu0jjwduS5iMKSh27FRf50dT2VTUvIb+3/5j2EMDAg23IUOWJCYcJSZKz3nnhCoWvtKf0XivW7f7jYjkua0qd0fdrQ0o8u6OC1f117B2H0OHFJeZtfoWWkT8Su3cx7fscB+UrQxdyo8QU72SuvG/Ie2YhPCp+SvKEi+oytUVcnhvbuYSGruZg1NFCJlaJJHsUWENCTjwUbK6m86YHxGPTgpGHqInGb6FcFues2YKECM3lTXeHSa0ALkWm1oko/dPtDfiMFuKRpJJIdT6xXRGtAOgTMnxxZ31gtTYllnMGhGlrMs2xndcyXl1te2YFRSmOTEh0G8jHryvT5LGQZS1hEGfOkCwuT6UFAwEAeFhayjMrL7xzX4UkxR9Zwrvj4hMJuVL61ESOlFJEbP+rTa/YICAhiWMxHj09a/HINQpx0j+hHh+Xzo6uXLV8S6bDg4V0ANrGL9Ro8b+35S+vAgFRGn2aKFQsQ0XUhZoopxkyR5P7jWZuAnjzMlLGU6nXfHddhj2gWrxXPiVryxvv1G6mmgWUswCSV0eN8TRw9S5YdeWGGSAiRMPFSeQHQk0M+JiwMv/DMbd+OdIi4KNJwVTsP3P/y4b2EyWeYYUbxECAYT9dC3O1RnymCyr3FO1rkLQoFmAk3rDz8mi43znj+fWjTqx/sJUyBVG8aw42PgORONUQf54hK2OghprK0cR+iwzTwxbzS5gu0hnYdu+F3jz7f+wUmRCmWic4AU5QN4rtxde/0Tg1B1rUJYX7Nsdct5omDjpy+65Xd7fgw4WcMD268ePEpCsBxvi2eppOTqK4FdJjcJwxF62NCvb7Bjdt+9OwXBylEh0vKfNyylievWSeg6WSxIx7biAlDvvXYqxUV0a5R95Ydz73BGcyEGcONF49UyQvKwFPW7dKvabW/Lgie9uVuuBQgFHjynxuefr8dHfmMMoJLSta8Ch0zNXKmHr6LRCK5GCkil5xjbyyp++POza8MHcOMgTE8qkJuQK7eTfP9Q5mD1mEglwLM+K6+LGBpb8OKCQ9eCdhHQEoiEgLOJHT0VT15GLEwgoEKkDLJqDkEkgHOHHTkyDoJO488cqUSekACDsrF8iReSZXJuxBEwgSBMEG8CCBd1EwJOBvQkRk1KIUdkeuyKQFDZl+5EH3/23iqKsakaCkcOJMiKD7KEy6lF6tl/s0Fsd8wK94DNydzMif/n/I/5OjlEWH8JT8AAAAASUVORK5CYII="
            alt="pointer"
        />
        <div class="spinner"></div>
    </div>`)
], PointerComponent);

let ProgressComponent = class ProgressComponent {
    constructor(options, c) {
        this.heatPoints = [];
        this.findProgressByPosition = (() => {
            const cacheMap = new Map();
            return function (percent) {
                const result = cacheMap.get(percent);
                if (result) {
                    return result;
                }
                const { startTime, duration, packsInfo } = Store.getState().progress;
                const { packs } = Store.getState().replayData;
                const time = startTime + duration * percent;
                const index = packsInfo.findIndex(pack => {
                    const { startTime, endTime, diffTime } = pack;
                    if (startTime - diffTime <= time && endTime - diffTime >= time) {
                        return true;
                    }
                });
                if (index !== undefined) {
                    const records = packs[index];
                    const packInfo = packsInfo[index];
                    const { startTime, diffTime } = packInfo;
                    const totalDurationTime = packsInfo.reduce((acc, info) => acc + info.duration, 0);
                    const beforeDurationTime = packsInfo.slice(0, index).reduce((acc, info) => acc + info.duration, 0);
                    for (let i = 0; i < records.length; i++) {
                        const cur = records[i];
                        const next = records[i + 1];
                        if (next) {
                            if (time >= cur.time - diffTime && time <= next.time - diffTime) {
                                const reviseTime = totalDurationTime * percent - (cur.time - startTime) - beforeDurationTime;
                                const time = cur.time - diffTime + reviseTime;
                                const data = { index, percent, time };
                                cacheMap.set(percent, data);
                                return data;
                            }
                        }
                    }
                }
                return null;
            };
        })();
        this.listenElementOnHover = (target) => stateDebounce(setState => {
            const stateIn = () => setState('in');
            const stateOut = () => setState('out');
            target.addEventListener('mouseover', stateIn, false);
            target.addEventListener('mouseout', stateOut, false);
            this.options.destroyStore.add(() => {
                target.removeEventListener('mouseover', stateIn, false);
                target.removeEventListener('mouseout', stateOut, false);
            });
        }, state => (state === 'in' ? 200 : 1000), 'out');
        this.options = options;
        this.c = c;
        this.progress = c.container.querySelector('.player-progress');
        this.progress = c.container.querySelector('.player-progress');
        this.timer = c.container.querySelector('.player-timer');
        this.currentProgress = this.progress.querySelector('.player-current-progress');
        this.slider = this.progress.querySelector('.player-slider-bar');
        this.heatBar = this.progress.querySelector('.player-heat-bar');
        this.thumb = this.progress.querySelector('.player-thumb');
        this.listenElementOnHover(this.parent)(state => {
            if (state === 'in') {
                this.thumb.setAttribute('active', '');
                return;
            }
            this.thumb.removeAttribute('active');
        });
        const handle = (e) => {
            const { left, width: sliderWidth } = this.slider.getBoundingClientRect();
            const width = Math.max(0, Math.min(e.x - left, sliderWidth));
            const percent = +(width / sliderWidth).toFixed(3);
            const progress = this.findProgressByPosition(percent);
            observer.emit(PlayerEventTypes.JUMP, progress);
        };
        this.progress.addEventListener('click', handle, false);
        this.options.destroyStore.add(() => {
            this.progress.removeEventListener('click', handle, false);
        });
    }
    updateTimer(frameIndex, frameInterval, curViewDiffTime) {
        const c = this.c.options;
        const { timeMode } = c;
        const seconds = (frameIndex + 1) * frameInterval;
        let time;
        if (timeMode === 'durationTime') {
            time = secondToTime(seconds / 1000);
        }
        else {
            const { startTime } = Store.getState().progress;
            const timestamp = startTime + seconds + curViewDiffTime;
            time = getDateTime(timestamp);
        }
        if (time !== this.timer.innerText) {
            this.timer.innerText = time;
        }
    }
    moveThumb(percent = 0) {
        const left = percent * this.slider.offsetWidth;
        this.currentProgress.style.width = left + 'px';
    }
    drawHeatPoints(points) {
        if (points) {
            if (isPointsEqual(this.heatPoints, points)) {
                return;
            }
            this.heatPoints = points;
        }
        else if (this.heatPoints.length) {
            return;
        }
        if (this.heatPoints.length) {
            new Pillar(this.heatBar, this.heatPoints);
        }
        else {
            new NormalLine(this.heatBar);
        }
        function isPointsEqual(a, b) {
            if (a.length !== b.length) {
                return false;
            }
            for (let i = 0; i < a.length; i++) {
                const itemA = a[i];
                const itemB = b[i];
                if (itemA.step !== itemB.step || itemA.snapshot !== itemB.snapshot) {
                    return false;
                }
            }
            return true;
        }
    }
    setProgressPosition(percent) {
        this.currentProgress.style.width = this.slider.offsetWidth * percent + 'px';
    }
};
ProgressComponent = __decorate([
    Component('player-progress', html `<div class="player-progress">
        <div class="player-timer">00:00</div>
        <div class="player-slider-bar">
            <div class="player-heat-bar-container">
                <canvas class="player-heat-bar"></canvas>
            </div>
            <div class="player-current-progress">
                <div class="player-thumb"></div>
            </div>
        </div>
    </div>`)
], ProgressComponent);

let BroadcasterComponent = class BroadcasterComponent {
    constructor(container) {
        this.c = container;
        this.init();
    }
    init() {
        this.broadcaster = this.c.container.querySelector('.player-broadcaster');
        this.floatLayer = this.broadcaster.firstElementChild;
        this.subtitle = this.floatLayer.firstElementChild;
    }
    updateText(text) {
        text = text.trim();
        if (this.subtitle.innerText.trim() === text) {
            return;
        }
        this.subtitle.innerText = text;
        this.floatLayer.toggleAttribute('hidden', !text);
    }
    cleanText() {
        this.updateText('');
    }
};
BroadcasterComponent = __decorate([
    Component('player-broadcaster', html `<div class="player-broadcaster">
        <div class="float-layer" hidden>
            <span class="subtitle"></span>
        </div>
    </div>`)
], BroadcasterComponent);

let ToolboxComponent = class ToolboxComponent {
    constructor(options, c) {
        this.options = options;
        this.c = c;
        this.exportBtn = this.target.querySelector('.player-export');
        this.exportBtn.addEventListener('click', this.export);
        this.fullscreenBtn = this.target.querySelector('.player-fullscreen');
        this.fullscreenTarget = this.c.container.parentNode.host.parentElement;
        this.fullscreenTarget.addEventListener('fullscreenchange', () => this.cancelFullScreen());
        this.fullscreenBtn.addEventListener('click', () => this.setFullScreen());
        this.options.destroyStore.add(() => {
            this.exportBtn.removeEventListener('click', this.export);
            this.fullscreenTarget.removeEventListener('fullscreenchange', () => this.cancelFullScreen());
            this.fullscreenBtn.removeEventListener('click', () => this.setFullScreen());
        });
    }
    export() {
        return __awaiter(this, void 0, void 0, function* () {
            const SDKScript = document.querySelector('#timecat');
            const initScript = document.querySelector('#timecat-init');
            const scriptList = [];
            const scripts = document.querySelectorAll('script');
            function detectSDKSrc() {
                return Array.from(scripts)
                    .map(script => script.src)
                    .find(src => /(timecat)(\.prod)?\.global\.js/.test(src));
            }
            function detectSDKContent() {
                return Array.from(scripts)
                    .map(script => script.textContent)
                    .find(content => content === null || content === void 0 ? void 0 : content.trim().startsWith('var TimeCat'));
            }
            function detectInitScriptContent() {
                return Array.from(scripts)
                    .map(script => script.textContent)
                    .find(content => {
                    if (content) {
                        return /new\s(TimeCat\.)?Player/.test(content);
                    }
                });
            }
            function getScriptSource(scriptElement) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!scriptElement) {
                        return;
                    }
                    return (scriptElement.textContent || (yield getRawScriptContent(scriptElement.src.trim())) || scriptElement.src);
                });
            }
            const defaultSDK = `//cdn.jsdelivr.net/npm/timecatjs/dist/timecat.global.prod.js`;
            const SDKSource = (yield getScriptSource(SDKScript)) || detectSDKSrc() || detectSDKContent() || defaultSDK;
            scriptList.push({
                name: 'timecat',
                src: SDKSource
            });
            const defaultInitScript = `new window.TimeCat.Player({autoplay: true})`;
            const source = (yield getScriptSource(initScript)) || detectInitScriptContent() || defaultInitScript;
            scriptList.push({
                name: 'timecat-init',
                src: source
            });
            const replayOptions = Store.getState().player.options;
            exportReplay(Object.assign(Object.assign({}, replayOptions), { scripts: scriptList }));
        });
    }
    setFullScreen() {
        this.c.resize({ maxScale: 100 });
        this.fullscreenTarget.requestFullscreen().catch(msg => {
            logError(msg);
            logAdvice('If the Player within the iframe, you should be set the attribute: allowfullscreen');
        });
    }
    cancelFullScreen() {
        if (document.fullscreen) {
            return;
        }
        this.c.resize({ maxScale: 0 });
    }
};
ToolboxComponent = __decorate([
    Component('player-toolbox', html `<div class="player-toolbox">
        <div class="player-export">
            <button type="button">
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="16px"
                    height="16px"
                    viewBox="0 0 511.994 511.994"
                    style="enable-background:new 0 0 511.994 511.994;"
                    xml:space="preserve"
                >
                    <path
                        style="fill:#fff;"
                        d="M403.079,310.458c-3.627-7.232-11.008-11.797-19.093-11.797h-64v-85.333c0-11.776-9.536-21.333-21.333-21.333H213.32
            c-11.776,0-21.333,9.557-21.333,21.333v85.333h-64c-8.064,0-15.445,4.565-19.072,11.797c-3.605,7.232-2.837,15.872,2.027,22.336
            l128,170.667c4.011,5.376,10.347,8.533,17.045,8.533c6.72,0,13.056-3.157,17.067-8.533l128-170.667
            C405.917,326.33,406.685,317.69,403.079,310.458z"
                    />
                    <path
                        style="fill:#fff;"
                        d="M298.663,128.001H213.33c-11.797,0-21.333,9.536-21.333,21.333c0,11.797,9.536,21.333,21.333,21.333h85.333
                        c11.797,0,21.333-9.536,21.333-21.333C319.996,137.537,310.46,128.001,298.663,128.001z"
                    />
                    <path
                        style="fill:#fff;"
                        d="M298.663,64.001H213.33c-11.797,0-21.333,9.536-21.333,21.333s9.536,21.333,21.333,21.333h85.333
                        c11.797,0,21.333-9.536,21.333-21.333S310.46,64.001,298.663,64.001z"
                    />
                </svg>
            </button>
        </div>
        <div class="player-fullscreen">
            <svg
                version="1.1"
                id="Capa_1"
                width="16px"
                height="16px"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 469.333 469.333"
                style="enable-background:new 0 0 469.333 469.333;"
                xml:space="preserve"
            >
                <path
                    style="fill:#fff;"
                    d="M160,0H10.667C4.771,0,0,4.771,0,10.667V160c0,5.896,4.771,10.667,10.667,10.667H32c5.896,0,10.667-4.771,10.667-10.667
                V42.667H160c5.896,0,10.667-4.771,10.667-10.667V10.667C170.667,4.771,165.896,0,160,0z"
                />
                <path
                    style="fill:#fff;"
                    d="M458.667,0H309.333c-5.896,0-10.667,4.771-10.667,10.667V32c0,5.896,4.771,10.667,10.667,10.667h117.333V160
                c0,5.896,4.771,10.667,10.667,10.667h21.333c5.896,0,10.667-4.771,10.667-10.667V10.667C469.333,4.771,464.563,0,458.667,0z"
                />
                <path
                    style="fill:#fff;"
                    d="M458.667,298.667h-21.333c-5.896,0-10.667,4.771-10.667,10.667v117.333H309.333c-5.896,0-10.667,4.771-10.667,10.667
                v21.333c0,5.896,4.771,10.667,10.667,10.667h149.333c5.896,0,10.667-4.771,10.667-10.667V309.333
                C469.333,303.437,464.563,298.667,458.667,298.667z"
                />
                <path
                    style="fill:#fff;"
                    d="M160,426.667H42.667V309.333c0-5.896-4.771-10.667-10.667-10.667H10.667C4.771,298.667,0,303.437,0,309.333v149.333
                c0,5.896,4.771,10.667,10.667,10.667H160c5.896,0,10.667-4.771,10.667-10.667v-21.333
                C170.667,431.438,165.896,426.667,160,426.667z"
                />
            </svg>
        </div>
    </div>`)
], ToolboxComponent);

let PanelComponent = class PanelComponent {
    constructor(c) {
        this.c = c;
        this.options = c.options;
        if (this.options.hidePanel) {
            this.target.style.display = 'none';
        }
        this.initComponent();
    }
    initComponent() {
        new ToolboxComponent(this.options, this.c);
        this.keyboard = new KeyboardComponent(this.options, this.c);
        this.progress = new ProgressComponent(this.options, this.c);
        this.pointer = new PointerComponent(this.c);
        this.broadcaster = new BroadcasterComponent(this.c);
        this.player = new PlayerComponent(this.options, this.c, this.pointer, this.progress, this.broadcaster);
    }
};
PanelComponent = __decorate([
    Component('player-panel', html `<div class="player-panel">
        <slot></slot>
    </div>`)
], PanelComponent);

let PageStartComponent = class PageStartComponent {
    constructor() {
        setTimeout(() => { });
    }
};
PageStartComponent = __decorate([
    Component('player-start-page', html `<div class="player-start-page" style="display: none;">
        <div class="play-btn">
            <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 142.448 142.448"
                style="enable-background:new 0 0 142.448 142.448;"
                xml:space="preserve"
            >
                <g>
                    <path
                        style="fill:#bbb;"
                        d="M142.411,68.9C141.216,31.48,110.968,1.233,73.549,0.038c-20.361-0.646-39.41,7.104-53.488,21.639
        C6.527,35.65-0.584,54.071,0.038,73.549c1.194,37.419,31.442,67.667,68.861,68.861c0.779,0.025,1.551,0.037,2.325,0.037
        c19.454,0,37.624-7.698,51.163-21.676C135.921,106.799,143.033,88.377,142.411,68.9z M111.613,110.336
        c-10.688,11.035-25.032,17.112-40.389,17.112c-0.614,0-1.228-0.01-1.847-0.029c-29.532-0.943-53.404-24.815-54.348-54.348
        c-0.491-15.382,5.122-29.928,15.806-40.958c10.688-11.035,25.032-17.112,40.389-17.112c0.614,0,1.228,0.01,1.847,0.029
        c29.532,0.943,53.404,24.815,54.348,54.348C127.91,84.76,122.296,99.306,111.613,110.336z"
                    />
                    <path
                        style="fill:#bbb;"
                        d="M94.585,67.086L63.001,44.44c-3.369-2.416-8.059-0.008-8.059,4.138v45.293
        c0,4.146,4.69,6.554,8.059,4.138l31.583-22.647C97.418,73.331,97.418,69.118,94.585,67.086z"
                    />
                </g>
            </svg>
        </div>
    </div>`)
], PageStartComponent);

class ContainerComponent {
    constructor(options) {
        this.options = options;
        this.init();
    }
    init() {
        const target = this.options.target;
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        this.target = targetElement;
        this.initTemplate();
        this.initSandbox();
        const { resize } = this.makeItResponsive();
        this.resize = resize;
        this.initPanel();
        setTimeout(() => observer.emit(PlayerEventTypes.INIT));
    }
    initPanel() {
        this.panel = new PanelComponent(this);
        new PageStartComponent();
    }
    initSandbox() {
        this.sandBox = this.container.querySelector('.player-sandbox');
        this.sandBoxDoc = this.sandBox.contentDocument;
        this.setSmoothScroll(this.sandBox.contentWindow);
        createIframeDOM(this.sandBoxDoc, this.getSnapshotRecord());
        if (this.options.disableScrolling) {
            disableScrolling(this.sandBox.contentWindow.document);
        }
        this.setViewState();
    }
    getSnapshotRecord() {
        return Store.getState().replayData.currentData.snapshot.data;
    }
    setSmoothScroll(context) {
        smoothScroll.polyfill();
        context.HTMLElement.prototype.scroll = window.scroll;
        context.HTMLElement.prototype.scrollTo = window.scrollTo;
    }
    setViewState() {
        nodeStore.reset();
        const recordData = this.getSnapshotRecord();
        const { pathname, hash, href } = createURL(recordData.href);
        const doc = this.sandBoxDoc;
        const context = doc.defaultView;
        context.G_REPLAY_LOCATION = Object.assign(Object.assign({}, (context.G_REPLAY_LOCATION || {})), { path: pathname, hash, href });
        injectIframeContent(this.sandBoxDoc, recordData);
    }
    initTemplate() {
        const targetElement = this.target instanceof Window ? this.target.document.body : this.target;
        const shadowHost = parseHtmlStr(html `<div class="player-shadowhost"></div>`)[0];
        targetElement.appendChild(shadowHost);
        const shadow = shadowHost.attachShadow({ mode: 'open' });
        shadow.appendChild(this.createStyle('player-css', CSS));
        shadow.appendChild(this.createContainer('player-main', HTML));
        this.shadowHost = shadowHost;
    }
    createContainer(className, html) {
        const parser = new DOMParser();
        const el = parser.parseFromString(html, 'text/html').body.firstChild;
        el.className = className;
        el.style.width = this.getSnapshotRecord().width + 'px';
        el.style.height = this.getSnapshotRecord().height + 'px';
        el.style.display = 'none';
        return (this.container = el);
    }
    makeItResponsive() {
        const self = this;
        const debounceResizeFn = debounce(resizeHandle, 500);
        const callbackFn = () => debounceResizeFn({ target: self.target });
        window.addEventListener('resize', callbackFn, true);
        this.options.destroyStore.add(() => window.removeEventListener('resize', callbackFn, true));
        setTimeout(() => (this.container.style.opacity = '1'));
        this.container.style.display = 'block';
        let lockScale = 0;
        triggerResize();
        function triggerResize(options) {
            const { setHeight, setWidth, maxScale } = options || {};
            resizeHandle({ target: self.target }, setWidth, setHeight, maxScale);
        }
        function resizeHandle(e, setWidth, setHeight, maxScale = 1) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!e) {
                    return;
                }
                const { width: targetWidth, height: targetHeight } = getPageSize(self.container);
                setWidth = setWidth || targetWidth;
                setHeight = setHeight || targetHeight;
                switch (maxScale) {
                    case 0:
                        lockScale = 0;
                        break;
                    case 100:
                        lockScale = 100;
                        break;
                }
                const setMaxScale = lockScale || maxScale;
                if (e.target instanceof Window) {
                    const { innerWidth: w, innerHeight: h } = e.target;
                    scalePages(self.container, w, h, setWidth, setHeight, setMaxScale);
                }
                else {
                    const { offsetWidth: w, offsetHeight: h } = e.target;
                    scalePages(self.container, w, h, setWidth, setHeight, setMaxScale);
                }
            });
        }
        function scalePages(target, maxWidth, maxHeight, setWidth, setHeight, setMaxScale) {
            const { mode: replayMode } = Store.getState().player.options || {};
            const panelHeight = replayMode === 'live' ? 0 : 40 - 2;
            const scaleX = maxWidth / setWidth;
            const scaleY = maxHeight / (setHeight + panelHeight);
            const scale = Math.min(scaleX > scaleY ? scaleY : scaleX, setMaxScale || 1);
            const left = (setWidth * scale - setWidth) / 2 + (maxWidth - setWidth * scale) / 2;
            const top = (maxHeight - setHeight - panelHeight * scale) / 2;
            target.style.transform = `scale(${scale})`;
            target.style.left = left + 'px';
            target.style.top = top + 'px';
            const currentWidth = parseInt(target.style.width);
            const currentHeight = parseInt(target.style.height);
            if (setWidth !== currentWidth || setHeight !== currentHeight) {
                target.style.width = setWidth + 'px';
                target.style.height = setHeight + 'px';
                observer.emit(PlayerEventTypes.RESIZE);
            }
        }
        function getPageSize(target) {
            return {
                width: parseInt(target.style.width, 10),
                height: parseInt(target.style.height, 10)
            };
        }
        return {
            resize: triggerResize
        };
    }
    createStyle(id, s) {
        const style = document.createElement('style');
        style.id = id;
        style.innerHTML = s;
        return style;
    }
}

class Ctrl {
    constructor(playModule) {
        this.commands = [];
        this.commandsGetHandle = (target, prop, receiver) => {
            if (prop === 'push') {
                if (this.player) {
                    setTimeout(() => this.execLastCommand());
                }
            }
            return Reflect.get(target, prop, receiver);
        };
        this.proxyCommands = new Proxy(this.commands, { get: this.commandsGetHandle });
        this.getPlayer();
        observer.on(PlayerEventTypes.INIT, () => {
            var _a;
            const { player } = ((_a = playModule === null || playModule === void 0 ? void 0 : playModule.c) === null || _a === void 0 ? void 0 : _a.panel) || {};
            this.player = player;
            this.initResolve(this.player);
            this.execLastCommand();
        });
    }
    command(cmd) {
        this.proxyCommands.push(cmd);
    }
    execLastCommand() {
        let command;
        while ((command = this.commands.shift())) {
            const { cmd, value } = command;
            this.getPlayer().then(player => {
                switch (cmd) {
                    case 'jump':
                        const { startTime } = Store.getState().progress;
                        this.player.jump({ index: 0, time: startTime + value });
                    case 'speed':
                        Store.dispatch({
                            type: PlayerReducerTypes.SPEED,
                            data: { speed: value }
                        });
                        break;
                    case 'pause':
                        player.pause();
                        break;
                }
            });
        }
    }
    get duration() {
        const { duration } = Store.getState().progress;
        return duration;
    }
    get paused() {
        return this.player.speed === 0;
    }
    get frames() {
        return {
            index: this.player.frameIndex,
            total: this.player.frames.length
        };
    }
    get currentTime() {
        const { duration } = Store.getState().progress;
        const { index, total } = this.frames;
        return +((index / total) * duration).toFixed(0);
    }
    set currentTime(time) {
        this.setCurrentTime(time);
    }
    setCurrentTime(time) {
        return __awaiter(this, void 0, void 0, function* () {
            this.command({ cmd: 'jump', value: time });
        });
    }
    getPlayer() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(r => {
                if (!this.initResolve) {
                    this.initResolve = r;
                }
                else {
                    r(this.player);
                }
            });
        });
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            this.command({ cmd: 'speed', value: 1 });
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            this.command({ cmd: 'pause' });
        });
    }
}

const defaultReplayOptions = {
    autoplay: true,
    mode: 'default',
    target: window,
    heatPoints: true,
    timeMode: 'durationTime',
    fastForward: [2, 8],
    disableScrolling: true
};
class Player {
    constructor(options) {
        this.on = tempEmptyFn;
        this.destroy = tempEmptyFn;
        this.append = tempEmptyFn;
        this.getCtrl = tempEmptyFn;
        const player = new PlayerModule(options);
        Object.keys(this).forEach((key) => {
            this[key] = player[key].bind(player);
        });
    }
}
class PlayerModule {
    constructor(options) {
        this.destroyStore = new Set();
        this.initialized = false;
        this.triggerCalcProgress = debounce(() => this.calcProgress(), 500);
        this.getCtrl = () => this.ctrl;
        nodeStore.reset();
        this.init(options);
        this.watchData();
        this.ctrl = new Ctrl(this);
    }
    watchData(state) {
        if (state && !this.initialized) {
            this.initialized = true;
            const opts = this.options;
            const { records, packs, currentData } = state;
            const { audio } = currentData;
            const hasAudio = audio && (audio.src || audio.wavStrList.length || audio.pcmStrList.length);
            this.c = new ContainerComponent(opts);
            showStartMask(this.c);
            (this.fmp = new FMP()).ready(() => __awaiter(this, void 0, void 0, function* () {
                if (hasAudio) {
                    yield waitStart(this.c.container);
                }
                removeStartPage(this.c.container);
                if (records.length) {
                    if (opts.autoplay || hasAudio) {
                        if (opts.autoplay) {
                            Store.dispatch({
                                type: PlayerReducerTypes.SPEED,
                                data: { speed: 1 }
                            });
                        }
                    }
                }
            }));
            if (packs.length) {
                this.calcProgress();
            }
            if (records.length <= 2) {
                Store.dispatch({ type: PlayerReducerTypes.OPTIONS, data: { options: { mode: 'live' } } });
                const panel = this.c.panel.target;
                if (panel) {
                    panel.setAttribute('style', 'display: none');
                }
            }
        }
    }
    init(options) {
        if (!isDev) {
            logInfo();
        }
        this.initOptions(options);
        this.initData();
    }
    initOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = Object.assign(Object.assign({ destroyStore: this.destroyStore }, defaultReplayOptions), options);
            this.options = opts;
            Store.dispatch({ type: PlayerReducerTypes.OPTIONS, data: { options: opts } });
            this.destroyStore.add(() => Store.unsubscribe());
        });
    }
    initData() {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = this.options;
            const records = yield this.getRecords(opts);
            window.G_REPLAY_RECORDS = records;
            const packs = getPacks(records);
            const firstData = transToReplayData(packs[0]);
            Store.dispatch({
                type: ReplayDataReducerTypes.UPDATE_DATA,
                data: { records, packs, currentData: firstData }
            });
        });
    }
    getRecords(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receiver, records: recordsData } = options;
            const records = recordsData ||
                (receiver && (yield this.dataReceiver(receiver))) ||
                getGZipData() ||
                (yield getRecordsFromDB());
            if (!records) {
                throw logError('Replay data not found');
            }
            return records;
        });
    }
    calcProgress() {
        const { packs } = Store.getState().replayData;
        const startTime = packs[0][0].time;
        let duration = 0;
        const packsInfo = [];
        let diffTime = 0;
        packs.forEach((pack, index) => {
            const startTime = pack[0].time;
            const endTime = pack.slice(-1)[0].time;
            if (index) {
                diffTime += startTime - packs[index - 1].slice(-1)[0].time;
            }
            const info = {
                startTime,
                endTime,
                duration: endTime - startTime,
                diffTime
            };
            packsInfo.push(info);
            duration += info.duration;
        });
        const endTime = startTime + duration;
        Store.dispatch({
            type: ProgressReducerTypes.PROGRESS,
            data: {
                duration,
                packsInfo,
                startTime,
                endTime
            }
        });
    }
    dispatchEvent(type, data) {
        const event = new CustomEvent(type, { detail: data });
        window.dispatchEvent(event);
    }
    dataReceiver(receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            let isResolved;
            let head;
            let snapshot;
            return yield new Promise(resolve => {
                receiver(data => {
                    if (isResolved) {
                        this.dispatchEvent('record-data', data);
                    }
                    else {
                        if (data.type === RecordType.HEAD) {
                            head = data;
                        }
                        else if (data.type === RecordType.SNAPSHOT) {
                            snapshot = data;
                        }
                        if (head && snapshot) {
                            isResolved = true;
                            resolve([head, snapshot]);
                            this.dispatchEvent('record-data', data);
                        }
                    }
                });
            });
        });
    }
    destroy(opts = { removeDOM: true }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.destroyStore.forEach(un => un());
            observer.destroy();
            Store.unsubscribe();
            yield delay(0);
            removeGlobalVariables();
            if (opts.removeDOM) {
                const shadowHost = this.c.shadowHost;
                (_a = this.c.shadowHost.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(shadowHost);
            }
        });
    }
    on(key, fn) {
        observer.on(key, fn);
    }
    append(records) {
        return __awaiter(this, void 0, void 0, function* () {
            yield delay(0);
            Store.dispatch({
                type: ReplayDataReducerTypes.APPEND_RECORDS,
                data: { records }
            });
            this.triggerCalcProgress();
        });
    }
}
__decorate([
    ConnectProps(state => ({
        currentData: state.replayData.currentData,
        records: state.replayData.records,
        packs: state.replayData.packs
    }))
], PlayerModule.prototype, "watchData", null);

export { Player, PlayerModule, createReplayDocument, exportReplay };
//# sourceMappingURL=xreplay-player.esm.js.map
