import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { IBoard } from "../models/board.model";

export class BoardController {
  constructor(private _db: Firestore) {}

  async getBoards(ownerId: string) {
    const collectionRef = collection(this._db, "boards");
    const q = query(collectionRef, where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const boards: IBoard[] = [];
    querySnapshot.forEach((doc) => {
      boards.push({ id: doc.id, ...doc.data() } as IBoard);
    });
    return boards;
  }

  async getBoardDetails(boardId: string) {
    const docRef = doc(this._db, `boards/${boardId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as IBoard;
    }
    return null;
  }

  async createBoard(board: IBoard) {
    const collectionRef = collection(this._db, "boards");
    return addDoc(collectionRef, {
      ...board,
      createdAt: serverTimestamp(),
    });
  }

  upDateBoard(id: string, board: IBoard) {
    const docRef = doc(this._db, `boards/${id}`);
    return setDoc(docRef, {
      ...board,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteBoard(boardId: string) {
    const docRef = doc(this._db, `boards/${boardId}`);
    return deleteDoc(docRef);
  }
}
