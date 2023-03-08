import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { IBoardColumn } from "../models/board-column.model";

export class ColumnController {
  constructor(private _db: Firestore) {}

  async getColumnsByBoardId(boardId: string) {
    const collectionRef = collection(this._db, `boards/${boardId}/columns`);
    const querySnapshot = await getDocs(collectionRef);
    const columns: IBoardColumn[] = [];
    querySnapshot.forEach((doc) => {
      columns.push({ id: doc.id, ...doc.data() } as IBoardColumn);
    });
    return columns;
  }

  async updateColumn(boardId: string, columnId: string, column: IBoardColumn) {
    const docRef = doc(this._db, `boards/${boardId}/columns/${columnId}`);
    return updateDoc(docRef, {
      ...column,
      updatedAt: serverTimestamp(),
    });
  }

  async createColumnForBoard(boardId: string, column: IBoardColumn) {
    const collectionRef = collection(this._db, `boards/${boardId}/columns`);
    return addDoc(collectionRef, {
      ...column,
      createdAt: serverTimestamp(),
    });
  }

  async deleteColumn(boardId: string, columnId: string) {
    const docRef = doc(this._db, `boards/${boardId}/columns/${columnId}`);
    return deleteDoc(docRef);
  }
}
