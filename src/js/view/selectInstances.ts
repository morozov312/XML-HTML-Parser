import SlimSelect from 'slim-select'
import SelectFactory from './selectFactory'

interface option {
    text: string,
    value: string
}

export abstract class Select {
    // members
    private selectList: SlimSelect
    private id: string
    private infoAttribute: string
    private childAttribute: string
    // private methods
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
    private getOriginalSelect(): Element {
        return document.querySelector(`#${this.id}`)
    }
    private clearDependentSelect(index: number, arr: Select[]): void {
        for (let i: number = index + 1; i < arr.length; i++) {
            let childOptions: Element = arr[i].getOriginalSelect()
            while (childOptions.children.length != 1) {
                childOptions.lastChild.remove()
            }
        }
    }
    private onChangeCallback(index: number, arr: Select[]): void {
        this.clearDependentSelect(index, arr)
    }
    private getInfo(xmlData: Element, attributeName: string): option[] {
        let nodeArr: HTMLCollection = xmlData.getElementsByTagName(this.id)
        return Select.createOptionArray(nodeArr, attributeName)
    }
    // public:
    constructor(id: string, infoAttribute: string, childAttribute: string) {
        this.id = id
        this.infoAttribute = infoAttribute
        this.childAttribute = childAttribute
    }
    public render(): void {
        const factory: SelectFactory = new SelectFactory()
        this.selectList = factory.create(this.id)
    }
    public initialLoad(xmlData: Element): void {
        this
            .getInfo(xmlData, this.infoAttribute)
            .forEach(i => {
                this.selectList.addData(i)
            })
    }
    public setCallback(index: number, arr: Select[]): void {
        this.selectList.onChange = () => { this.onChangeCallback(index, arr) }
    }
}

export class Faculty extends Select {
    constructor() {
        super('faculty', 'name', 'number')
    }
}

export class Course extends Select {
    constructor() {
        super('course', 'number', 'id')
    }
    initialLoad(): void { }
}

export class Group extends Select {
    constructor() {
        super('group', 'id', 'initials')
    }
}

export class Student extends Select {
    constructor() {
        super('student', 'initials', 'name')
    }
    initialLoad(): void { }
}


// getChildren(xmlData: Element, attributeName: string): option[] {
//     let nodeArr: HTMLCollection = xmlData.getElementsByTagName(this.id)
//     for (let i: number = 0; i < nodeArr.length; i++) {
//         if (nodeArr[i].getAttribute(this.infoAttribute) == attributeName) {
//             return Select.createOptionArray(nodeArr[i].children, this.childAttribute)
//         }
//     }
// }