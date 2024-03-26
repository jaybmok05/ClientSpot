import asyncHandler from 'express-async-handler';
import Company from '../models/company.js';

const checkCompanyOwnership = asyncHandler(async (req, res, next) => {
  // Check if the user is authenticated
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not logged in');
  }

  // Retrieve the company ID from the request parameters or body
  const companyId = req.params.id || req.body.companyId;

  // Retrieve the company from the database
  const company = await Company.findById(companyId);

  // Check if the company exists
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  // Check if the logged-in user is the owner of the company
  if (company.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized, user is not the owner of the company');
  }

  // If the user is the owner, attach the company object to the request
  req.company = company;

  // Move to the next middleware or route handler
  next();
});

export { checkCompanyOwnership };
