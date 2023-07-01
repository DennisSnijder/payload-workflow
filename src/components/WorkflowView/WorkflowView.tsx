import React, { useState } from "react"
import { Props as ListProps } from "payload/dist/admin/components/views/collections/List/types";
import Meta from "payload/dist/admin/components/utilities/Meta";
import { Gutter } from "payload/dist/admin/components/elements/Gutter";
import Eyebrow from "payload/dist/admin/components/elements/Eyebrow";
import { getTranslation } from "payload/dist/utilities/getTranslation";
import { useTranslation } from 'react-i18next';
import { SelectField } from "payload/types";
import ListControls from "payload/dist/admin/components/elements/ListControls";
import { SelectionProvider } from "payload/dist/admin/components/views/collections/List/SelectionProvider";
import Board from "../Board/Board";

import './styles.scss';
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import usePayloadAPI from "payload/dist/admin/hooks/usePayloadAPI";
import DefaultList from "payload/dist/admin/components/views/collections/List/Default";
import WorkflowViewHeader from "../WorkflowViewHeader/WorkflowViewHeader";
import { requests } from "payload/dist/admin/api";

const baseClass = 'scrumboard';

export const WorkflowView = (props: ListProps) => {

  const {
    collection,
    collection: {
      slug: collectionSlug,
      fields: collectionFields,
      labels: {
        plural: pluralLabel,
      },
      admin: {} = {},
    },
    handleSortChange,
    handleWhereChange,
    modifySearchParams,
    hasCreatePermission,
    resetParams,
    newDocumentURL,
  } = props;
  const {i18n} = useTranslation('general');
  const {serverURL, routes: {api}} = useConfig();

  const [ showingWorkflow, setShowingWorkflow ] = useState(true);
  const statusDefinition: SelectField = collectionFields.find((field: any) => field?.name === 'workflowStatus') as SelectField;

  const [ {data} ] = usePayloadAPI(`${ serverURL }${ api }/${ collectionSlug }`, {
    initialParams: {
      limit: 100,
      sort: 'workflowOrderRank'
    }
  });

  const handleDocumentWorkflowStatusChange = (documentId: string, workflowStatus: string, workflowOrderRank: string) => {
    requests.patch(`${ serverURL }${ api }/${ collectionSlug }/${ documentId }`, {
      body: JSON.stringify({
        workflowStatus: workflowStatus,
        workflowOrderRank: workflowOrderRank
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': i18n.language,
      },
    })
  }


  if (!showingWorkflow) {
    return <DefaultList
      customHeader={
        <WorkflowViewHeader
          hasCreatePermission={ hasCreatePermission }
          newDocumentURL={ newDocumentURL }
          pluralLabel={ pluralLabel }
          isShowingWorkflow={ showingWorkflow }
          onWorkflowViewSwitch={ () => setShowingWorkflow(true) }
        />
      }
      { ...props }
    />
  }

  return <div>
    <Meta title={ getTranslation(pluralLabel, i18n) }/>
    <SelectionProvider
      docs={ data.docs }
      totalDocs={ data.totalDocs }
    >
      <Eyebrow/>

      <Gutter className={ `${ baseClass }__wrap` }>

        <WorkflowViewHeader
          hasCreatePermission={ hasCreatePermission }
          newDocumentURL={ newDocumentURL }
          pluralLabel={ pluralLabel }
          isShowingWorkflow={ showingWorkflow }
          onWorkflowViewSwitch={ () => setShowingWorkflow(false) }
        />

        <ListControls
          collection={ collection }
          modifySearchQuery={ modifySearchParams }
          handleSortChange={ handleSortChange }
          handleWhereChange={ handleWhereChange }
          resetParams={ resetParams }
        />

        <Board
          documents={ data.docs }
          statusDefinition={ statusDefinition }
          onDocumentWorkflowStatusChange={ handleDocumentWorkflowStatusChange }
        />
      </Gutter>
    </SelectionProvider>
  </div>
}