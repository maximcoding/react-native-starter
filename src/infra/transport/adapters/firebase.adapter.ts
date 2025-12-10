/**
 * FILE: firebase.adapter.ts
 * LAYER: infra/transport/adapters
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Placeholder Firebase adapter implementing the Transport interface.
 *   Designed for Firestore, RTDB, Firebase Storage, or DataStore-like
 *   operations in the future.
 *
 * RESPONSIBILITIES:
 *   - Maintain full compatibility with the Transport interface.
 *   - Provide compile-time-complete method signatures.
 *   - Throw explicit “not implemented” errors until real implementation.
 *
 * DATA-FLOW:
 *   service
 *      → transport (active = firebaseAdapter)
 *         → firebaseAdapter.query/mutate/subscribe/upload
 *            → Firebase SDK (future)
 *
 * FUTURE MAPPING:
 *   - query():
 *        Firestore: getDoc(docRef)
 *        RTDB: get(ref(db, path))
 *
 *   - mutate():
 *        Firestore: setDoc/updateDoc/deleteDoc()
 *        RTDB: set/update/push/remove()
 *
 *   - subscribe():
 *        Firestore: onSnapshot(docRef, snap => handler(snap.data()))
 *        RTDB: onValue(ref(db, path), snap => handler(snap.val()))
 *
 *   - upload():
 *        Firebase Storage:
 *          const storageRef = ref(storage, path);
 *          await uploadBytes(storageRef, file);
 *          return await getDownloadURL(storageRef);
 *
 * ERROR HANDLING:
 *   - FirebaseError → convert to NormalizedError before throwing.
 *   - Never leak Firebase internal error shapes to services/UI.
 *
 * OFFLINE GUIDELINES:
 *   - Transport layer handles offline queueing for mutate/upload.
 *   - Query should fail if offline (same as REST/GraphQL).
 * ---------------------------------------------------------------------
 */
import type { Transport } from '@/infra/transport/transport.types';

function notImplemented(method: string, operation: string): never {
  throw new Error(`[Firebase adapter] ${method} not implemented for "${operation}"`);
}

export const firebaseAdapter: Transport = {
  async query(operation, _variables, _meta) {
    /**
     * FUTURE IMPLEMENTATION (Firestore):
     *
     * const docRef = doc(firestore, operation, _variables.id);
     * const snap = await getDoc(docRef);
     * return snap.data();
     *
     * FUTURE IMPLEMENTATION (RTDB):
     *
     * const dbRef = ref(database, operation);
     * const snap = await get(dbRef);
     * return snap.val();
     */
    notImplemented('query', operation);
  },

  async mutate(operation, _variables, _meta) {
    /**
     * FUTURE IMPLEMENTATION (Firestore):
     *
     * const docRef = doc(firestore, operation, _variables.id);
     * await setDoc(docRef, _variables);
     *
     * FUTURE IMPLEMENTATION (RTDB):
     *
     * await set(ref(database, operation), _variables);
     *
     * RETURN:
     *   Firebase does not always return payloads — return metadata if needed.
     */
    notImplemented('mutate', operation);
  },

  subscribe(_channel, _handler, _meta) {
    /**
     * FUTURE Firestore subscription:
     *
     * const docRef = doc(firestore, _channel);
     * const unsubscribe = onSnapshot(docRef, (snap) => {
     *   _handler(snap.data());
     * });
     *
     * return () => unsubscribe();
     *
     * FUTURE RTDB subscription:
     *
     * const dbRef = ref(database, _channel);
     * const unsubscribe = onValue(dbRef, (snap) => {
     *   _handler(snap.val());
     * });
     *
     * return () => off(dbRef);  // unsubscribe
     */
    return () => {};
  },

  async upload(operation, _payload, _meta) {
    /**
     * FUTURE Firebase Storage flow:
     *
     * const storageRef = ref(storage, operation);
     * await uploadBytes(storageRef, _payload.file);
     * const url = await getDownloadURL(storageRef);
     * return { url };
     */
    notImplemented('upload', operation);
  },
};
