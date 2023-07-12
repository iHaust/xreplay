/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 14:33:15
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 15:54:52
 * @FilePath: /xreplay/player/renders/video.ts
 * @Description: 
 */
/**
 * Copyright (c) oct16.
 * https://github.com/oct16
 *
 * This source code is licensed under the GPL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { VideoRecordData } from '../../types'
import { nodeStore } from '../../utils'

import { PlayerComponent } from '../components/player'

export function renderVideo(this: PlayerComponent, data: VideoRecordData) {
    const { id, blobUrl } = data

    if (!blobUrl) {
        return
    }

    const targetNode = nodeStore.getNode(id)
    const targetVideo = targetNode as HTMLVideoElement

    if (!targetVideo) {
        return
    }

    targetVideo.autoplay = targetVideo.muted = true
    targetVideo.loop = targetVideo.controls = false
    targetVideo.src = blobUrl
}
