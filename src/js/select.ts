import SlimSelect from 'slim-select'
export default class SelectFactory {
    select: string
    placeholder: string
    showSearch: boolean = false
    hideSelectedOption: boolean = true
    constructor(id: string) {
        this.select = `#${id}`
        this.placeholder = `Choose a ${id}`
    }
    create(): SlimSelect {
        return new SlimSelect(this)
    }
}