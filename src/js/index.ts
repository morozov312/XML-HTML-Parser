'use strict'

import SlimSelect from 'slim-select'
import SelectFactory from './select'

let facultyList: SlimSelect = new SelectFactory('faculty').create()
let courseList: SlimSelect = new SelectFactory('course').create()
let groupList: SlimSelect = new SelectFactory('group').create()
let studentList: SlimSelect = new SelectFactory('student').create()

function getXML(path: string) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(xhr.responseXML.firstChild)
            }
        }
        xhr.open("GET", path, true)
        xhr.send()
    })
}

async function loadBase() {
    let c: any = await getXML('../universityBase.xml')
    console.log(c.getElementsByTagName('student')[0].parentNode.getAttribute('id'));
    return c
}
loadBase()

// console.log(loadBase());


