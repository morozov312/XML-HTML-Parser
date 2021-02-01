'use strict'
import Model from '../model/model'
import View from '../view/view'

class Controller {
    model: Model
    view: View
    constructor() {
        this.model = new Model()
        this.view = new View()
    }
    async run() {
        try {
            let xmlData: Element = await this.model.getXML('../universityBase.xml')
            this.view.renderAll(xmlData)
        } catch (err) {
            console.log(`Error, error status - ${err}`)
        }
    }
}

export default Controller