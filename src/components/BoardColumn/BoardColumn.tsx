import React, { useState } from 'react'
import BoardCardList from "./../BoardCardList/BoardCardList";

import './styles.scss';
import { CollectionConfig } from "payload/types";
import { Chevron } from "payload/components";

const baseClass = 'board-column';

interface BoardColumProps {
  collection: CollectionConfig;
  title: string;
  identifier: string;
  contents: any[];
  collapsible?: boolean;
}

const BoardColumn = (props: BoardColumProps) => {
  const {title, identifier, contents, collection, collapsible} = props

  const [ isCollapsed, setCollapsed ] = useState(!!collapsible);

  return (
    <div
      className={ `${ baseClass }__wrapper ${ isCollapsed ? `${ baseClass }__collapsed` : '' }` }
    >
      <div
        className={ `${ baseClass }__header ${ isCollapsed ? `${ baseClass }__header_collapsed` : '' }` }
      >
        <h4>{ title } <span>{ contents?.length }</span></h4>
        { collapsible && <div onClick={ () => setCollapsed(!isCollapsed) } className={ `${ baseClass }__collapse` }>
            <Chevron/>
        </div> }
      </div>

      { !isCollapsed && <BoardCardList
          listId={ identifier }
          contents={ contents }
          collection={ collection }
      /> }
    </div>
  )
}

export default BoardColumn