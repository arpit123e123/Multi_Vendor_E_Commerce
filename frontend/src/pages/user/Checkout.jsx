import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAddresses, addAddress } from "../../redux/slices/addressSlice";
import paymentService from "../../services/paymentService";
import { clearCartState } from "../../redux/slices/cartSlice";
import { placeOrder } from "../../redux/slices/orderSlice";
import {
  applyCoupon,
  clearCoupon,
} from "../../redux/slices/couponSlice";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses = [], loading: addressesLoading } = useSelector((state) => state.address || {});
  const { placeOrderLoading } = useSelector((state) => state.order || {});
const {
  discount,
  finalAmount,
  appliedCoupon,
} = useSelector((state) => state.coupon || {});

  const [selected, setSelected] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentLoading, setPaymentLoading] = useState(false);
const [couponCode, setCouponCode] = useState("");

  const placeLoading = placeOrderLoading || paymentLoading;
  const selectedAddressId = selected || addresses?.[0]?._id || addresses?.[0]?.id || null;

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  const getErrorMessage = (err, fallback = "Something went wrong") => {
    if (typeof err === "string") return err;
    return err?.message || err?.response?.data?.message || fallback;
  };

  const validateAddress = (addr) => {
    const e = {};
    if (!addr.fullName || addr.fullName.trim().length < 2) e.fullName = "Full name is required";
    if (!addr.phone || !/^\d{7,15}$/.test(addr.phone.replace(/\s|-/g, ""))) e.phone = "Valid phone is required";
    if (!addr.address || addr.address.trim().length < 5) e.address = "Address is required";
    if (!addr.city || addr.city.trim().length < 2) e.city = "City is required";
    if (!addr.state || addr.state.trim().length < 2) e.state = "State is required";
    if (!addr.pincode || !/^\d{4,10}$/.test(addr.pincode.trim())) e.pincode = "Valid pincode is required";
    return e;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const validation = validateAddress(newAddress);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setAddLoading(true);
    try {
      // map frontend fields to backend shape
      const payload = {
        fullName: newAddress.fullName,
        mobile: newAddress.phone,
        addressLine: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
      };

      const res = await dispatch(addAddress(payload)).unwrap();
      const addedAddressId = res.address?._id || res.address?.id;

      toast.success("Address added");
      setNewAddress({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      if (addedAddressId) setSelected(addedAddressId);
      dispatch(getAddresses());
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to add address"));
    } finally {
      setAddLoading(false);
    }
  };
const handleApplyCoupon = async () => {
  if (!couponCode.trim()) {
    toast.error("Enter coupon code");
    return;
  }

  try {
    await dispatch(
      applyCoupon({
        code: couponCode,
        totalAmount: 0,
      })
    ).unwrap();

    toast.success("Coupon Applied");
  } catch (err) {
    toast.error(getErrorMessage(err, "Invalid Coupon"));
  }
};
const removeCoupon = () => {
  dispatch(clearCoupon());
  setCouponCode("");
  toast.success("Coupon Removed");
};
  const loadRazorpay = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(script);
    });

  const startRazorpayPayment = async (createdOrder) => {
    await loadRazorpay();

    const payResp = await paymentService.createPaymentOrder(createdOrder._id);

    if (!(payResp && payResp.success && payResp.order)) {
      throw new Error(payResp?.message || "Unable to initiate payment");
    }

    const razorOrder = payResp.order;

    return new Promise((resolve, reject) => {
      const options = {
        key: payResp.key_id,
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: "My Store",
        description: `Order ${createdOrder._id}`,
        order_id: razorOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id,
            });

            if (verifyRes && verifyRes.success) {
              resolve({ paid: true });
            } else {
              reject(new Error(verifyRes?.message || "Payment verification failed"));
            }
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: function () {
            resolve({ cancelled: true });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a shipping address.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setPaymentLoading(true);

    try {
      const res = await dispatch(
        placeOrder({ addressId: selectedAddressId, paymentMethod })
      ).unwrap();

      if (!(res && res.success && res.order)) {
        throw new Error(res?.message || "Unable to place order");
      }

      const createdOrder = res.order;
      dispatch(clearCartState());

      if (paymentMethod === "RAZORPAY") {
        try {
          const paymentResult = await startRazorpayPayment(createdOrder);
          if (paymentResult.cancelled) {
            toast.error("Payment cancelled. Order is saved in your orders.");
          } else {
            toast.success("Payment successful");
          }
        } catch (err) {
          toast.error(getErrorMessage(err, "Order placed, but payment failed"));
        }
      } else {
        toast.success("Order placed successfully");
      }

      navigate("/orders");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to place order"));
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <MainLayout>
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

        {addressesLoading && <p>Loading addresses...</p>}

        {addresses && addresses.length > 0 ? (
          <div className="space-y-3 mb-4">
            {addresses.map((addr) => (
              <label key={addr._id || addr.id} className="flex items-start gap-3">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === (addr._id || addr.id)}
                  onChange={() => setSelected(addr._id || addr.id)}
                />
                <div>
                  <div className="font-semibold">{addr.fullName || addr.name}</div>
                  <div className="text-sm">{addr.mobile || addr.phone}</div>
                  <div className="text-sm">{addr.addressLine || addr.address}</div>
                  <div className="text-sm">
                    {[addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <p className="mb-4">No saved addresses. Add one below.</p>
        )}

        <form onSubmit={handleAddAddress} className="mb-4 space-y-2">
          <div>
            <input
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              type="text"
              placeholder="Full Name"
              className="border w-full p-2 rounded"
            />
            {errors.fullName && <div className="text-red-500 text-sm">{errors.fullName}</div>}
          </div>

          <div>
            <input
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              type="text"
              placeholder="Phone Number"
              className="border w-full p-2 rounded"
            />
            {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
          </div>

          <div>
            <textarea
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              placeholder="Full Address"
              className="border w-full p-2 rounded"
            />
            {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <input
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                type="text"
                placeholder="City"
                className="border w-full p-2 rounded"
              />
              {errors.city && <div className="text-red-500 text-sm">{errors.city}</div>}
            </div>

            <div>
              <input
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                type="text"
                placeholder="State"
                className="border w-full p-2 rounded"
              />
              {errors.state && <div className="text-red-500 text-sm">{errors.state}</div>}
            </div>

            <div>
              <input
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                type="text"
                placeholder="Pincode"
                className="border w-full p-2 rounded"
              />
              {errors.pincode && <div className="text-red-500 text-sm">{errors.pincode}</div>}
            </div>
          </div>

          <div className="py-2">
            <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Razorpay</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={addLoading}
              className={`bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded ${addLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {addLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Address"
              )}
            </button>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placeLoading}
              className={`bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded ${placeLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {placeLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
        
      </div>
      
    </div>
   </MainLayout>
  );
};

export default Checkout;
