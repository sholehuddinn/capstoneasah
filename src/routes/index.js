import express from 'express';
const router = express.Router();

import { testConnection } from '../controller/tes.js';
import { createAssessment } from '../controller/assessmentController.js';
import { handleFeedback } from '../controller/feedbackController.js';
import { getTutorialId, getTutorials } from '../controller/tutorialController.js';
import { registerUser, loginUser, getProfile } from '../controller/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { editPreferenceController } from '../controller/preferenceController.js';
import { resetProgressController } from "../controller/progressController.js"
import { getQuestionsByUser } from "../controller/questionController.js"

router.get('/', (req, res) => res.send('Wellcome to the API Capstone Project'));
router.get('/test', testConnection);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authMiddleware, getProfile);
router.patch('/users/preference', authMiddleware, editPreferenceController)
router.get('/tutorials/:id', authMiddleware, getTutorialId);
router.get('/tutorials', authMiddleware, getTutorials);
router.get('/assessment/tutorial/:tutorial_id', authMiddleware, createAssessment);
router.post("/submit/tutorial/:tutorial_id/assessment/:assessment_id", authMiddleware, handleFeedback);
router.get('/progress-reset', authMiddleware, resetProgressController);
router.get('/questions-final', authMiddleware, getQuestionsByUser)

export default router;