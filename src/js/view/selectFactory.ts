import SlimSelect from 'slim-select'
/**
 * Creates instances of SlimSelect with specified settings
 * @class
 */
class SelectFactory {
    public select: string
    public placeholder: string
    public showSearch: boolean
    public hideSelectedOption: boolean
    create(id: string): SlimSelect {
        this.select = `#${id}`
        this.placeholder = `Choose a ${id}`
        this.showSearch = false
        this.hideSelectedOption = true
        return new SlimSelect(this)
    }
}

export default SelectFactory