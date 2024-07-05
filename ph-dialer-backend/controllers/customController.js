// customController.js
const CustomModel = require("../models/customModel");
const asyncHandler = require("express-async-handler");

const customFieldData = async (req, res) => {
  const { salutation, lastName, email, phoneNumber, message } = req.body;

  try {
    if (!lastName || !email) {
      return res
        .status(400)
        .json({ message: "Last Name and Email are required fields" });
    }

    let formExists = await CustomModel.findOne({ email });

    if (formExists) {
      formExists.salutation = salutation;
      formExists.lastName = lastName;
      formExists.phoneNumber = phoneNumber;
      formExists.message = message;
      await formExists.save();
      return res
        .status(200)
        .json({ message: "User data updated successfully", data: formExists });
    } else {
      const customData = new CustomModel({
        salutation,
        lastName,
        email,
        phoneNumber,
        message,
      });
      await customData.save();
      return res
        .status(201)
        .json({ message: "Form data saved successfully", data: customData });
    }
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({ message: "Error saving data", error });
  }
};

const getcustomfielddata = asyncHandler(async (req, res, next) => {
  try {
    const allfromdata = await CustomModel.find();
    res.status(200).json({
      success: true,
      data: allfromdata, 
    });
  } catch (error) {
    next(new Error("Error fetching users"));
  }
});

module.exports = { customFieldData, getcustomfielddata };
