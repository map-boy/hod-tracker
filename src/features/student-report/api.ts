import { FirebaseError } from 'firebase/app';
import { doc, getDoc, increment, runTransaction } from 'firebase/firestore';
import { db } from '../../core/firebase';
import { ISSUE_LABELS, type Case, type ClassRoom, type Group, type IssueType } from '../../core/domain';
import { normalizeCourse } from './lib/validate';

export interface SubmitInput {
  classId: string; regNo: string; name: string; phone: string;
  courseCode: string; issueType: IssueType; description: string; blocksRegistration: boolean;
}

export async function getClassByToken(token: string): Promise<ClassRoom | null> {
  const snap = await getDoc(doc(db, 'classes', token));
  return snap.exists() ? { ...(snap.data() as Omit<ClassRoom, 'id'>), id: snap.id } : null;
}

export async function submitCase(input: SubmitInput, uid: string): Promise<string> {
  const now = Date.now();
  const course = normalizeCourse(input.courseCode);
  const groupId = `${input.classId}_${course}_${input.issueType}`;
  const caseId = `${input.classId}_${input.regNo}_${course}`;
  const groupRef = doc(db, 'groups', groupId);
  const caseRef = doc(db, 'cases', caseId);

  const record: Omit<Case, 'id'> = {
    groupId, classId: input.classId, uid,
    regNo: input.regNo, name: input.name, phone: input.phone,
    courseCode: course, issueType: input.issueType, description: input.description,
    proofUrls: [], blocksRegistration: input.blocksRegistration,
    status: 'submitted', createdAt: now, updatedAt: now,
  };

  try {
    await runTransaction(db, async (tx) => {
      const g = await tx.get(groupRef);
      tx.set(caseRef, record);
      if (g.exists()) {
        const cur = g.data() as Omit<Group, 'id'>;
        tx.update(groupRef, {
          affected: increment(1),
          updatedAt: now,
          blocksRegistration: cur.blocksRegistration || input.blocksRegistration,
        });
      } else {
        const group: Omit<Group, 'id'> = {
          classId: input.classId, courseCode: course, issueType: input.issueType,
          title: `${course} - ${ISSUE_LABELS[input.issueType]}`,
          status: 'submitted', affected: 1, blocksRegistration: input.blocksRegistration,
          createdAt: now, updatedAt: now,
        };
        tx.set(groupRef, group);
      }
    });
    return caseId;
  } catch (e) {
    if (e instanceof FirebaseError && e.code === 'permission-denied') {
      throw new Error('You already reported this course, or this class link is not valid.');
    }
    throw e;
  }
}
