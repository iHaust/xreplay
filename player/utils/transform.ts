/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 14:33:15
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 16:04:58
 * @FilePath: /xreplay/player/utils/transform.ts
 * @Description: 
 */
import { AudioOptionsData, AudioRecord, AudioStrList, RecordData, RecordType } from '../../types'
import { base64ToFloat32Array, encodeAudioData } from '../../utils'

export function getPacks(records: RecordData[]) {
    const packs: RecordData[][] = []
    const pack: RecordData[] = []

    records.forEach((record, i) => {
        if (i && record.type === RecordType.HEAD) {
            packs.push(pack.slice())
            pack.length = 0
        }
        pack.push(record)

        if (records.length - 1 === i) {
            packs.push(pack)
        }
    })

    return packs
}

export function convertAudioBuffer(audioRecords: AudioRecord<AudioStrList>[]): DataView {
    const bufferStrList: string[] = []
    audioRecords.forEach(record => {
        const { data } = record.data
        bufferStrList.push(...data)
    })

    const dataArray: Float32Array[] = []
    for (let i = 0; i < bufferStrList.length; i++) {
        const data = base64ToFloat32Array(bufferStrList[i])
        dataArray.push(data)
    }

    const opts = {
        sampleBits: 8,
        channelCount: 1,
        sampleRate: 48000
    } as AudioOptionsData

    return encodeAudioData(dataArray, opts)
}
