// Admin: band booking requests
const service = require('../../services/admin/bandBookingService');

const wrap = (fn, status = 200) => async (req, res, next) => {
  try { res.status(status).json({ success: true, ...(await fn(req)) }); } catch (err) { next(err); }
};
const id = req => Number(req.params.id);

exports.list = wrap(req => service.list(req.query.tab));
exports.people = wrap(async () => ({ people: await service.people() }));
exports.check = wrap(req => service.availability({ date: req.query.date, start: req.query.start }));
exports.create = wrap(req => service.create(req.body), 201);
exports.approve = wrap(req => service.approve(id(req)));
exports.decline = wrap(req => service.decline(id(req), req.body.reason));
exports.reopen = wrap(req => service.reopen(id(req)));
exports.cancel = wrap(req => service.cancel(id(req)));
exports.suggest = wrap(req => service.suggest(id(req), req.body.start));