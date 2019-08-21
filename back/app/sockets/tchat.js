"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helper_1 = require("../../scripts/Helper");
const config_1 = require("../../config/config");
const User_1 = require("../models/User");
const Channel_1 = require("../models/Channel");
const ElasticSearch_1 = require("../../scripts/class/ElasticSearch");
const tchat = (instance, socket) => {
    const { DB } = instance;
    const user = new User_1.User(DB);
    const channel = new Channel_1.Channel(DB);
    socket.on('SEND::MESSAGE', (data) => __awaiter(this, void 0, void 0, function* () {
        const convId = data.route.convId;
        const content = data.content;
        const userId = data.author.id;
        const cursor = yield channel.insertMessage(convId, {
            userId,
            content,
            postedAt: new Date()
        });
        if (!cursor) {
            return;
        }
        const msg = yield channel.getLastMessage(convId);
        msg.user = yield user.get(userId);
        let channelName = `ch-${convId}`;
        config_1.pusher.trigger(channelName, 'receive', {
            msg
        });
    }));
    socket.on('GET::MESSAGES', (serverId) => __awaiter(this, void 0, void 0, function* () {
        const cursor = yield channel.getMessages(serverId);
        const messages = yield cursor.toArray();
        const messagesToInsert = [];
        for (let message of messages) {
            message.user = yield user.get(message.userId);
            messagesToInsert.push({
                avatar: message.user.avatar,
                pseudo: message.user.pseudo,
                content: message.content
            });
        }
        const health = yield new ElasticSearch_1.ElasticSearch();
        yield health.connect();
        yield health.readAndInsertData(messagesToInsert);
        socket.emit('updateMessage', messages);
    }));
    socket.on('GET::SERVERS', (userId) => __awaiter(this, void 0, void 0, function* () {
        const cursor = yield user.getServers(userId);
        const serversId = yield cursor.toArray();
        const servers = yield Helper_1.getDatas(serversId, (channelId) => __awaiter(this, void 0, void 0, function* () {
            return yield channel.getSpecificData(channelId, 'icon', 'name');
        }));
        socket.emit('updateServers', servers);
    }));
    socket.on('GET::CHANNELS::NAME', (serverId) => __awaiter(this, void 0, void 0, function* () {
        const name = yield channel.getServerName(serverId);
        const channelsName = yield channel.getChannelsName(serverId);
        socket.emit('updateChannel', { name, channelsName });
    }));
    socket.on('GET::USERS', (channelId) => __awaiter(this, void 0, void 0, function* () {
        const cursor = yield channel.getUsers(channelId);
        const users = yield cursor.toArray();
        const usersInChannel = yield Helper_1.getDatas(users, (u) => __awaiter(this, void 0, void 0, function* () {
            return yield user.getSpecificData(u.userId, 'pseudo', 'avatar', 'status', 'tag');
        }));
        socket.emit('getUsersFromChannel', usersInChannel);
    }));
};
exports.tchat = tchat;
