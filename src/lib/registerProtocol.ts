import path from "path";
import fs from "fs";
import mime from "mime";

export const FileProtocol = `media:///`;

export function registerFileProtocol(session: Electron.Session) {
    session.protocol.handle("media", (request) => {
        try {
            const url = request.url.slice(FileProtocol.length)
            const filePath = path.normalize(decodeURIComponent(url))

            // const allowedBasePath = app.getAppPath();
            // if (!filePath.startsWith(allowedBasePath)) {
            //   console.error('Security Violation: Forbidden path access attempt:', filePath);
            //   return new Response('Forbidden', { status: 403 });
            // }

            if (!fs.existsSync(filePath)) {
                return new Response('File not found', { status: 404 })
            }

            const mimeType = mime.getType(filePath) || 'application/octet-stream'

            const stat = fs.statSync(filePath)
            const fileSize = stat.size
            const range = request.headers.get('range')

            const headers: Record<string, string> = {
                'Content-Type': mimeType,
                'Accept-Ranges': 'bytes'
            }

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

                if (start >= fileSize || end >= fileSize) {
                    return new Response(null, { status: 416, headers })
                }

                const chunksize = end - start + 1

                const stream = fs.createReadStream(filePath, { start, end })

                headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`
                headers['Content-Length'] = chunksize.toString()

                return new Response(stream, {
                    status: 206,
                    headers
                })
            } else {
                const stream = fs.createReadStream(filePath)
                headers['Content-Length'] = fileSize.toString()

                return new Response(stream, {
                    status: 200,
                    headers
                })
            }
        } catch (error) {
            return new Response('Internal Server Error: ' + (error as Error).message, { status: 500 })
        }
    })
}