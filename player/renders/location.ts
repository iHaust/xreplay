/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 14:33:15
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 15:53:56
 * @FilePath: /xreplay/player/renders/location.ts
 * @Description: 
 */
import { LocationRecordData } from '../../types'
import { nodeStore } from '../../utils'

export async function renderLocation(data: LocationRecordData) {
    const { path, hash, href, contextNodeId } = data as LocationRecordData
    const contextNode = nodeStore.getNode(contextNodeId)

    if (contextNode) {
        const context = contextNode.ownerDocument!.defaultView!
        context.G_REPLAY_LOCATION = { ...context.G_REPLAY_LOCATION, ...{ path, hash, href } }
    }
}
