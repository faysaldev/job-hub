/** Opt-in, non-destructive Phase 5 index rollout. Run against staging first. */
require('dotenv').config();
const mongoose = require('mongoose');
if (process.env.PHASE5_BUILD_INDEXES !== '1') {
  console.error('Dry-run only. Set PHASE5_BUILD_INDEXES=1 after backup + staging verification.');
  process.exit(2);
}
const models = {
  candidates: require('../dist/domains/Seeker/company-candidate.model').default,
  follows: require('../dist/domains/SavedJobs/company-follow.model').default,
  interviews: require('../dist/domains/Interviews/interviews.model').default,
  notifications: require('../dist/domains/Notifications/notifications.model').default,
};
const connect = require('../dist/config/db').default;
(async () => {
  try {
    await connect();
    for (const [name, model] of Object.entries(models)) {
      const fields = name === 'candidates' ? ['companyId','seekerId'] : name === 'follows' ? ['userId','companyId'] :
        name === 'interviews' ? ['interviewer','startAt'] : ['dedupeKey'];
      const match = name === 'interviews' ? { status: 'scheduled', startAt: { $type: 'date' } } :
        name === 'notifications' ? { dedupeKey: { $exists: true } } : {};
      const duplicates = await model.aggregate([ { $match: match },
        { $group: { _id: Object.fromEntries(fields.map(f=>[f,`$${f}`])), n: {$sum:1} } },
        { $match: { n: {$gt:1} } }, {$limit: 10} ]);
      if (duplicates.length) throw new Error(`${name}: duplicate records found; reconcile manually before creating indexes`);
      await model.createIndexes(); // Never calls syncIndexes() or drops existing indexes.
      console.log(`${name}: indexes created/verified`);
    }
  } catch (error) { console.error(error); process.exitCode=1; }
  finally { await mongoose.disconnect(); }
})();
