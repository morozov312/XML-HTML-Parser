'use strict'
import Parser from '../model/model'
import View from '../view/view'

class Controller {
    parser: Parser
    view: View
    constructor() {
        this.parser = new Parser()
        this.view = new View()
    }
    async run() {
        try {
            let xmlData: Element = await this.parser.getXML('../universityBase.xml')
            this.view.renderAll(xmlData)
        } catch (err) {
            console.log(`Error, error status - ${err}`)
        }
    }
}

export default Controller