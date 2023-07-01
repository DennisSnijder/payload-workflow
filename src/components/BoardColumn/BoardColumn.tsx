import React from 'react'
import BoardCardList from "./../BoardCardList/BoardCardList";

import './styles.scss';
const baseClass = 'board-column';

interface BoardColumProps {
  title: string;
  identifier: string;
  contents: any[]
}

const BoardColumn = (props: BoardColumProps) => {
  const {title, identifier, contents} = props

  return (
    <div
      className={`${baseClass}__wrapper`}
    >
      <div className={`${baseClass}__header`}>
        <h4>{ title } <span>{ contents?.length }</span></h4>
      </div>

      <BoardCardList
        listId={ identifier }
        contents={ contents }
      />
    </div>
  )
}

export default BoardColumn