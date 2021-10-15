
import { AudioOptionsData } from '../../types'

function encodePCM(bufferData: Float32Array, opts: AudioOptionsData) {
    const { sampleBits } = opts
    const isLittleEndian = true
    const length = bufferData.length * (sampleBits / 8)
    const data = new DataView(new ArrayBuffer(length))
    let offset = 0

    if (sampleBits === 8) {
        for (let i = 0; i < bufferData.length; i++, offset++) {
            const s = Math.max(-1, Math.min(1, bufferData[i]))
            let val = s < 0 ? s * 128 : s * 127
            val = +val + 128
            data.setInt8(offset, val)
        }
    } else {
        for (let i = 0; i < bufferData.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, bufferData[i]))
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, isLittleEndian)
        }
    }

    return data
}

export function encodeWAV(data: Float32Array[], opts: AudioOptionsData) {
    const dataView = encodeAudioData(data, opts)
    const blob = new Blob([dataView], {
        type: 'audio/wav'
    })

    return blob
}

export function encodeAudioData(data: Float32Array[], opts: AudioOptionsData) {
    const PMC = encodePCM(mergeArray(data), opts)
    return createWavFile(PMC, opts)
}

function mergeArray(list: Float32Array[]) {
    const length = list.length * list[0].length
    const data = new Float32Array(length)
    let offset = 0
    for (let i = 0; i < list.length; i++) {
        data.set(list[i], offset)
        offset += list[i].length
    }
    return data
}

function createWavFile(audioData: DataView, { channelCount, sampleBits, sampleRate }: AudioOptionsData) {
    const WAV_HEAD_SIZE = 44
    const buffer = new ArrayBuffer(WAV_HEAD_SIZE + audioData.byteLength)
    const isLittleEndian = true
    // control buffer
    const view = new DataView(buffer)
    // write head
    // RIFF chunk descriptor/identifier
    writeUTFBytes(view, 0, 'RIFF')
    // RIFF chunk length
    view.setUint32(4, 36 + audioData.byteLength * 2, isLittleEndian)
    // RIFF type
    writeUTFBytes(view, 8, 'WAVE')
    // format chunk identifier
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ')
    // format chunk length
    view.setUint32(16, 16, isLittleEndian)
    // sample format (raw)
    view.setUint16(20, 1, isLittleEndian)
    // stereo (channels)
    view.setUint16(22, channelCount, isLittleEndian)
    // sample rate
    view.setUint32(24, sampleRate, isLittleEndian)
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * channelCount * (sampleBits / 8), isLittleEndian)
    // block align (channel count * bytes per sample)
    view.setUint16(32, channelCount * (sampleBits / 8), isLittleEndian)
    // bits per sample
    view.setUint16(34, sampleBits, isLittleEndian)
    // data sub-chunk
    // data chunk identifier
    writeUTFBytes(view, 36, 'data')
    // data chunk length
    view.setUint32(40, audioData.byteLength, isLittleEndian)
    // view.setUint32(40, audioData.length * 2, isLittleEndian)

    // write PCM
    const length = audioData.byteLength
    let offset = 44
    for (let i = 0; i < length; i++) {
        view.setUint8(offset, audioData.getUint8(i))
        offset++
    }

    return view
}

function writeUTFBytes(view: DataView, offset: number, string: string) {
    const len = string.length
    for (let i = 0; i < len; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
    }
}

export function float32ArrayToBase64(data: Float32Array) {
    return bufferArrayToBase64(data.buffer)
}

export function base64ToFloat32Array(str: string) {
    return new Float32Array(base64ToBufferArray(str))
}

export function bufferArrayToBase64(arrayBuffer: ArrayBufferLike) {
    let binary = ''
    const bytes = new Uint8Array(arrayBuffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

export function base64ToBufferArray(str: string) {
    const blob = atob(str)
    const bLength = blob.length
    const arrayBuffer = new ArrayBuffer(bLength)
    const dataView = new DataView(arrayBuffer)
    for (let i = 0; i < bLength; i++) {
        dataView.setUint8(i, blob.charCodeAt(i))
    }

    return arrayBuffer
}

export function uint8ArrayToAscii(array: Uint8Array) {
    let outputStr = ''
    const carry = 1 << 8
    for (let i = 0; i < array.length; i++) {
        let num = array[i]

        if (~[13, 34, 39, 44, 60, 62, 92, 96, 10, 0].indexOf(num)) {
            num += carry
        }

        outputStr += String.fromCharCode(num)
    }
    return outputStr
}

export function asciiToUint8Array(str: string) {
    const carry = 1 << 8
    const strArray = str.split('')
    const byteArray = new Uint8Array(strArray.length)
    for (let i = 0; i < strArray.length; i++) {
        const num = strArray[i].charCodeAt(0)
        byteArray[i] = num >= carry ? num - carry : num
    }
    return byteArray
}
