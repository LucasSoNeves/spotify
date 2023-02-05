import { Service } from "./service.js";

export class Controller {
    constructor() {
        this.Service = new Service()
    }
    async getFileStream(filename) {
        return this.service.getFileStream(filename)
    }
}