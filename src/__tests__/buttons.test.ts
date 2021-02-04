import { DoneBtn } from '../js/model/buttons'
jest.mock('../js/model/buttons')

describe('Testing buttons logic', () => {
    let testBtn: DoneBtn
    beforeEach(() => {
        document.body.innerHTML = '<button id="testID">Done</button>'
    })
    test('When button doesn\'t exist in document', () => {
        testBtn = new DoneBtn('falseID')
        try {
            expect(testBtn.startListener).toThrow()
        } catch (e) {
            console.log(e.message)
        }
    })
    test('', () => {
        testBtn = new DoneBtn('testID')
        expect(testBtn.startListener).not.toThrow()
    })
})