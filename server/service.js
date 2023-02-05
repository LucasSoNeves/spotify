import fs, { createReadStream } from "fs";
import fsPromises from "fs/promises"

import { join, extname } from "path";
import config from "./config.js";

const {
    dir: {
        publicDirectory
    }
} = config

export class Service {
    creatFileStream(filename) {
        return fs.createReadStream(filename)
    }

    async getFileInfo(file) {
        // file = home/index.html
        const fullFilePath = join(publicDirectory, file);
        //valida se existe
        await fsPromises.access(fullFilePath);
        const fileType = extname(fullFilePath);
        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(file) {
        const {
            name,
            type
        } = await this.getFileInfo(file)
        return {
            stream: this.creatFileStream(name),
            type
        }
    }
}