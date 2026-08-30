// utils/matchmaking.js
//
// Rule-based matchmaking — no external AI call, so no API key to protect
// and no Cloud Functions gateway needed for this version. Scores land in
// the same `matches` shape a future AI-scored version would write, so
// MatchesScreen doesn't need to change when that's swapped in later.

import { ref, get, push } from 'firebase/database';
import { db } from '../firebase/config';

const normalize = (skill) => (skill || '').trim().toLowerCase();

/**
 * Scans all users for skill overlap with the current user and writes any
 * new matches found to the `matches` node. Returns how many new matches
 * were created.
 */
export async function findAndCreateMatches(currentUid) {
  const [usersSnap, teachSnap, learnSnap, matchesSnap] = await Promise.all([
    get(ref(db, 'users')),
    get(ref(db, 'user_skills_teach')),
    get(ref(db, 'user_skills_learn')),
    get(ref(db, 'matches')),
  ]);

  const users = usersSnap.val() || {};
  const teachData = teachSnap.val() || {};
  const learnData = learnSnap.val() || {};
  const existingMatches = matchesSnap.val() || {};

  const myTeach = normalize(teachData[currentUid]?.skill);
  const myLearn = normalize(learnData[currentUid]?.skill);

  if (!myTeach && !myLearn) {
    return { created: 0, reason: 'no_skills' };
  }

  // Build a lookup of existing pairs (in either order) so we never
  // create a duplicate match between the same two users.
  const existingPairs = new Set(
    Object.values(existingMatches).map((m) => [m.userA_id, m.userB_id].sort().join('_'))
  );

  let created = 0;

  for (const otherUid of Object.keys(users)) {
    if (otherUid === currentUid) continue;

    const pairKey = [currentUid, otherUid].sort().join('_');
    if (existingPairs.has(pairKey)) continue;

    const theirTeach = normalize(teachData[otherUid]?.skill);
    const theirLearn = normalize(learnData[otherUid]?.skill);

    const iCanLearnFromThem = myLearn && theirTeach && myLearn === theirTeach;
    const theyCanLearnFromMe = myTeach && theirLearn && myTeach === theirLearn;

    if (!iCanLearnFromThem && !theyCanLearnFromMe) continue;

    const score = iCanLearnFromThem && theyCanLearnFromMe ? 100 : 65;
    const skillCategory = iCanLearnFromThem ? theirTeach : myTeach;

    await push(ref(db, 'matches'), {
      userA_id: currentUid,
      userB_id: otherUid,
      skillCategory,
      score,
      status: 'pending',
      createdAt: Date.now(),
    });

    existingPairs.add(pairKey);
    created += 1;
  }

  return { created, reason: null };
}