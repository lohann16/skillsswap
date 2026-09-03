
import { ref, get, push } from 'firebase/database';
import { db } from '../firebase/config';

const normalize = (skill) => (skill || '').trim().toLowerCase();

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