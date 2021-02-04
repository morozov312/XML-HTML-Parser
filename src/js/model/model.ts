import { DoneBtn, CancelBtn } from './buttons'
/**
 * Module - part of MVC pattern
 * Responsible for event handling and data receiving
 * @class
 * @module
 */
class Model {
    // public methods:
    constructor() {
        try {
            new DoneBtn('done-btn').startListener()
            new CancelBtn('cancel-btn').startListener()
        } catch (error) {
            console.error(error.message);
        }
    }
    /**
     * Get data from XML using XHR
     * @param path - path to .xml file
     * @returns {Promise<Element>} - in case of success return xml data
     * @returns {Promise<number>} - in case of error return error status
     * @async
     */
    public getXML(path: string): Promise<Element>
    public getXML(path: string): Promise<number>
    public getXML(path: string) {
        return new Promise((resolve: any, reject: any): void => {
            const xhr: XMLHttpRequest = new XMLHttpRequest()
            xhr.onreadystatechange = (): void => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200)
                        resolve(xhr.responseXML.firstChild)
                    else
                        reject(xhr.status)
                }
            }
            xhr.open("GET", path, true)
            xhr.send()
        })
    }
}

export default Model