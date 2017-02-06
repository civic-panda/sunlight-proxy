import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, causes, permissions, tasks } from '../../modules';
import CreateTask from '../forms/CreateTask';
import * as Tables from '../tables';

interface Props {
  causes: causes.Cause[];
  causesWithCreatePermission: causes.Cause[];
  tasks: tasks.Task[];
  createTask(): any;
}

interface State {
  isModalShowing: boolean;
}

class TasksPage extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { isModalShowing: false }
  }

  private showModal = () => this.setState({ isModalShowing: true })
  private hideModal = () => this.setState({ isModalShowing: false })

  private renderModal = () => (
    <BS.Modal show={this.state.isModalShowing} onHide={this.hideModal}>
      <BS.Modal.Header closeButton>
        <BS.Modal.Title>Create New Task</BS.Modal.Title>
      </BS.Modal.Header>
      <BS.Modal.Body>
        <CreateTask
          onSubmit={this.props.createTask}
          causes={this.props.causesWithCreatePermission}
          initialValues={{
            causeId: this.props.causesWithCreatePermission.length ? this.props.causesWithCreatePermission[0].id : undefined
          }}
        />
      </BS.Modal.Body>
    </BS.Modal>
  )

  public render() {
    const { tasks, causes, causesWithCreatePermission } = this.props;

    return (
      <BS.Col xs={12}>
        {this.renderModal()}
        <BS.PageHeader>
          Tasks
          <BS.Button
            onClick={this.showModal}
            className={'pull-right'}
            bsStyle={'primary'}
            disabled={causesWithCreatePermission.length === 0}
          >
            + Create New Task
          </BS.Button>
        </BS.PageHeader>
        <Tables.Tasks tasks={tasks} causes={causes} />
      </BS.Col>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const causeList = causes.selectors.list(state);
  const filteredCauseList = causeList.filter(cause => permissions.can(cause.role, 'create', 'task'));
  return {
    causes: causeList,
    causesWithCreatePermission: filteredCauseList,
    tasks: tasks.selectors.list(state),
  };
};

const mapDispatchToProps = ({
  createTask: tasks.create
});

export const Tasks = connect(mapStateToProps, mapDispatchToProps)(TasksPage)