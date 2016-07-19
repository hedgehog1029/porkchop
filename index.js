const net = require("net");
const chalk = require("chalk");

const randomId = () => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    var length = 8;

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}

    return str;
}

const server = net.createServer();
const sockets = {};

const emit = (socket, msg) => {
    Object.keys(sockets).forEach(s => {
        if (socket.id == s) return;

        sockets[s].write(chalk.bold(`[${socket.id}]`) + ` ${msg}`);
    })
}

server.on("connection", socket => {
    var id = randomId();

    socket.id = id;
    sockets[id] = socket;

    socket.write(chalk.bgWhite.black("porkchop - chat for the minimalists\r\nyour id: " + id + "\r\n"))

    socket.on("data", data => {
        emit(socket, data)
    });

    socket.on("close", err => {
        delete sockets[socket.id];
    })
});

server.listen(5000);
console.log("Listening on ::5000");
