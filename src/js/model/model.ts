'use strict'

class Model {
    // members
    resultField: string
    inputClass: string
    doneId: string
    cancelId: string
    // private methods:
    private onDone() {
        document
            .querySelector(this.doneId)
            .addEventListener('click', () => {
                let sum: number = 0
                let inputArr: NodeListOf<Element> = document.querySelectorAll(this.inputClass + '[checked]')
                if (inputArr.length) {
                    inputArr.forEach(i => sum += Number(i.getAttribute('value')))
                    let res: string = (sum / inputArr.length).toFixed(2).replace(/.00/, '')
                    document.querySelector(this.resultField).innerHTML = `Average mark is ${res}`
                }
            })
    }
    private onCancel() {
        document
            .querySelector(this.cancelId)
            .addEventListener('click', () => {
                document.querySelector(this.resultField).innerHTML = ''
            })
    }
    // public methods:
    constructor() {
        this.resultField = '.results__value'
        this.inputClass = '.checkbox'
        this.doneId = '#done-btn'
        this.cancelId = '#cancel-btn'
        this.onDone()
        this.onCancel()
    }
    public getXML(path: string): Promise<Element> {
        return new Promise((resolve: any, reject: any): void => {
            let xhr: XMLHttpRequest = new XMLHttpRequest()
            xhr.onreadystatechange = (): void => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200)
                        resolve(xhr.responseXML.firstChild)
                    else
                        reject(xhr.status)
                }
            }
            xhr.open("GET", path, true)
            xhr.send()
        })
    }
}
export default Model