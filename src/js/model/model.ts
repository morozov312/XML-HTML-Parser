import { DoneBtn, CancelBtn } from './buttons'

class Model {
    // public methods:
    constructor() {
        new DoneBtn('done-btn').startListener()
        new CancelBtn('cancel-btn').startListener()
    }
    public getXML(path: string): Promise<Element> {
        return new Promise((resolve: any, reject: any): void => {
            let xhr: XMLHttpRequest = new XMLHttpRequest()
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