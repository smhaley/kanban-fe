import { ColType } from "../components/board/board";
import { Item, ItemStatus } from "../api/models";
import { DropResult } from "react-beautiful-dnd";
import * as ItemsService from "../api/item_service";

export const instantiateCols = (resp: Item[]) => {
  const itemCols = Object.keys(ItemStatus).filter(
    (item) => item !== ItemStatus.ARCHIVE
  );
  const baseState: ColType = itemCols.reduce((acc, curr) => {
    return { ...acc, [curr]: [] };
  }, {});

  for (let item of resp) {
    baseState[item.itemStatus].push(item);
  }

  Object.values(baseState).forEach((item) =>
    item.sort((a: Item, b: Item) => {
      return a.position - b.position;
    })
  );

  return baseState;
};

export const onDragEnd = (
  result: DropResult,
  setColumns: React.Dispatch<React.SetStateAction<ColType | undefined>>,
  columns?: ColType
) => {
  if (!columns) return;
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const now = new Date(Date.now());
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn];
    const destItems = [...destColumn];
    const [removed] = sourceItems.splice(source.index, 1);
    removed.itemStatus = destination.droppableId as ItemStatus;
    removed.updateDateTime = now.toISOString();
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });
    destItems.forEach((item, index) => (item.position = index));
    destItems.forEach((item, index) => (item.position = index));
    ItemsService.batchPutItems([...sourceItems, ...destItems]);
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column];

    const [removed] = copiedItems.splice(source.index, 1);

    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: copiedItems,
    });
    copiedItems.forEach((item, index) => (item.position = index));
    ItemsService.batchPutItems(copiedItems);
  }
};
