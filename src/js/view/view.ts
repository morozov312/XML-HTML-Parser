'use strict'

import { Select, Faculty, Course, Group, Student } from './selectInstances'

class View {
    // members
    private listArr: Select[] = []
    // public:
    constructor() {
        this.listArr.push(
            new Faculty(),
            new Course(),
            new Group(),
            new Student()
        )
    }
    public renderAll(xmlData: Element): void {
        this.listArr.forEach((item, index) => {
            item
                .render()
                .initialLoad(xmlData)
                .setCallback(xmlData, index, this.listArr)
        })
    }
}

export default View
