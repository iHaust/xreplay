/*
 * @Author: zhanglitao@zuoyebang.com
 * @Date: 2023-07-12 14:33:15
 * @LastEditors: zhanglitao@zuoyebang.com
 * @LastEditTime: 2023-07-12 15:47:03
 * @FilePath: /xreplay/player/components/panel.ts
 * @Description: 
 */

import { KeyboardComponent } from './keyboard'
import { PlayerComponent } from './player'
import { PointerComponent } from './pointer'
import { ProgressComponent } from './progress'
import { ContainerComponent } from './container'
import { BroadcasterComponent } from './broadcaster'
import { ReplayInternalOptions } from '../../types'
import { Component, IComponent, html } from '../utils'
import { ToolboxComponent } from './toolbox'

@Component(
    'player-panel',
    html`<div class="player-panel">
        <slot></slot>
    </div>`
)
export class PanelComponent implements IComponent {
    target: HTMLElement
    parent: HTMLElement
    keyboard: KeyboardComponent
    progress: ProgressComponent
    pointer: PointerComponent
    player: PlayerComponent
    broadcaster: BroadcasterComponent
    c: ContainerComponent
    options: ReplayInternalOptions

    constructor(c: ContainerComponent) {
        this.c = c
        this.options = c.options
        if (this.options.hidePanel) {
            this.target.style.display = 'none'
        }
        this.initComponent()
    }

    private initComponent() {
        new ToolboxComponent(this.options, this.c)
        this.keyboard = new KeyboardComponent(this.options, this.c)
        this.progress = new ProgressComponent(this.options, this.c)
        this.pointer = new PointerComponent(this.c)
        this.broadcaster = new BroadcasterComponent(this.c)
        this.player = new PlayerComponent(this.options, this.c, this.pointer, this.progress, this.broadcaster)
    }
}
