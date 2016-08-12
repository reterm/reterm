import http from 'http'
import socket from 'socket.io'
import { spawn } from 'child_pty'

const port  = 3000

const app = http.createServer().listen(port)
const io = socket(app)

io.on('connection', sock => {
  const pty = spawn('/bin/sh', ['--login'])
  pty.stdout.on('data', data => {
    sock.emit('new', data.toString('utf8'))
  })

  sock.on('new', data => {
    pty.stdin.write(data)
	})

  sock.on('disconnect', () => {
    console.log("end")
    pty.kill('SIGHUP')
  })
})

process.on('exit', () => {
  pty.kill('SIGHUP')
})

console.log('Listening on http://0.0.0.0:' + port)
