'use strict'
import { createOption, setSubjectInfo, parseFaculties, setPlaceholder } from './handler.js'

let facultySelect = document.querySelector('#faculty')
let courseSelect = document.querySelector('#course')
let groupSelect = document.querySelector('#group')
let initialsSelect = document.querySelector('#initials')
let tbody = document.querySelector('#tbody')
let doneBtn = document.querySelector('#done')
let undoBtn = document.querySelector('#undo')

const getRoot = new Promise((resolve) => {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            resolve(xmlhttp.responseXML.firstChild)
        }
    }
    xmlhttp.open("GET", "universityBase.xml", true)
    xmlhttp.send()
})

getRoot.then((xmlRoot) => {
    let facultyList = xmlRoot.children
    let facultyArr = parseFaculties(facultyList)
    // inital fill select lists
    for (let i = 0; i < facultyArr.length; i++) {
        facultySelect.append(createOption(facultyArr[i].name))
        for (let j = 0; j < facultyArr[i].courses.length; j++) {
            let groups = facultyArr[i].courses[j].children
            for (let k = 0; k < groups.length; k++) {
                groupSelect.append(createOption(groups[k].getAttribute('id')))
            }
        }
    }
    // onchange event listeners
    facultySelect.addEventListener('change', () => {
        groupSelect.length = 0
        groupSelect.append(setPlaceholder('Выберите группу'))
        courseSelect.length = 0
        courseSelect.append(setPlaceholder('Выберите курс'))
        initialsSelect.length = 0
        initialsSelect.append(setPlaceholder('Выберите студента'))
        for (let i = 0; i < facultyArr.length; i++) {
            if (facultyArr[i].name == facultySelect.value) {
                for (let j = 0; j < facultyArr[i].courses.length; j++) {
                    courseSelect.append(createOption(facultyArr[i].courses[j].getAttribute('number')))
                }
            }
        }
    })
    courseSelect.addEventListener('change', () => {
        groupSelect.length = 0
        groupSelect.append(setPlaceholder('Выберите группу'))
        initialsSelect.length = 0
        initialsSelect.append(setPlaceholder('Выберите студента'))
        for (let i = 0; i < facultyArr.length; i++) {
            if (facultyArr[i].name == facultySelect.value) {
                for (let j = 0; j < facultyArr[i].courses.length; j++) {
                    if (facultyArr[i].courses[j].getAttribute('number') == courseSelect.value) {
                        let groups = facultyArr[i].courses[j].children
                        for (let k = 0; k < groups.length; k++) {
                            groupSelect.append(createOption(groups[k].getAttribute('id')))
                        }
                    }
                }
            }
        }
    })
    groupSelect.addEventListener('change', () => {
        initialsSelect.length = 0
        initialsSelect.append(setPlaceholder('Выберите студента'))
        // if faculty selected
        if (courseSelect.value != 'placeholder') {
            for (let i = 0; i < facultyArr.length; i++) {
                if (facultyArr[i].name == facultySelect.value) {
                    for (let j = 0; j < facultyArr[i].courses.length; j++) {
                        if (facultyArr[i].courses[j].getAttribute('number') == courseSelect.value) {
                            let groups = facultyArr[i].courses[j].children
                            for (let k = 0; k < groups.length; k++) {
                                if (groups[k].getAttribute('id') == groupSelect.value) {
                                    let students = groups[k].children
                                    for (let m = 0; m < students.length; m++) {
                                        initialsSelect.append(createOption(students[m].getAttribute('initials')))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < facultyArr.length; i++) {
                for (let j = 0; j < facultyArr[i].courses.length; j++) {
                    let groups = facultyArr[i].courses[j].children
                    for (let k = 0; k < groups.length; k++) {
                        if (groupSelect.value == groups[k].getAttribute('id')) {
                            let loadedFaculty = facultySelect.options
                            for (let m = 0; m < loadedFaculty.length; m++) {
                                if (loadedFaculty[m].value == groups[k].parentNode.parentNode.getAttribute('name')) {
                                    loadedFaculty[m].selected = true
                                    courseSelect.length = 0
                                    for (let l = 0; l < facultyArr[i].courses.length; l++) {
                                        if (l == j)
                                            courseSelect.append(createOption(facultyArr[i].courses[l].getAttribute('number'), true))
                                        else
                                            courseSelect.append(createOption(facultyArr[i].courses[l].getAttribute('number')))
                                    }
                                    groupSelect.length = 0
                                    for (let n = 0; n < facultyArr[i].courses[j].children.length; n++) {
                                        if (n == k)
                                            groupSelect.append(createOption(facultyArr[i].courses[j].children[n].getAttribute('id'), true))
                                        else
                                            groupSelect.append(createOption(facultyArr[i].courses[j].children[n].getAttribute('id')))
                                    }
                                    initialsSelect.length = 1
                                    for (let s = 0; s < facultyArr[i].courses[j].children[k].children.length; s++) {
                                        initialsSelect.append(createOption(facultyArr[i].courses[j].children[k].children[s].getAttribute('initials')))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    })
    initialsSelect.addEventListener('change', () => {
        undoBtn.click()
        for (let i = 0; i < facultyArr.length; i++) {
            if (facultyArr[i].name == facultySelect.value) {
                for (let j = 0; j < facultyArr[i].courses.length; j++) {
                    if (facultyArr[i].courses[j].getAttribute('number') == courseSelect.value) {
                        let groups = facultyArr[i].courses[j].children
                        for (let k = 0; k < groups.length; k++) {
                            if (groups[k].getAttribute('id') == groupSelect.value) {
                                let students = groups[k].children
                                for (let m = 0; m < students.length; m++) {
                                    if (students[m].getAttribute('initials') == initialsSelect.value) {
                                        let subjects = students[m].children
                                        tbody.innerHTML = ''
                                        for (let n = 0; n < subjects.length; n++) {
                                            tbody.insertAdjacentHTML('beforeend', (setSubjectInfo(subjects[n].getAttribute('name'), n, subjects[n].textContent)))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    doneBtn.addEventListener('click', () => {
        let res = document.querySelector('#marks_result')
        let sum = 0, size = 0
        let checkboxArr = document.querySelectorAll('.checkbox')
        if (checkboxArr.length == 0) return;
        for (let i = 0; i < checkboxArr.length; i++) {
            if (checkboxArr[i].checked) {
                sum += Number(checkboxArr[i].value)
                size++
            }
        }
        res.innerHTML = ''
        let averageMark = (sum / size).toFixed(2)
        res.insertAdjacentHTML('beforeend', `Средний бал равен: 
        <span> ${averageMark}  </span>
        `)
    })
    undoBtn.addEventListener('click', () => {
        let res = document.querySelector('#marks_result')
        res.innerHTML = ''
        res.append('')
    })
})
















