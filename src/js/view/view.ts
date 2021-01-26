'use strict'

import { Select, Faculty, Course, Group, Student } from './selectInstances'

class View {
    // members
    private listArr: Select[] = []
    // public:
    constructor() {
        this.listArr.push(new Faculty())
        this.listArr.push(new Course())
        this.listArr.push(new Group())
        this.listArr.push(new Student())
    }
    public renderAll(xmlData: Element): void {
        this.listArr.forEach((i, index) => {
            i.render()
            i.initialLoad(xmlData)
            i.setCallback(index, this.listArr)
        })
    }
}

export default View
