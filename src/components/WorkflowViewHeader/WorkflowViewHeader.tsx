import { getTranslation } from "payload/dist/utilities/getTranslation";
import { Button, Pill } from "payload/components";
import { useTranslation } from "react-i18next";
import React from "react";
import './styles.scss';

const baseClass = 'workflow-view-header';

interface WorkflowViewHeaderProps {
  pluralLabel: Record<string, string> | string;
  newDocumentURL: string;
  hasCreatePermission: boolean;
  isShowingWorkflow: boolean;
  onWorkflowViewSwitch: () => void
}

const WorkflowViewHeader = (props: WorkflowViewHeaderProps) => {
  const {pluralLabel, newDocumentURL, hasCreatePermission, isShowingWorkflow, onWorkflowViewSwitch} = props;
  const {t, i18n} = useTranslation('general');

  return <header className={ `${ baseClass } ${isShowingWorkflow ? 'is-workflow-view' : ''}` }>
    <div>
      <h1>{ getTranslation(pluralLabel, i18n) }</h1>
      { hasCreatePermission && (
        <Pill to={ newDocumentURL }>
          { t('createNew') }
        </Pill>
      ) }
    </div>

    <Button buttonStyle={'secondary'}  size={'small'} onClick={() => onWorkflowViewSwitch()}>
      { isShowingWorkflow && 'Switch to table view' }
      { !isShowingWorkflow && 'Switch to workflow view' }
    </Button>
  </header>
}

export default WorkflowViewHeader;