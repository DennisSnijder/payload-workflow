import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import BoardColumn from "./../BoardColumn/BoardColumn";
import { CollectionConfig, SelectField } from "payload/types";
import { LexoRank } from "lexorank";
import { sortAndFilterDocumentsForStatus } from "../../utils/documents.util";

import './styles.scss';

interface BoardInterface {
  collection: CollectionConfig;
  statusDefinition: SelectField;
  documents: any[];
  onDocumentWorkflowStatusChange: (documentId: string, workflowStatus: string, orderRank: string) => void;
}

const Board = (props: BoardInterface) => {
  const {statusDefinition, documents: initDocuments, onDocumentWorkflowStatusChange, collection} = props;
  const [ documents, setDocuments ] = useState(initDocuments ?? []);

  useEffect(() => {
    setDocuments(initDocuments);
  }, [ initDocuments ]);

  const updateDocument = (documentId: string, destinationStatus: string, orderRank: string) => {
    setDocuments((prev) => {
      const updatedDocumentIndex = prev.findIndex((_doc) => _doc.id === documentId);

      if (updatedDocumentIndex === -1) {
        return prev;
      }

      prev[updatedDocumentIndex].workflowStatus = destinationStatus;
      prev[updatedDocumentIndex].workflowOrderRank = orderRank;

      return [ ...prev ];
    });

    onDocumentWorkflowStatusChange(documentId, destinationStatus, orderRank);
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const source = result.source
    const destination = result.destination

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const documentId = result.draggableId;
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;
    const destinationIndex = destination.index;
    const destinationStatusGroup = sortAndFilterDocumentsForStatus(documents, destinationStatus);

    const minOrderRank = documents[0]?.workflowOrderRank ?? LexoRank.min().toString();
    const maxOrderRank = documents[documents.length - 1].workflowOrderRank ?? LexoRank.max().toString();

    const updatedDocumentIndex = documents.findIndex((_doc) => _doc.id === result.draggableId);

    //first in entire collection when added to empty group.
    if (destinationStatusGroup.length === 0 && updatedDocumentIndex === 0) {
      return updateDocument(documentId, destinationStatus, LexoRank.min().toString());
    }

    //first in list on empty group.
    if (destinationStatusGroup.length === 0 && destinationIndex === 0) {
      return updateDocument(documentId, destinationStatus, LexoRank.min().genNext().toString());
    }

    //first in list
    if (destinationIndex === 0) {
      const previousFirstDoc = [ ...destinationStatusGroup ].shift();

      // if the value has not been set, set a default value.
      if (!(typeof previousFirstDoc.workflowOrderRank === 'string')) {
        const updatedOrderRank = LexoRank.parse(minOrderRank)
          .between(LexoRank.max())
          .toString();

        return updateDocument(documentId, destinationStatus, updatedOrderRank.toString());
      }

      const updatedOrderRank = LexoRank.parse(previousFirstDoc.workflowOrderRank).genPrev();
      return updateDocument(documentId, destinationStatus, updatedOrderRank.toString());
    }

    //last in the list
    if (
      (sourceStatus === destinationStatus && destinationIndex + 1 === destinationStatusGroup.length) ||
      (sourceStatus !== destinationStatus && destinationIndex === destinationStatusGroup.length)
    ) {
      const previousLastDoc = [ ...destinationStatusGroup ].pop();

      // if the value has not been set, set a default value.
      if (!(typeof previousLastDoc.workflowOrderRank === 'string')) {
        const updatedOrderRank = LexoRank.parse(maxOrderRank)
          .between(LexoRank.min())
          .toString();

        return updateDocument(documentId, destinationStatus, updatedOrderRank.toString());
      }

      const updatedOrderRank = LexoRank.parse(previousLastDoc.workflowOrderRank).genNext();
      return updateDocument(documentId, destinationStatus, updatedOrderRank.toString());
    }

    //between 2 documents
    let documentBefore = destinationStatusGroup[destinationIndex - 1];
    let documentAfter = destinationStatusGroup[destinationIndex];

    // within the same list re-ordering to the bottom, switch the document before and after.
    if (sourceStatus === destinationStatus && source.index < destinationIndex) {
      documentBefore = destinationStatusGroup[destinationIndex];
      documentAfter = destinationStatusGroup[destinationIndex + 1];
    }

    const documentBeforeRank = LexoRank.parse(documentBefore.workflowOrderRank);
    const documentAfterRank = LexoRank.parse(documentAfter.workflowOrderRank);

    return updateDocument(documentId, destinationStatus, documentBeforeRank.between(documentAfterRank).toString());
  }

  return <DragDropContext onDragEnd={ result => onDragEnd(result) }>
    <Droppable
      droppableId="board"
      type="COLUMN"
      direction="horizontal"
    >
      { (provided) => (
        <div
          className="scrumboard"
          ref={ provided.innerRef }
          { ...provided.droppableProps }
        >
          <div className="scrumboard-body">
            { statusDefinition.options.map((status: any) => (
              <BoardColumn
                collection={collection}
                key={ status.value }
                title={ status.label }
                identifier={ status.value }
                contents={ sortAndFilterDocumentsForStatus(documents, status.value) }
              />
            )) }
            { provided.placeholder }
          </div>
        </div>
      ) }
    </Droppable>
  </DragDropContext>

}

export default Board;