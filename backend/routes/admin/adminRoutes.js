const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const { requireAuth, requireRole } = require('../../middleware/auth');
const bandController = require('../../controllers/admin/bandBookingController');
const { validateCoach, validateCoachUpdate, validateBandBooking, validateAvailabilityQuery, validateReason, validateSlot } = require('../../middleware/validate');

router.use(requireAuth, requireRole('admin'));

router.get('/overview', adminController.overview);
router.get('/coaches', adminController.listCoaches);
router.post('/coaches', validateCoach, adminController.createCoach);
router.post('/coaches/:id/invite', adminController.resendInvite);
router.patch('/coaches/:id', validateCoachUpdate, adminController.updateCoach);

// Band bookings (fixed addresses first, then the ones with an :id)
router.get('/band-bookings', bandController.list);
router.get('/band-bookings/people', bandController.people);
router.get('/band-bookings/check', validateAvailabilityQuery, bandController.check);
router.post('/band-bookings', validateBandBooking, bandController.create);
router.post('/band-bookings/:id/approve', bandController.approve);
router.post('/band-bookings/:id/decline', validateReason, bandController.decline);
router.post('/band-bookings/:id/reopen', bandController.reopen);
router.post('/band-bookings/:id/cancel', bandController.cancel);
router.post('/band-bookings/:id/suggest', validateSlot, bandController.suggest);

module.exports = router;