import Model from '../js/model/model'
import 'regenerator-runtime/runtime'

describe('Testing Model functions', () => {
    const model: Model = new Model()
    test('get XML use XHR', async () => {
        const falsePath: string = './base.xml'
        try {
            let xmlData = await model.getXML(falsePath)
            expect(xmlData).toThrow()
        } catch (e) {
            console.log(e.message)
        }
    })
})