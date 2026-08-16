import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAddresses, addAddress } from "../../redux/slices/addressSlice";
import paymentService from "../../services/paymentService";
import { clearCartState } from "../../redux/slices/cartSlice";
import { placeOrder } from "../../redux/slices/orderSlice";
import couponService from "../../services/couponService";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    addresses = [],
    loading: addressesLoading,
  } = useSelector((state) => state.address || {});

  const { placeOrderLoading } = useSelector(
    (state) => state.order || {},
  );

  const { items = [] } = useSelector(
    (state) => state.cart || {},
  );

  // ==========================================
  // ADDRESS
  // ==========================================

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

  // ==========================================
  // PAYMENT
  // ==========================================

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // ==========================================
  // COUPON
  // ==========================================

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // ==========================================
  // CART TOTAL
  // ==========================================

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      if (!item?.product) return sum;

      const price = Number(item.product.price) || 0;
      const quantity = Number(item.quantity) || 0;

      return sum + price * quantity;
    }, 0);
  }, [items]);

  // ==========================================
  // FINAL TOTAL
  // ==========================================

  const discount = Number(coupon?.discount) || 0;

  const finalAmount = Math.max(
    subtotal - discount,
    0,
  );

  // ==========================================
  // LOADING STATE
  // ==========================================

  const placeLoading =
    placeOrderLoading || paymentLoading;

  const selectedAddressId =
    selected ||
    addresses?.[0]?._id ||
    addresses?.[0]?.id ||
    null;

  // ==========================================
  // GET ADDRESSES
  // ==========================================

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  // ==========================================
  // ERROR MESSAGE
  // ==========================================

  const getErrorMessage = (
    err,
    fallback = "Something went wrong",
  ) => {
    if (typeof err === "string") {
      return err;
    }

    return (
      err?.message ||
      err?.response?.data?.message ||
      fallback
    );
  };

  // ==========================================
  // ADDRESS VALIDATION
  // ==========================================

  const validateAddress = (addr) => {
    const e = {};

    if (
      !addr.fullName ||
      addr.fullName.trim().length < 2
    ) {
      e.fullName = "Full name is required";
    }

    if (
      !addr.phone ||
      !/^\d{7,15}$/.test(
        addr.phone.replace(/\s|-/g, ""),
      )
    ) {
      e.phone = "Valid phone is required";
    }

    if (
      !addr.address ||
      addr.address.trim().length < 5
    ) {
      e.address = "Address is required";
    }

    if (
      !addr.city ||
      addr.city.trim().length < 2
    ) {
      e.city = "City is required";
    }

    if (
      !addr.state ||
      addr.state.trim().length < 2
    ) {
      e.state = "State is required";
    }

    if (
      !addr.pincode ||
      !/^\d{4,10}$/.test(addr.pincode.trim())
    ) {
      e.pincode = "Valid pincode is required";
    }

    return e;
  };

  // ==========================================
  // ADD ADDRESS
  // ==========================================

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const validation = validateAddress(newAddress);

    setErrors(validation);

    if (Object.keys(validation).length) {
      return;
    }

    setAddLoading(true);

    try {
      const payload = {
        fullName: newAddress.fullName,
        mobile: newAddress.phone,
        addressLine: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
      };

      const res = await dispatch(
        addAddress(payload),
      ).unwrap();

      const addedAddressId =
        res.address?._id ||
        res.address?.id;

      toast.success("Address added");

      setNewAddress({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });

      setErrors({});

      if (addedAddressId) {
        setSelected(addedAddressId);
      }

      dispatch(getAddresses());
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Failed to add address",
        ),
      );
    } finally {
      setAddLoading(false);
    }
  };

  // ==========================================
  // APPLY COUPON
  // ==========================================

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();

    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }

    if (subtotal <= 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCouponLoading(true);

    try {
      const res = await couponService.applyCoupon({
        code,
        totalAmount: subtotal,
      });

      if (!res?.success) {
        throw new Error(
          res?.message || "Unable to apply coupon",
        );
      }

      setCoupon({
        code: res.coupon?.code || code,
        discount: Number(res.discount) || 0,
        finalAmount:
          Number(res.finalAmount) || subtotal,
      });

      toast.success(
        `Coupon ${res.coupon?.code || code} applied`,
      );
    } catch (err) {
      console.error("Coupon error:", err);

      setCoupon(null);

      toast.error(
        getErrorMessage(
          err,
          "Invalid or expired coupon",
        ),
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // ==========================================
  // REMOVE COUPON
  // ==========================================

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");

    toast.success("Coupon removed");
  };

  // ==========================================
  // RAZORPAY SDK
  // ==========================================

  const loadRazorpay = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) {
        return resolve();
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve();

      script.onerror = () =>
        reject(
          new Error(
            "Razorpay SDK failed to load",
          ),
        );

      document.body.appendChild(script);
    });

  // ==========================================
  // RAZORPAY PAYMENT
  // ==========================================

  const startRazorpayPayment = async (
    createdOrder,
  ) => {
    await loadRazorpay();

    const payResp =
      await paymentService.createPaymentOrder(
        createdOrder._id,
      );

    if (
      !(
        payResp &&
        payResp.success &&
        payResp.order
      )
    ) {
      throw new Error(
        payResp?.message ||
          "Unable to initiate payment",
      );
    }

    const razorOrder = payResp.order;

    return new Promise(
      (resolve, reject) => {
        const options = {
          key: payResp.key_id,

          amount: razorOrder.amount,

          currency: razorOrder.currency,

          name: "My Store",

          description: `Order ${createdOrder._id}`,

          order_id: razorOrder.id,

          handler: async function (
            response,
          ) {
            try {
              const verifyRes =
                await paymentService.verifyPayment(
                  {
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,

                    orderId:
                      createdOrder._id,
                  },
                );

              if (verifyRes?.success) {
                resolve({
                  paid: true,
                });
              } else {
                reject(
                  new Error(
                    verifyRes?.message ||
                      "Payment verification failed",
                  ),
                );
              }
            } catch (err) {
              reject(err);
            }
          },

          modal: {
            ondismiss: function () {
              resolve({
                cancelled: true,
              });
            },
          },
        };

        const rzp =
          new window.Razorpay(options);

        rzp.GIMINI();
      },
    );
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error(
        "Please select or add a shipping address.",
      );
      return;
    }

    if (!paymentMethod) {
      toast.error(
        "Please select a payment method.",
      );
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setPaymentLoading(true);

    try {
      /*
       * IMPORTANT:
       * Current orderSlice/backend contract only
       * confirms addressId + paymentMethod.
       *
       * Coupon is therefore not added to this
       * payload yet. Backend order validation needs
       * to support couponId/code before doing that.
       */

      const res = await dispatch(
        placeOrder({
          addressId: selectedAddressId,
          paymentMethod,
        }),
      ).unwrap();

      if (
        !(
          res &&
          res.success &&
          res.order
        )
      ) {
        throw new Error(
          res?.message ||
            "Unable to place order",
        );
      }

      const createdOrder = res.order;

      dispatch(clearCartState());

      if (paymentMethod === "RAZORPAY") {
        try {
          const paymentResult =
            await startRazorpayPayment(
              createdOrder,
            );

          if (paymentResult.cancelled) {
            toast.error(
              "Payment cancelled. Order is saved in your orders.",
            );
          } else {
            toast.success(
              "Payment successful",
            );
          }
        } catch (err) {
          toast.error(
            getErrorMessage(
              err,
              "Order placed, but payment failed",
            ),
          );
        }
      } else {
        toast.success(
          "Order placed successfully",
        );
      }

      navigate("/orders");
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Unable to place order",
        ),
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f7f8fa]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

          {/* HEADER */}

          <div className="mb-8">

            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Secure checkout
            </p>

            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review your order and complete your purchase.
            </p>

          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

            {/* ======================================
                LEFT
            ====================================== */}

            <div className="space-y-6">

              {/* SHIPPING ADDRESS */}

              <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Choose where your order should be delivered.
                  </p>

                </div>

                <div className="p-5 sm:p-6">

                  {addressesLoading ? (
                    <div className="space-y-3">

                      {[1, 2].map((item) => (
                        <div
                          key={item}
                          className="h-20 rounded-xl bg-gray-100 animate-pulse"
                        />
                      ))}

                    </div>
                  ) : addresses?.length > 0 ? (
                    <div className="space-y-3">

                      {addresses.map((addr) => {
                        const addressId =
                          addr._id ||
                          addr.id;

                        const isSelected =
                          selectedAddressId ===
                          addressId;

                        return (
                          <label
                            key={addressId}
                            className={`block cursor-pointer rounded-xl border p-4 transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50/40"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >

                            <div className="flex gap-3">

                              <input
                                type="radio"
                                name="address"
                                checked={
                                  isSelected
                                }
                                onChange={() =>
                                  setSelected(
                                    addressId,
                                  )
                                }
                                className="mt-1 accent-blue-600"
                              />

                              <div className="min-w-0">

                                <p className="font-semibold text-gray-900">
                                  {addr.fullName ||
                                    addr.name}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                  {addr.mobile ||
                                    addr.phone}
                                </p>

                                <p className="text-sm text-gray-600 mt-1">
                                  {addr.addressLine ||
                                    addr.address}
                                </p>

                                <p className="text-sm text-gray-600">
                                  {[
                                    addr.city,
                                    addr.state,
                                    addr.pincode,
                                  ]
                                    .filter(Boolean)
                                    .join(
                                      ", ",
                                    )}
                                </p>

                              </div>

                            </div>

                          </label>
                        );
                      })}

                    </div>
                  ) : (
                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                      No saved addresses. Add one below.
                    </div>
                  )}

                </div>

              </section>

              {/* ADD ADDRESS */}

              <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Add New Address
                  </h2>

                </div>

                <form
                  onSubmit={handleAddAddress}
                  className="p-5 sm:p-6"
                >

                  <div className="grid sm:grid-cols-2 gap-4">

                    {/* NAME */}

                    <div>

                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Full Name
                      </label>

                      <input
                        value={
                          newAddress.fullName
                        }
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            fullName:
                              e.target.value,
                          })
                        }
                        type="text"
                        placeholder="Enter full name"
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName}
                        </p>
                      )}

                    </div>

                    {/* PHONE */}

                    <div>

                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Phone Number
                      </label>

                      <input
                        value={
                          newAddress.phone
                        }
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone:
                              e.target.value,
                          })
                        }
                        type="text"
                        placeholder="Enter phone number"
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}

                    </div>

                    {/* ADDRESS */}

                    <div className="sm:col-span-2">

                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Full Address
                      </label>

                      <textarea
                        value={
                          newAddress.address
                        }
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address:
                              e.target.value,
                          })
                        }
                        placeholder="House number, street, area..."
                        rows={3}
                        className="w-full px-3 py-3 rounded-lg border border-gray-200 bg-gray-50 outline-none resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address}
                        </p>
                      )}

                    </div>

                    {/* CITY */}

                    <div>

                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        City
                      </label>

                      <input
                        value={
                          newAddress.city
                        }
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            city:
                              e.target.value,
                          })
                        }
                        type="text"
                        placeholder="City"
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}

                    </div>

                    {/* STATE */}

                    <div>

                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        State
                      </label>

                      <input
                        value={
                          newAddress.state
                        }
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state:
                              e.target.value,
                          })
                        }
                        type="text"
                        placeholder="State"
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.state}
                        </p>
                      )}

                    </div>

                    {/* PINCODE */}

                    <div>

                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Pincode
                      </label>

                      <input
                        value={
                          newAddress.pincode
                        }
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            pincode:
                              e.target.value,
                          })
                        }
                        type="text"
                        placeholder="Pincode"
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pincode}
                        </p>
                      )}

                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={addLoading}
                    className="mt-5 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold disabled:opacity-50 transition"
                  >
                    {addLoading
                      ? "Adding..."
                      : "Add Address"}
                  </button>

                </form>

              </section>

              {/* PAYMENT */}

              <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h2>

                </div>

                <div className="p-5 sm:p-6 space-y-3">

                  {/* COD */}

                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "COD"
                        ? "border-blue-500 bg-blue-50/40"
                        : "border-gray-200"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={
                        paymentMethod ===
                        "COD"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value,
                        )
                      }
                      className="accent-blue-600"
                    />

                    <div>

                      <p className="font-semibold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Pay when your order arrives.
                      </p>

                    </div>

                  </label>

                  {/* RAZORPAY */}

                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod ===
                      "RAZORPAY"
                        ? "border-blue-500 bg-blue-50/40"
                        : "border-gray-200"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={
                        paymentMethod ===
                        "RAZORPAY"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value,
                        )
                      }
                      className="accent-blue-600"
                    />

                    <div>

                      <p className="font-semibold text-gray-900">
                        Razorpay
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Pay securely online.
                      </p>

                    </div>

                  </label>

                </div>

              </section>

            </div>

            {/* ======================================
                RIGHT ORDER SUMMARY
            ====================================== */}

            <aside className="lg:sticky lg:top-24 space-y-5">

              {/* COUPON */}

              <section className="bg-white border border-gray-200 rounded-2xl p-5">

                <h2 className="font-semibold text-gray-900">
                  Apply Coupon
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Have a discount code?
                </p>

                {!coupon ? (
                  <div className="mt-4 flex gap-2">

                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(
                          e.target.value
                            .toUpperCase(),
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      placeholder="ENTER CODE"
                      className="flex-1 min-w-0 h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold uppercase outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={
                        handleApplyCoupon
                      }
                      disabled={
                        couponLoading
                      }
                      className="px-4 h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50 transition"
                    >
                      {couponLoading
                        ? "..."
                        : "Apply"}
                    </button>

                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-xs text-green-700">
                          Coupon applied
                        </p>

                        <p className="font-bold text-green-800 mt-0.5">
                          {coupon.code}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={
                          handleRemoveCoupon
                        }
                        className="text-xs font-semibold text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                    <p className="text-xs text-green-700 mt-2">
                      You saved ₹
                      {discount.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                  </div>
                )}

              </section>

              {/* ORDER SUMMARY */}

              <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">

                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-3">

                  <div className="flex justify-between text-sm text-gray-600">

                    <span>
                      Items
                    </span>

                    <span>
                      {items.length}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm text-gray-600">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN",
                      )}
                    </span>

                  </div>

                  {coupon && (
                    <div className="flex justify-between text-sm text-green-600">

                      <span>
                        Coupon discount
                      </span>

                      <span className="font-semibold">
                        - ₹
                        {discount.toLocaleString(
                          "en-IN",
                        )}
                      </span>

                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">

                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      ₹
                      {finalAmount.toLocaleString(
                        "en-IN",
                      )}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    handlePlaceOrder
                  }
                  disabled={placeLoading}
                  className="w-full mt-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 transition"
                >
                  {placeLoading
                    ? "Processing..."
                    : paymentMethod ===
                      "RAZORPAY"
                    ? "Continue to Payment"
                    : "Place Order"}
                </button>

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  Your order will be processed securely.
                </p>

              </section>

            </aside>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Checkout;