import './index.css'

import { GetElementById, ParseError } from './util'
import { GLHandlerManager } from './GLHanlderManager'

window.addEventListener('error', (ev) => {
    alert(ParseError(ev.error))
})
const titleContainer = GetElementById('title-container')
const canvas = GetElementById('canvas')
new GLHandlerManager(titleContainer, canvas)
