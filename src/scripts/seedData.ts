/**
 * Firestore demo reset + seed. Run from Settings (admin) or DevTools: runSeed()
 *
 * Optional env (same Firebase project): assign different UIDs for demo actors
 * when you have real Auth accounts for editor/viewer users.
 * VITE_SEED_MANAGER_UID, VITE_SEED_USER_UID — default to the signed-in admin UID.
 */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { ContractStatus, User, UserRole } from '../types';

const ADMIN_EMAIL = 'lemonadimat@gmail.com';

declare global {
  interface Window {
    runSeed?: () => Promise<void>;
  }
}

async function deleteEntireCollection(collectionName: string): Promise<void> {
  const collRef = collection(db, collectionName);
  // Delete in chunks of 500 (batch limit)
  for (;;) {
    const snap = await getDocs(query(collRef, limit(500)));
    if (snap.empty) break;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

function resolveDemoUids(): { adminUid: string; managerUid: string; userUid: string } {
  const adminUid = auth.currentUser?.uid;
  if (!adminUid) {
    throw new Error('You must be signed in to run the seed.');
  }
  const managerUid =
    (import.meta.env.VITE_SEED_MANAGER_UID as string | undefined)?.trim() || adminUid;
  const userUid =
    (import.meta.env.VITE_SEED_USER_UID as string | undefined)?.trim() || adminUid;
  return { adminUid, managerUid, userUid };
}

function uidForAuthor(
  key: 'admin' | 'manager' | 'user',
  uids: { adminUid: string; managerUid: string; userUid: string }
): string {
  if (key === 'admin') return uids.adminUid;
  if (key === 'manager') return uids.managerUid;
  return uids.userUid;
}

/** Map spec status strings to app ContractStatus */
function mapStatus(s: 'active' | 'pending' | 'draft'): ContractStatus {
  if (s === 'active') return 'Active';
  if (s === 'pending') return 'Review';
  return 'Draft';
}

type SeedContract = {
  title: string;
  party: string;
  value: number;
  currency: string;
  specStatus: 'active' | 'pending' | 'draft';
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  author: 'admin' | 'manager' | 'user';
  approvedBy: 'admin' | 'manager' | 'user' | null;
  owner: string;
  /** If true, use time of seeding instead of createdAtIso */
  createdAtNow?: boolean;
  createdAtIso: string;
};

const CONTRACT_SEEDS: SeedContract[] = [
  {
    title: 'Annual Software License Agreement',
    party: 'MTN Ghana Limited',
    value: 250000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Technology',
    startDate: '2025-01-15',
    endDate: '2026-12-31',
    description:
      'Annual software licensing and support agreement for enterprise communications platform.',
    author: 'admin',
    approvedBy: 'admin',
    owner: 'IT Department',
    createdAtIso: '2025-01-15T00:00:00.000Z',
  },
  {
    title: 'Legal Advisory Services Retainer',
    party: 'Bentsi-Enchill, Letsa & Ankomah',
    value: 85000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Legal',
    startDate: '2025-03-01',
    endDate: '2026-09-30',
    description:
      'Monthly legal advisory retainer covering corporate, regulatory and compliance matters.',
    author: 'admin',
    approvedBy: 'admin',
    owner: 'Legal Department',
    createdAtIso: '2025-03-01T00:00:00.000Z',
  },
  {
    title: 'Beverage Supply and Distribution Contract',
    party: 'Kasapreko Company Limited',
    value: 800000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Supply Chain',
    startDate: '2025-02-01',
    endDate: '2026-08-31',
    description:
      'Exclusive distribution agreement for beverage products across Greater Accra region.',
    author: 'manager',
    approvedBy: 'admin',
    owner: 'Sales & Marketing',
    createdAtIso: '2025-02-01T00:00:00.000Z',
  },
  {
    title: 'IT Infrastructure Support Agreement',
    party: 'Huawei Technologies Ghana',
    value: 450000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'IT Hardware',
    startDate: '2025-01-01',
    endDate: '2026-04-18',
    description:
      'Comprehensive IT infrastructure maintenance and 24/7 technical support services.',
    author: 'admin',
    approvedBy: 'admin',
    owner: 'IT Department',
    createdAtIso: '2025-01-01T00:00:00.000Z',
  },
  {
    title: 'Construction and Civil Works Contract',
    party: 'Consar Limited',
    value: 15000000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Construction',
    startDate: '2024-06-01',
    endDate: '2026-04-14',
    description: 'Design and construction of new regional office headquarters in Accra.',
    author: 'admin',
    approvedBy: 'admin',
    owner: 'Projects Team',
    createdAtIso: '2024-06-01T00:00:00.000Z',
  },
  {
    title: 'Insurance Brokerage Agreement',
    party: 'Enterprise Insurance Ghana',
    value: 350000,
    currency: 'GHS',
    specStatus: 'pending',
    category: 'Insurance',
    startDate: '2025-04-01',
    endDate: '2026-12-31',
    description:
      'Comprehensive corporate insurance brokerage covering assets, liability and staff.',
    author: 'manager',
    approvedBy: null,
    owner: 'HR Department',
    createdAtIso: '2025-04-01T00:00:00.000Z',
  },
  {
    title: 'Security Services Agreement',
    party: 'Shield Security Services Ghana',
    value: 120000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Operations',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    description: '24-hour physical security services for all company premises across Accra.',
    author: 'manager',
    approvedBy: 'admin',
    owner: 'Operations',
    createdAtIso: '2025-01-01T00:00:00.000Z',
  },
  {
    title: 'Marketing and Brand Management Contract',
    party: 'Publicis Groupe Ghana',
    value: 280000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Marketing',
    startDate: '2025-02-15',
    endDate: '2026-11-30',
    description:
      'Full-service marketing, advertising and brand management across digital and traditional media.',
    author: 'user',
    approvedBy: 'manager',
    owner: 'Marketing',
    createdAtIso: '2025-02-15T00:00:00.000Z',
  },
  {
    title: 'Cleaning and Facilities Management',
    party: 'Zoomlion Ghana Limited',
    value: 95000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Facilities',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    description:
      'Comprehensive cleaning, waste management and facilities maintenance services.',
    author: 'user',
    approvedBy: 'manager',
    owner: 'Facilities',
    createdAtIso: '2025-01-01T00:00:00.000Z',
  },
  {
    title: 'Banking and Treasury Services Agreement',
    party: 'GCB Bank Limited',
    value: 5000000,
    currency: 'GHS',
    specStatus: 'active',
    category: 'Finance',
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    description:
      'Corporate banking, treasury management and trade finance facilities agreement.',
    author: 'admin',
    approvedBy: 'admin',
    owner: 'Finance Department',
    createdAtIso: '2024-01-01T00:00:00.000Z',
  },
  {
    title: 'HR and Recruitment Services Contract',
    party: 'Jobberman Ghana',
    value: 60000,
    currency: 'GHS',
    specStatus: 'draft',
    category: 'HR',
    startDate: '2026-05-01',
    endDate: '2027-04-30',
    description: 'Annual recruitment, headhunting and HR consulting services agreement.',
    author: 'user',
    approvedBy: null,
    owner: 'HR Department',
    createdAtIso: '',
    createdAtNow: true,
  },
  {
    title: 'Fuel Supply Agreement',
    party: 'TotalEnergies Ghana',
    value: 180000,
    currency: 'GHS',
    specStatus: 'pending',
    category: 'Energy',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    description: 'Annual fuel supply contract for company fleet and generator operations.',
    author: 'manager',
    approvedBy: null,
    owner: 'Operations',
    createdAtIso: '',
    createdAtNow: true,
  },
];

function buildFirestoreContract(
  seed: SeedContract,
  uids: { adminUid: string; managerUid: string; userUid: string }
): Record<string, unknown> {
  const nowIso = new Date().toISOString();
  const authorId = uidForAuthor(seed.author, uids);
  const approvedByUid =
    seed.approvedBy === null ? null : uidForAuthor(seed.approvedBy, uids);

  const createdAt = seed.createdAtNow ? nowIso : seed.createdAtIso;

  const doc: Record<string, unknown> = {
    title: seed.title,
    party: seed.party,
    value: seed.value,
    currency: seed.currency,
    status: mapStatus(seed.specStatus),
    category: seed.category,
    startDate: seed.startDate,
    endDate: seed.endDate,
    description: seed.description,
    owner: seed.owner,
    authorId,
    lastModified: nowIso,
    createdAt,
    renewalType: 'Fixed Term',
  };

  if (approvedByUid !== null) {
    doc.approvedBy = approvedByUid;
  }

  return doc;
}

async function seedAdminUserDoc(adminUid: string, email: string | null): Promise<void> {
  const isLemon = (email || '').toLowerCase() === ADMIN_EMAIL;
  const displayName = isLemon ? 'Lemon Adimat' : auth.currentUser?.displayName || 'Admin';
  const userDoc: User & { department?: string } = {
    uid: adminUid,
    email: email || ADMIN_EMAIL,
    displayName,
    role: 'admin' as UserRole,
    createdAt: new Date().toISOString(),
    department: 'Legal',
  };
  if (auth.currentUser?.photoURL) {
    userDoc.photoURL = auth.currentUser.photoURL;
  }
  await setDoc(doc(db, 'users', adminUid), userDoc);
}

export type RunSeedOptions = {
  /** When true, do not reload the page (Settings shows a toast first, then reloads). */
  skipReload?: boolean;
};

/**
 * Clears contracts, notifications, auditLogs, approvals and inserts demo data.
 * Does not delete Firebase Auth users. Updates the signed-in admin’s Firestore user doc.
 */
export async function runSeed(options?: RunSeedOptions): Promise<void> {
  try {
    const { adminUid, managerUid, userUid } = resolveDemoUids();
    const email = auth.currentUser?.email ?? null;

    const userSnap = await getDoc(doc(db, 'users', adminUid));
    const role = userSnap.exists() ? (userSnap.data() as User).role : undefined;
    if (role !== 'admin') {
      throw new Error('Only admins can reset demo data.');
    }

    if (managerUid === adminUid || userUid === adminUid) {
      console.warn(
        '[seed] VITE_SEED_MANAGER_UID / VITE_SEED_USER_UID not set — using admin UID for all contract authors where applicable.'
      );
    }

    await deleteEntireCollection('contracts');
    await deleteEntireCollection('notifications');
    await deleteEntireCollection('auditLogs');
    await deleteEntireCollection('approvals');

    await seedAdminUserDoc(adminUid, email);

    const uids = { adminUid, managerUid, userUid };
    const contractsRef = collection(db, 'contracts');
    const insertedIds: string[] = [];

    for (const seed of CONTRACT_SEEDS) {
      const ref = await addDoc(contractsRef, buildFirestoreContract(seed, uids));
      insertedIds.push(ref.id);
    }

    // Notifications reference contracts at indices 3,4,5,11 (1-based: 4,5,6,12)
    const id4 = insertedIds[3];
    const id5 = insertedIds[4];
    const id6 = insertedIds[5];
    const id12 = insertedIds[11];
    const notificationsRef = collection(db, 'notifications');
    const nNow = Timestamp.now();

    const notificationPayloads = [
      {
        userId: adminUid,
        message: 'Insurance Brokerage Agreement is pending your approval',
        type: 'approval_required',
        isRead: false,
        contractId: id6,
        createdAt: nNow,
      },
      {
        userId: adminUid,
        message: 'Consar Limited contract expires in 28 days',
        type: 'expiry_warning',
        isRead: false,
        contractId: id5,
        createdAt: nNow,
      },
      {
        userId: adminUid,
        message: 'Huawei Technologies contract expires in 29 days',
        type: 'expiry_warning',
        isRead: true,
        contractId: id4,
        createdAt: nNow,
      },
      {
        userId: adminUid,
        message: 'Fuel Supply Agreement submitted for approval by Abena Mensah',
        type: 'approval_required',
        isRead: false,
        contractId: id12,
        createdAt: nNow,
      },
    ];

    for (const n of notificationPayloads) {
      await addDoc(notificationsRef, n);
    }

    console.log('[seed] Demo data loaded successfully.');
    if (typeof window !== 'undefined' && !options?.skipReload) {
      window.location.reload();
    }
  } catch (e) {
    console.error('[seed] Failed:', e);
    throw e;
  }
}

if (typeof window !== 'undefined') {
  window.runSeed = () => runSeed();
}
