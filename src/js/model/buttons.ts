export abstract class Button {
    // members
    protected resultField: string = '.results__value'
    protected inputClass: string = '.checkbox'
    private buttonElement: Element
    // abstract methods:
    abstract clickCallback(): void
    // public methods:
    constructor(buttonId: string) {
        this.buttonElement = document.querySelector(`#${buttonId}`)
    }
    public startListener(): void {
        this.buttonElement?.addEventListener('click', this.clickCallback)
    }
}

export class DoneBtn extends Button {
    // private methods:
    private getInputArray(): NodeListOf<Element> {
        const nodeArr: NodeListOf<Element> = document.querySelectorAll(this.inputClass + '[checked]')
        if (nodeArr.length === 0) throw new Error('The results table isn\'t complete! Choose a student from select list')
        return nodeArr
    }
    // public methods:
    constructor(id: string) {
        super(id)
    }
    /**
     * On click calculates average score and display it on the page
     * Highlighted green if score is greater than 1 and red if less
     * @callback
     */
    public clickCallback = (): void => {
        try {
            let sum: number = 0
            const inputArr: NodeListOf<Element> = this.getInputArray()
            inputArr
                .forEach(i => sum += Number(i.getAttribute('value')))
            const resultValue: string = (sum / inputArr.length).toFixed(2).replace(/.00/, '')
            const redColor: string = '#e41749'
            const greenColor: string = '#67a125'
            const resultColor: string = Number(resultValue) < 1 ? redColor : greenColor
            const resultString: string = `Average mark <span style="color:${resultColor}">is ${resultValue}<sapn>`
            document.querySelector(this.resultField).innerHTML = resultString
        } catch (error) {
            console.error(error.message);
        }
    }
}

export class CancelBtn extends Button {
    // public methods:
    constructor(id: string) {
        super(id)
    }
    public clickCallback = (): void => {
        document.querySelector(this.resultField).innerHTML = ''
    }
}
