/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 14:33:15
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 15:54:07
 * @FilePath: /xreplay/player/renders/mouse.ts
 * @Description: 
 */
import { MouseEventType, MouseRecordData } from '../../types'
import { nodeStore } from '../../utils'
import { PlayerComponent } from '../components/player'

export function renderMouse(this: PlayerComponent, data: MouseRecordData) {
    const { x, y, id, type } = data

    let left = 0,
        top = 0

    if (id) {
        const node = nodeStore.getNode(id) as HTMLElement
        let rect = {}
        if (node && node.getBoundingClientRect) {
            rect = node.getBoundingClientRect()
        }
        const { left: nodeLeft, top: nodeTop } = rect as any
        left = nodeLeft
        top = nodeTop
    }

    if (type === MouseEventType.MOVE) {
        this.pointer.move(x + left, y + top)
    } else if (type === MouseEventType.CLICK) {
        this.pointer.click(x + left, y + top)
    }
}
