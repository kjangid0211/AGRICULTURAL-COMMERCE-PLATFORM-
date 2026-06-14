const Enquiry = require('../models/Enquiry');

const createEnquiry = async (req, res) => {
  try {
    const { enquiryType, product, companyName, contactPerson, email, phone, quantity, message } = req.body;

    const enquiry = new Enquiry({
      enquiryType,
      product: product || undefined,
      companyName,
      contactPerson,
      email,
      phone,
      quantity,
      message,
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).populate('product').sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = status !== undefined ? status : enquiry.status;
      const updatedEnquiry = await enquiry.save();
      res.json(updatedEnquiry);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (enquiry) {
      await enquiry.deleteOne();
      res.json({ message: 'Enquiry removed' });
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
