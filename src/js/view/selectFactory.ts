import SlimSelect from 'slim-select'

class SelectFactory {
    select: string
    placeholder: string
    showSearch: boolean
    hideSelectedOption: boolean
    create(id: string): SlimSelect {
        this.select = `#${id}`
        this.placeholder = `Choose a ${id}`
        this.showSearch = false
        this.hideSelectedOption = true
        return new SlimSelect(this)
    }
}

export default SelectFactory