'use strict'
import SlimSelect from 'slim-select'
import SelectFactory from './selectFactory'

interface option {
    text: string,
    value: string
}

abstract class Select {
    constructor(id: string) {
        this.id = id
    }
    // protected:
    protected selectList: SlimSelect
    protected id: string
    protected getInfo(xmlData: Element, attributeName: string): option[] {
        let res: option[] = []
        let nodeArr: HTMLCollection = xmlData.getElementsByTagName(this.id)
        for (let i: number = 0; i < nodeArr.length; i++) {
            let attributeText = nodeArr[i].getAttribute(attributeName)
            res.push({
                text: attributeText,
                value: attributeText
            })
        }
        return res
    }
    // public:
    public render(): void {
        this.selectList = new SelectFactory().create(this.id)
    }
    public abstract initialLoad(xmlData: Element): void
}

class Faculty extends Select {
    constructor() {
        super('faculty')
    }
    initialLoad(xmlData: Element): void {
        this
            .getInfo(xmlData, 'name')
            .forEach(i => {
                this.selectList.addData(i)
            })
    }
}

class Course extends Select {
    constructor() {
        super('course')
    }
    initialLoad(): void { }
}

class Group extends Select {
    constructor() {
        super('group')
    }
    initialLoad(xmlData: Element): void {
        this
            .getInfo(xmlData, 'id')
            .forEach(i => {
                this.selectList.addData(i)
            })
    }
}

class Student extends Select {
    constructor() {
        super('student')
    }
    initialLoad(): void { }
}


class View {
    listArr: Select[] = []
    constructor() {
        this.listArr.push(new Faculty())
        this.listArr.push(new Course())
        this.listArr.push(new Group())
        this.listArr.push(new Student())
    }
    renderAll(xmlData: Element): void {
        this.listArr.forEach(i => {
            i.render()
            i.initialLoad(xmlData)
        })
    }
}

export default View