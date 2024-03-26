import asyncHandler from 'express-async-handler';
import Company from '../models/company.js';
import User from '../models/user.js';

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private
// Create a company
const createCompany = asyncHandler(async (req, res) => {
  const {
      companyName,
      contactNumber,
      description,
      servicesOffered,
      address,
      images,
      socialLinks,
      profilePicture,
      attachments
  } = req.body;

  try {
      // Get the logged-in user's ID and name
      const { _id, email, firstName, lastName } = req.user;

      // Check if the user already has a company
      const existingCompany = await Company.findOne({ owner: _id });

      if (existingCompany) {
          return res.status(400).json({ message: 'You already have a company created. You can only update.' });
      }

      // Validate the contactNumber format (must contain only numbers and have country code format)
      const contactNumberRegex = /^\+[0-9]{1,3}-?[0-9]{6,14}$/;
      if (!contactNumberRegex.test(contactNumber)) {
          return res.status(400).json({ message: 'Invalid contact number format. Please provide a valid phone number with country code.' });
      }
      //if contact is not provided, make it empty
      if (!contactNumber) {
          contactNumber = '';
      }


      // Create a new company
      const newCompany = new Company({
          companyName,
          contactNumber,
          email: email,
          description,
          servicesOffered,
          owner: _id,
          owner_name: firstName,
          owner_surname: lastName,
          address,
          images,
          socialLinks,
          profilePicture,
          attachments
      });

      // Save the new company
      await newCompany.save();

      res.status(201).json({ message: 'Company created successfully', company: newCompany });
  } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({});
  res.json(companies);
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  console.log(req.params.id);

  if (company) {
    res.json(company);
  } else {
    res.status(404).json({ message: 'Company not found' });
  }
});



// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private
const updateCompany = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    const {
        companyName,
        contactNumber,
        description,
        servicesOffered,
        address,
        images,
        socialLinks,
        profilePicture,
        attachments
    } = req.body;

    try {

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        if (contactNumber) {
          // Validate the contactNumber format (must contain only numbers and have country code format)
          const contactNumberRegex = /^\+[0-9]{1,3}-?[0-9]{6,14}$/;
          if (!contactNumberRegex.test(contactNumber)) {
              return res.status(400).json({ message: 'Invalid contact number format. Please provide a valid phone number with country code.' });
          }
      
          // Update company contactNumber only if it's provided and valid
          company.contactNumber = contactNumber;
      }

        // Update company fields
        company.companyName = companyName || company.companyName;
        company.description = description || company.description;
        company.servicesOffered = servicesOffered || company.servicesOffered;
        company.address = address || company.address;
        company.images = images || company.images;
        company.socialLinks = socialLinks || company.socialLinks;
        company.profilePicture = profilePicture || company.profilePicture;
        company.attachments = attachments || company.attachments;

        // Save updated company
        await company.save();

        res.status(200).json({ message: 'Company updated successfully', company: company });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (company) {
    await Company.deleteOne({ _id: req.params.id });
    res.json({ message: 'Company removed' });
  } else {
    res.status(404).json({ message: 'Company not found' });
  }
});

export { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };