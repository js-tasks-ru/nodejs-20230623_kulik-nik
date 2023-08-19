const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Session = require('../models/Session');
const Product = require('../models/Product');
const mapOrder = require('../mappers/order');
const mapOrderConfirmation = require('../mappers/orderConfirmation');



module.exports.checkout = async function checkout(ctx, next) {
    const {product: productId, phone, address} = ctx.request.body;

    const order = await new Order({
        user: ctx.user.id,
        product: productId,
        phone,
        address
    }).save();


    const product = await Product.findOne({
        _id: productId,
    });

    await sendMail({
        template: 'order-confirmation',
        locals: mapOrderConfirmation(order, product),
        to: ctx.user.email,
    });

    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {


    const orders = (await Order.find({
        user: ctx.user.id,
    })).map((order)=> mapOrder(order));


    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.body = {orders};
};
