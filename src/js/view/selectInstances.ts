import SlimSelect from 'slim-select'
import SelectFactory from './selectFactory'
/**
 * Interface contains information about a XML node
 * @property {string} option.text - Information attribute text
 * @property {string} option.value - Information attribute value
 * @property {string} option.textContent - XML document node content
 * @interface
 */
interface option {
    text: string,
    value: string,
    textContent: string
}
/**
 * Contains settings for create Select object
 * @property {boolean} selectConfig.needInitialLoad - If need initial parsing all elements of a this class
 * @interface
 */
interface selectConfig {
    id: string,
    infoAttribute: string,
    childAttribute: string,
    needInitialLoad?: boolean,
}

export abstract class Select {
    // members
    private selectList: SlimSelect
    private id: string
    private infoAttribute: string
    private childAttribute: string
    private needInitianalLoad: boolean
    private finallyLoadTarget: string = '.results__body'
    private resultField: string = '.results__value'
    // private static methods
    /**
     * function searche in array values with received attribute and create array of options from them
     * @param nodeArr - Array of HTML elements
     * @param attributeName - Name of attribute to find in the array of elements
     * @returns option array
     * @static
     */
    private static createOptionArray(nodeArr: HTMLCollection, attributeName: string): option[] {
        const res: option[] = []
        for (let i: number = 0; i < nodeArr.length; i++) {
            let attributeText = nodeArr[i].getAttribute(attributeName)
            res.push({
                text: attributeText,
                value: attributeText,
                textContent: nodeArr[i].textContent.trim()
            })
        }
        return res
    }
    /**
     * @param select - object into which to write array of options
     * @param optionArr - array of options that will be written to Select option
     * @static
     */
    private static fillSelect(select: Select, optionArr: option[]): void {
        optionArr.forEach(i => {
            select.selectList.addData(i)
        })
    }
    // private methods
    private getOriginalSelect(): Element {
        return document.querySelector(`#${this.id}`)
    }
    private getInfo(xmlData: Element, attributeName: string): option[] {
        const nodeArr: HTMLCollection = xmlData.getElementsByTagName(this.id)
        return Select.createOptionArray(nodeArr, attributeName)
    }
    private clearTable(): void {
        document.querySelector(this.finallyLoadTarget).innerHTML = ''
        document.querySelector(this.resultField).innerHTML = ''
    }
    private clearDependentSelect(currIndex: number, selectArray: Select[]): void {
        selectArray
            .slice(currIndex + 1, selectArray.length)
            .forEach(i => {
                const childOptions: Element = i.getOriginalSelect()
                while (childOptions.children.length != 1) {
                    childOptions.lastChild.remove()
                }
                i.selectList.data.data.length = 1
                i.clearTable()
            })
    }
    private getChildren(xmlData: Element, currIndex: number, selectArray: Select[]): option[] {
        let currElement: Element = xmlData
        let nodeArr: HTMLCollection
        for (let i = 0; i < currIndex + 1; i++) {
            let selected: string = selectArray[i].selectList.selected().toString()
            nodeArr = currElement.getElementsByTagName(selectArray[i].id)
            for (let j = 0; j < nodeArr.length; j++) {
                if (nodeArr[j].getAttribute(selectArray[i].infoAttribute) === selected) {
                    currElement = nodeArr[j]
                    break
                }
            }
        }
        return Select.createOptionArray(currElement.children, selectArray[currIndex].childAttribute)
    }
    private fillTableRow(subjectName: string, subjectIndex: number, value: number): string {
        const accesAtributes = ['disabled', 'disabled', 'disabled']
        accesAtributes[value] = 'checked'
        return `<div class="row">
                    <div class="cell">${subjectName} </div>
                    <div class="cell cell_center"><input ${accesAtributes[0]} class="checkbox" type="radio" name="subject_${subjectIndex}" value="0"></div>
                    <div class="cell cell_center"><input ${accesAtributes[1]} class="checkbox" type="radio" name="subject_${subjectIndex}" value="1"></div>
                    <div class="cell cell_center"><input ${accesAtributes[2]} class="checkbox" type="radio" name="subject_${subjectIndex}" value="2"></div>
                </div>`
    }
    private finallyLoad(optionArr: option[]) {
        this.clearTable()
        const target: Element = document.querySelector(this.finallyLoadTarget)
        optionArr.forEach((i, index) => {
            let rowText = this.fillTableRow(i.text, index, Number(i.textContent))
            target.insertAdjacentHTML('beforeend', rowText)
        })
    }
    private fillChildSelect(xmlData: Element, currIndex: number, selectArray: Select[]): void {
        const childOptionsArr: option[] = this.getChildren(xmlData, currIndex, selectArray)
        if (currIndex + 1 === selectArray.length) {
            this.finallyLoad(childOptionsArr)
        } else {
            Select.fillSelect(selectArray[currIndex + 1], childOptionsArr)
        }
    }
    private needOverride(currIndex: number, selectArray: Select[]): boolean {
        for (let i = 0; i < currIndex; i++) {
            const value: string = selectArray[i].selectList.selected().toString()
            if (value === 'placeholder') return true
        }
        return false
    }
    /**
     * Fill previous select's if they won't filled
     */
    private override(xmlData: Element, currIndex: number, selectArray: Select[]): void {
        if (!this.needOverride(currIndex, selectArray)) return;
        const selectedValue: string = selectArray[currIndex].selectList.selected().toString()
        const nodeArr: HTMLCollection = xmlData.getElementsByTagName(selectArray[currIndex].id)
        const arrayOfElements: Element[] = []
        for (let i: number = 0; i < nodeArr.length; i++) {
            if (nodeArr[i].getAttribute(this.infoAttribute) === selectedValue) {
                arrayOfElements.push(nodeArr[i])
                break
            }
        }
        for (let i: number = 0; i < currIndex; i++) {
            arrayOfElements.push(arrayOfElements[i].parentElement)
        }
        arrayOfElements.reverse().forEach((i, index) => {
            let attributeValue: string = i.getAttribute(selectArray[index].infoAttribute)
            selectArray[index].selectList.set(attributeValue)
        })
    }
    private onChangeCallback(xmlData: Element, currIndex: number, selectArray: Select[]): void {
        this.clearDependentSelect(currIndex, selectArray)
        this.fillChildSelect(xmlData, currIndex, selectArray)
        this.override(xmlData, currIndex, selectArray)
    }
    // public methods:
    constructor(config: selectConfig) {
        this.id = config.id
        this.infoAttribute = config.infoAttribute
        this.childAttribute = config.childAttribute
        this.needInitianalLoad = config.needInitialLoad || false
    }
    public render(): Select {
        const factory: SelectFactory = new SelectFactory()
        this.selectList = factory.create(this.id)
        return this
    }
    public initialLoad(xmlData: Element): Select {
        if (this.needInitianalLoad) {
            let optionArr: option[] = this.getInfo(xmlData, this.infoAttribute)
            Select.fillSelect(this, optionArr)
        }
        return this
    }
    public setCallback(xmlData: Element, currIndex: number, selectArray: Select[]): Select {
        this.selectList.onChange = () => { this.onChangeCallback(xmlData, currIndex, selectArray) }
        return this
    }
}

export class Faculty extends Select {
    constructor() {
        super({
            id: 'faculty',
            infoAttribute: 'name',
            childAttribute: 'number',
            needInitialLoad: true
        })
    }
}

export class Course extends Select {
    constructor() {
        super({
            id: 'course',
            infoAttribute: 'number',
            childAttribute: 'id'
        })
    }
}

export class Group extends Select {
    constructor() {
        super({
            id: 'group',
            infoAttribute: 'id',
            childAttribute: 'initials',
            needInitialLoad: true
        })
    }
}

export class Student extends Select {
    constructor() {
        super({
            id: 'student',
            infoAttribute: 'initials',
            childAttribute: 'name'
        })
    }
}