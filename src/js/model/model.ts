'use strict'

class Parser {
    getXML(path: string): Promise<Element> {
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
export default Parser