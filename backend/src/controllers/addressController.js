const Address = require("../models/Address");

const addAddress = async (req, res) => {
  try {

    const address = await Address.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      address,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAddresses = async (req, res) => {
  try {

    const addresses = await Address.find({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      addresses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
    addAddress,
    getAddresses,
}