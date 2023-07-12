/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 14:33:15
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 15:55:02
 * @FilePath: /xreplay/player/renders/window.ts
 * @Description: 
 */
import { WindowRecordData } from '../../types'
import { nodeStore } from '../../utils'
import { PlayerComponent } from '../components/player'

export function renderWindow(this: PlayerComponent, data: WindowRecordData) {
    const { width, height, id } = data
    let target: HTMLElement
    if (id) {
        target = nodeStore.getNode(id) as HTMLElement
            ; (target as HTMLElement).style.width = width + 'px'
            ; (target as HTMLElement).style.height = height + 'px'
    } else {
        target = this.c.sandBoxDoc.body
        this.c.resize({ setWidth: width, setHeight: height })
    }
}
