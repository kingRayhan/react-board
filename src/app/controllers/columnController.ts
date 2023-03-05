import { collection, Firestore, getDocs } from "firebase/firestore";
import { IBoardColumn } from "../models/board-column.model";

export class ColumnController {
  constructor(private _db: Firestore) {}

  async getColumnsByBoardId(boardId: string) {
    debugger;
    const collectionRef = collection(this._db, `boards/${boardId}/columns`);
    const querySnapshot = await getDocs(collectionRef);
    const columns: IBoardColumn[] = [];
    querySnapshot.forEach((doc) => {
      columns.push({ id: doc.id, ...doc.data() } as IBoardColumn);
    });
    return columns;
  }
}
