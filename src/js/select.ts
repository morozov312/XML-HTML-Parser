import SlimSelect from 'slim-select'
export default class SelectFactory {
    select: string
    placeholder: string
    showSearch: boolean
    hideSelectedOption: boolean
    create(): SlimSelect {
        return new SlimSelect(this)
    }
    constructor(id: string) {
        this.select = `#${id}`
        this.placeholder = `Choose a ${id}`
        this.showSearch = false
        this.hideSelectedOption = true
        this.create()
    }
}