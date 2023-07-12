/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 14:33:15
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 15:53:43
 * @FilePath: /xreplay/player/renders/form-el.ts
 * @Description: 
 */
import { FormElementEvent, FormElementRecordData } from '../../types'
import { nodeStore, revertStrByPatches } from '../../utils'
import { Store } from '../utils'

export function renderFormEl(data: FormElementRecordData, opts: { isJumping?: boolean }) {
    const { isJumping } = opts || {}
    const { id, key, type: formType, value, patches } = data as FormElementRecordData
    const node = nodeStore.getNode(id) as HTMLInputElement | undefined
    const { mode } = Store.getState().player.options

    if (node) {
        if (formType === FormElementEvent.INPUT || formType === FormElementEvent.CHANGE) {
            if (patches && patches.length) {
                const newValue = revertStrByPatches(node.value, patches)
                node.value = newValue
            } else if (key) {
                ; (node as any)[key] = value
            }
        } else if (formType === FormElementEvent.FOCUS) {
            mode !== 'live' && !isJumping && node.focus && node.focus({ preventScroll: true })
        } else if (formType === FormElementEvent.BLUR) {
            mode !== 'live' && !isJumping && node.blur && node.blur()
        } else if (formType === FormElementEvent.PROP) {
            if (key) {
                ; (node as any)[key] = value
            }
        }
    }
}
