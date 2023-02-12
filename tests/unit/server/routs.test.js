import pkg  from '@jest/globals'
import config from '../../../server/config.js'
import TestUtil from '../_Util/testUtil.js'

const {
    pages,
    location,
    constants: {
        CONTENT_TYPE
    }
} = config

pkg.describe('#Routs - test site for api response', () => {
    pkg.beforeEach(() => {
        pkg.jest.restoreAllMocks()
        pkg.jest.clearAllMocks()
    })
    
    pkg.test.todo('GET / - should redirect to home page', async () => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/'
        
        await handler(...params.values())

        pkg.expect(params.response.writeHead).toBeCalledWith(
            302,
            {
             'Location': location.home
            }   
        )
        pkg.expect(params.response.end).toHaveBeenCalled()
    })

    pkg.test(`GET /home - should response with ${pages.homeHTML} file stream`, async () => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/home'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        pkg.jest.spyOn (
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: {},
        })

        pkg.jest.spyOn (
            mockFileStream,
            "pipe"
        ).mockReturnValue()

        await handler(...params.values())

        pkg.expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML)
        pkg.expect(mockFileStream.pipe).toHaveBeenCalledWith(params, response)
    })

    pkg.test(`GET /controller - should response with ${pages.controlHTML} file stream`, async () => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/controller'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        pkg.jest.spyOn (
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: {},
        })

        pkg.jest.spyOn (
            mockFileStream,
            "pipe"
        ).mockReturnValue()

        await handler(...params.values())

        pkg.expect(Controller.prototype.getFileStream).toBeCalledWith(pages.controlHTML)
        pkg.expect(mockFileStream.pipe).toHaveBeenCalledWith(params, response)
    })

    pkg.test(`GET /file.ext - should response with file stream`, async () => {
        const params = TestUtil.defaultHandlerParams()
        const filename = '/file.ext'
        params.request.method = 'GET'
        params.request.url = filename
        const expectedType = '.ext'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        pkg.jest.spyOn (
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        pkg.jest.spyOn (
            mockFileStream,
            "pipe"
        ).mockReturnValue()

        await handler(...params.values())

        pkg.expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
        pkg.expect(mockFileStream.pipe).not.toHaveBeenCalled(params, response)
        pkg.expect(params.response.writeHead).toHaveBeenCalledWith()
    })

    pkg.test(`POST /unknow - given a inuxistent route in should response with 404`, async () => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'POST'
        params.request.url = '/unknow'

        await handler(...params.values())

        pkg.expect(params.response.writeHead).toHaveBeenCalledWith(404)
        pkg.expect(params.response.end).toHaveBeenCalled()
    })

    pkg.describe('exceptions', () => {
        pkg.test('given inexistent file it should respond with 404', async() => {
            const params = TestUtil.defaultHandlerParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'
            pkg.jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream
            ).mockRejectedValue(new Error('Error: ENOENT: no such file or directory'))
            await handler(...params.values())

            pkg.expect(params.response.writeHead).toHaveBeenCalledWith(404)
            pkg.expect(params.response.end).toHaveBeenCalled()
        })

        pkg.test('given an error file it should respond with 500', async() => {
            const params = TestUtil.defaultHandlerParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'
            pkg.jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream
            ).mockRejectedValue(new Error('Error:'))
            await handler(...params.values())

            pkg.expect(params.response.writeHead).toHaveBeenCalledWith(500)
            pkg.expect(params.response.end).toHaveBeenCalled()
        })
    })
})