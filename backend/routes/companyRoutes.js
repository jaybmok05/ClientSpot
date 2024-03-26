import express from 'express';
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { protect } from '../middleware/userAuthMiddleware.js';
import { checkCompanyOwnership } from '../middleware/companyMiddleware.js';

const router = express.Router();

router.route('/createCompany').post(protect, createCompany)
router.get('/listedCompanies', getCompanies);
router.route('/:id').get(protect, checkCompanyOwnership, getCompanyById).put(protect, checkCompanyOwnership, updateCompany).delete(protect, checkCompanyOwnership, deleteCompany);

export default router;
