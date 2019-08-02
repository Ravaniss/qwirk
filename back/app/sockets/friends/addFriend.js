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
const User_1 = require("../../models/User");
const addFriend = (instance, socket) => {
    socket.on('addFriend', (data) => __awaiter(this, void 0, void 0, function* () {
        const { DB } = instance;
        const userDb = new User_1.User(DB);
        const { user, friend } = data;
        const friendCursor = yield userDb.filter({ pseudo: friend });
        const requestedFriend = yield friendCursor.toArray();
        if (requestedFriend.length === 0) {
            return socket.emit('sendFriendRequest', {
                requestResult: false
            });
        }
        // Need to fix index
        yield userDb.addFriend(user, {
            from: user,
            status: 2,
            requestedBy: true,
            to: requestedFriend[0].id
        });
        yield userDb.addFriend(requestedFriend[0].id, {
            from: requestedFriend[0].id,
            status: 2,
            requestedBy: false,
            to: user
        });
        socket.emit('sendFriendRequest', {
            requestResult: true,
            pseudo: requestedFriend[0].pseudo
        });
    }));
};
exports.addFriend = addFriend;