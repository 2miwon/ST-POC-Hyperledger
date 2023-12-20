const PRICE_SCALE: number = 1000;

interface ISt {
    id: number;
    ticker: string;
    channel_id: number;
    total_supply: number;
    issued_supply: number;
    issued_pct: number;
    mark_price: number;
    price_tick: number;
    qty_tick: number;
}

interface IOrder {
    id: number;
    user_id: number;
    st_id: number;
    type: string;
    side: string;
    price: number; //price is scaled by 10^6
    qty: number;
    filled_qty: number;
    remaining_qty: number;
    status: string;
    created_at: number;
    updated_at?: number;
    deleted_at?: number;
}

interface ITrade {
    id: number;
    st_id: number;
    price: number;
    qty: number;
    traded_at: number;
    maker_order: IOrder;
    taker_order: IOrder;
    is_buyer_maker: boolean;
}

interface ITransaction {
    trade_id: number;
    st_id: number;
    price: number;
    qty: number;
    from_address: number;
    to_address: number;
    created_at: number;
}

class Transaction implements ITransaction {
    trade_id: number;
    st_id: number;
    price: number;
    qty: number;
    from_address: number;
    to_address: number;
    created_at: number;

    constructor(
        st_id: number,
        trade_id: number,
        price: number,
        qty: number,
        from_address: number,
        to_address: number,
        created_at: number
    ) {
        this.trade_id = trade_id;
        this.st_id = st_id;
        this.price = price;
        this.qty = qty;
        this.from_address = from_address;
        this.to_address = to_address;
        this.created_at = created_at;
    }

    static fromTrade(trade: ITrade) {
        let from_address: number;
        let to_address: number;
        if (trade.is_buyer_maker) {
            from_address = trade.maker_order.user_id;
            to_address = trade.taker_order.user_id;
        } else {
            from_address = trade.taker_order.user_id;
            to_address = trade.maker_order.user_id;
        }
        return new Transaction(
            trade.st_id,
            trade.id,
            trade.price,
            trade.qty,
            from_address,
            to_address,
            trade.traded_at
        );
    }
}

export { ISt, IOrder, ITrade, ITransaction, Transaction, PRICE_SCALE };
