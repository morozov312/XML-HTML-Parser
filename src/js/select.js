export default class SelectFactory {
    constructor(id) {
        this.select = `#${id}`
        this.placeholder = `Choose a ${id}`
        this.showSearch = false
        this.hideSelectedOption = true
        return new SlimSelect(this)
    }
}