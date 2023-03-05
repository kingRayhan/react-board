import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
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

  async createBoard(board: IBoard) {
    const collectionRef = collection(this._db, "boards");
    return addDoc(collectionRef, board);
  }

  upDateBoard(id: string, board: IBoard) {
    const docRef = doc(this._db, `boards/${id}`);
    return setDoc(docRef, board);
  }

  async deleteBoard(boardId: string) {
    const docRef = doc(this._db, `boards/${boardId}`);
    return deleteDoc(docRef);
  }
}
