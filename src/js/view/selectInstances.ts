import SlimSelect from 'slim-select'
import SelectFactory from './selectFactory'

interface option {
    text: string,
    value: string
}

interface selectConfig {
    id: string
    infoAttribute: string
    childAttribute: string
    needInitialLoad?: boolean
}

export abstract class Select {
    // members
    private selectList: SlimSelect
    private id: string
    private infoAttribute: string
    private childAttribute: string
    private needInitianalLoad: boolean
    // private static methods
    private static createOptionArray(nodeArr: HTMLCollection, attributeName: string): option[] {
        let res: option[] = []
        for (let i: number = 0; i < nodeArr.length; i++) {
            let attributeText = nodeArr[i].getAttribute(attributeName)
            res.push({
                text: attributeText,
                value: attributeText
            })
        }
        return res
    }
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
        let nodeArr: HTMLCollection = xmlData.getElementsByTagName(this.id)
        return Select.createOptionArray(nodeArr, attributeName)
    }
    private clearDependentSelect(index: number, arr: Select[]): void {
        arr
            .slice(index + 1, arr.length)
            .forEach(i => {
                let childOptions: Element = i.getOriginalSelect()
                while (childOptions.children.length != 1) {
                    childOptions.lastChild.remove()
                }
                i.selectList.data.data.length = 1
            })
    }
    private getChildren(xmlData: Element, selectedElement: string): option[] {
        let nodeArr: HTMLCollection = xmlData.getElementsByTagName(this.id)
        if (!nodeArr) return []
        for (let i: number = 0; i < nodeArr.length; i++) {
            if (nodeArr[i].getAttribute(this.infoAttribute) == selectedElement) {
                return Select.createOptionArray(nodeArr[i].children, this.childAttribute)
            }
        }
    }
    private fillChildSelect(xmlData: Element, index: number, arr: Select[]): void {
        let selected = this.selectList.selected()
        let c = this.getChildren(xmlData, selected.toString())
        Select.fillSelect(arr[index + 1], c)
    }
    private onChangeCallback(xmlData: Element, index: number, arr: Select[]): void {
        this.clearDependentSelect(index, arr)
        this.fillChildSelect(xmlData, index, arr)
    }
    // public:
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
    public setCallback(xmlData: Element, index: number, arr: Select[]): Select {
        this.selectList.onChange = () => { this.onChangeCallback(xmlData, index, arr) }
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
            childAttribute: 'id',
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
            childAttribute: 'name',
        })
    }
}