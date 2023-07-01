import React, { forwardRef } from 'react'
import { CollectionConfig } from "payload/types";
import { formatDate } from "payload/dist/admin/utilities/formatDate";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { Link } from 'react-router-dom';

import './sytles.scss';
import RenderTitle from "payload/dist/admin/components/elements/RenderTitle";

const baseClass = 'board-card';

interface BoardCardProps {
  collection: CollectionConfig
  data: any
}

const BoardCard = forwardRef((props: BoardCardProps, ref: React.Ref<any>) => {
  const {collection, data, ...rest} = props
  const {admin: {dateFormat}, routes: {admin: payloadAdmin}} = useConfig();
  const {slug, admin} = collection;

  return (
    <div
      className={ baseClass }
      ref={ ref }
      { ...rest }
    >
      <div className={`${baseClass}__title`}>
        <Link to={ `${ payloadAdmin }/collections/${ slug }/${ data.id }` }>
          { admin?.useAsTitle && data[admin.useAsTitle] }
          { !admin?.useAsTitle && data.id }
        </Link>
      </div>
      <small>{ formatDate(data.createdAt, dateFormat) }</small>
    </div>
  )
})

export default BoardCard
