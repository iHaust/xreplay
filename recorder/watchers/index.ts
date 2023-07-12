/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 10:04:24
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 15:24:29
 * @FilePath: /xreplay/recorder/watchers/index.ts
 * @Description: 
 */

import { DOMWatcher } from './dom'
import { FormElementWatcher } from './form-element'
import { LocationWatcher } from './location'
import { MouseWatcher } from './mouse'
import { ScrollWatcher } from './scroll'
import { WindowWatcher } from './window'
import { CanvasSnapshotWatcher, Canvas2DWatcher, CanvasWebGLWatcher } from './canvas'
import { TerminateWatcher } from './terminate'
import { FontWatcher } from './font'

export const baseWatchers = {
    DOMWatcher,
    FormElementWatcher,
    MouseWatcher,
    ScrollWatcher
};

export const watchers = {
    LocationWatcher,
    ...baseWatchers,
    WindowWatcher,
    CanvasSnapshotWatcher,
    Canvas2DWatcher,
    CanvasWebGLWatcher,
    FontWatcher,
    TerminateWatcher
};