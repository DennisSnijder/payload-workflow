import React, { forwardRef } from 'react'
import { formatDate } from "payload/dist/admin/utilities/formatDate";
import { useConfig } from "payload/dist/admin/components/utilities/Config";

import './sytles.scss';
const baseClass = 'board-card';

interface BoardCardProps {
  data: any
}

const BoardCard = forwardRef((props: BoardCardProps, ref: React.Ref<any>) => {
  const { data, ...rest } = props
  const { admin: { dateFormat } } = useConfig();

  return (
    <div
      className={baseClass}
      ref={ref}
      {...rest}
    >
      <h5>{ data.title }</h5>
      <small>{ formatDate(data.createdAt, dateFormat) }</small>
    </div>
  )
})

export default BoardCard
