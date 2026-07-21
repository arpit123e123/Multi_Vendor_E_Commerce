const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(

  {

    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    items: [

      {

        product: {

          type: mongoose.Schema.Types.ObjectId,

          ref: "Product",

          required: true,

        },


        quantity: {

          type: Number,

          required: true,

        },


        price: {

          type: Number,

          required: true,

        },

      },

    ],




    address: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Address",

      required: true,

    },




    totalAmount: {

      type: Number,

      required: true,

    },




    paymentMethod: {

      type: String,

      enum: [
        "COD",
        "RAZORPAY"
      ],

      default: "COD",

      required: true,

    },



    paymentId: {

      type: String,

    },



    razorpayOrderId: {

      type: String,

    },



    paymentStatus: {

      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed"
      ],

      default: "Pending",

    },





    // Order Current Status

    orderStatus: {

      type: String,

      enum: [

        "Placed",

        "Confirmed",

        "Packed",

        "Shipped",

        "Out For Delivery",

        "Delivered",

        "Cancelled",

      ],

      default: "Placed",

    },





    // Order Tracking Timeline

    trackingHistory: [

      {

        status: {

          type: String,

          required: true,

        },


        message: {

          type: String,

          required: true,

        },


        updatedAt: {

          type: Date,

          default: Date.now,

        },

      },

    ],



    deliveredAt: {

      type: Date,

    },



    cancelledAt: {

      type: Date,

    },


  },

  {

    timestamps: true,

  }

);



module.exports = mongoose.model(
  "Order",
  orderSchema
);