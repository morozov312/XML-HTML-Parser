import Model from '../model/model'
import View from '../view/view'
/**
 * Module - part of MVC pattern
 * Responsible for connection of display and logic
 * @class
 * @module
 */
class Controller {
    model: Model
    view: View
    constructor() {
        this.model = new Model()
        this.view = new View()
    }
    async run(): Promise<void> {
        try {
            const xmlData: Element = await this.model.getXML('./universityBase.xml')
            this.view.renderAll(xmlData)
        } catch (err) {
            console.error(`Error, error status - ${err}`)
        }
    }
}

export default Controller