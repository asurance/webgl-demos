import './index.css'

import { GetElementById, ParseError } from './util'
import { GLHandlerManager } from './GLHanlderManager'

const titleContainer = GetElementById('title-container')
const canvas = GetElementById('canvas')
try {
    new GLHandlerManager(titleContainer, canvas)
} catch (e) {
    alert(ParseError(e))
}
