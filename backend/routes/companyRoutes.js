import express from 'express';
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { protect, isAdmin } from '../middleware/userAuthMiddleware.js';
import { checkCompanyOwnership } from '../middleware/companyMiddleware.js';

const router = express.Router();

router.route('/createCompany').post(protect, createCompany)
router.get('/listedCompanies', getCompanies);
router.route('/:id').get(protect, getCompanyById).put(protect, checkCompanyOwnership, updateCompany);
router.delete('/admin/:id', protect, isAdmin, deleteCompany);

export default router;
