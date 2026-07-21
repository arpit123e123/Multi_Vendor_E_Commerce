const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");


// CREATE RAZORPAY ORDER

const createPaymentOrder = async (req, res) => {

  try {

    const { orderId } = req.body;


    const dbOrder = await Order.findById(orderId);


    if (!dbOrder) {

      return res.status(404).json({
        success:false,
        message:"Order not found"
      });

    }



    if (
      dbOrder.user.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        success:false,
        message:"Not allowed"
      });

    }



    const options = {

      amount: dbOrder.totalAmount * 100,

      currency:"INR",

      receipt:`receipt_${dbOrder._id}`

    };



    const order = await razorpay.orders.create(options);



    dbOrder.razorpayOrderId = order.id;

    await dbOrder.save();



    res.status(200).json({

      success:true,

      order,

      key_id:process.env.RAZORPAY_KEY_ID

    });



  } catch(error) {


    console.log("Razorpay Error:", error);


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

};





// VERIFY PAYMENT

const verifyPayment = async (req,res)=>{


  try {


    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;



    const order = await Order.findById(orderId);



    if(!order){

      return res.status(404).json({

        success:false,

        message:"Order not found"

      });

    }



    if(
      order.user.toString() !==
      req.user._id.toString()
    ){

      return res.status(403).json({

        success:false,

        message:"Not allowed"

      });

    }



    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;



    const expectedSignature =
      crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");



    if(expectedSignature !== razorpay_signature){

      return res.status(400).json({

        success:false,

        message:"Payment verification failed"

      });

    }



    order.paymentStatus = "Paid";

    order.paymentId = razorpay_payment_id;

    order.razorpayOrderId = razorpay_order_id;


    await order.save();



    res.status(200).json({

      success:true,

      message:"Payment verified successfully",

      order

    });



  } catch(error){


    console.error(error);


    res.status(500).json({

      success:false,

      message:error.message

    });


  }


};



module.exports = {

  createPaymentOrder,

  verifyPayment

};