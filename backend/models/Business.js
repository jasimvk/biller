const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  buildingNo: String,
  premisesName: String,
  street: String,
  locality: String,
  city: String,
  district: String,
  state: String,
  pinCode: String
});

const businessSchema = new mongoose.Schema({
  tradeName: String,
  legalName: String,
  gstin: { type: String, unique: true },
  pan: String,
  udyamNumber: String,
  mobile: String,
  email: String,
  website: String,
  registeredAddress: addressSchema,
  branchAddress: addressSchema,
  godownAddress: addressSchema,
  businessType: String,
  registrationType: String,
  preferences: {
    addLogo: { type: Boolean, default: false },
    addBranch: { type: Boolean, default: false },
    addGodown: { type: Boolean, default: false }
  },
  logo: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Business', businessSchema); 