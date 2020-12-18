'use strict'
export function createOption(optionName, isSelected = false) {
    return new Option(optionName, optionName, isSelected, isSelected)
}
export function parseFaculties(list) {
    let arr = []
    for (let i = 0; i < list.length; i++) {
        let currFaculty = list[i].getAttribute('name')
        let courseList = list[i].children
        let facultyObject = {
            name: currFaculty
        }
        for (let j = 0; j < courseList.length; j++) {
            facultyObject.courses = courseList
        }
        arr.push(facultyObject)
    }
    return arr
}
export function setPlaceholder(str) {
    let placeholder = createOption(str, true)
    placeholder.setAttribute('disabled', true)
    placeholder.setAttribute('hidden', true)
    return placeholder
}
export function setSubjectInfo(str, number, value) {
    let accesAtributes = ['disabled', 'disabled', 'disabled']
    accesAtributes[value] = 'checked'
    return `<tr>
                <lable>
                    <td>${str}</td> 
                </lable>
                    <td><input ${accesAtributes[0]} class="checkbox" type="radio" name="subject_${number}" value="0"></td>
                    <td><input ${accesAtributes[1]} class="checkbox" type="radio" name="subject_${number}" value="1"></td>
                    <td><input ${accesAtributes[2]} class="checkbox" type="radio" name="subject_${number}" value="2"></td>
            </tr>`
}