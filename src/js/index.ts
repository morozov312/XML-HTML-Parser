'use strict'
import SlimSelect from 'slim-select'
import SelectFactory from './select'
let facultyList: SlimSelect = new SelectFactory('faculty').create()
let courseList: SlimSelect = new SelectFactory('course').create()
let groupList: SlimSelect = new SelectFactory('group').create()
let studentList: SlimSelect = new SelectFactory('student').create()