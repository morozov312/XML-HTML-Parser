import { Select, Faculty, Course, Group, Student } from './selectInstances'
/**
 * Module - part of MVC pattern
 * Responsible for rendering select's on the page
 * @class
 * @module
 */
class View {
    // members
    private listArr: Select[] = []
    // public:
    /**
     * This function creates instances of Select
     * Should be recorded in the order in which they will render
     * @constructor
     */
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
