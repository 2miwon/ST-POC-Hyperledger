"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICE_SCALE = exports.Transaction = void 0;
const PRICE_SCALE = 1000;
exports.PRICE_SCALE = PRICE_SCALE;
class Transaction {
    constructor(st_id, trade_id, price, qty, from_address, to_address, created_at) {
        this.trade_id = trade_id;
        this.st_id = st_id;
        this.price = price;
        this.qty = qty;
        this.from_address = from_address;
        this.to_address = to_address;
        this.created_at = created_at;
    }
    static fromTrade(trade) {
        let from_address;
        let to_address;
        if (trade.is_buyer_maker) {
            from_address = trade.maker_order.user_id;
            to_address = trade.taker_order.user_id;
        }
        else {
            from_address = trade.taker_order.user_id;
            to_address = trade.maker_order.user_id;
        }
        return new Transaction(trade.st_id, trade.id, trade.price, trade.qty, from_address, to_address, trade.traded_at);
    }
}
exports.Transaction = Transaction;
