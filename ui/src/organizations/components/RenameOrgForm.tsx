// Libraries
import React, {PureComponent, ChangeEvent} from 'react'
import {connect} from 'react-redux'
import {WithRouterProps, withRouter} from 'react-router'

import _ from 'lodash'

// Components
import {
  Form,
  Input,
  Button,
  ComponentSize,
  IconFont,
  ComponentSpacer,
  ComponentColor,
  ButtonType,
  AlignItems,
  FlexDirection,
} from '@influxdata/clockface'
import {ErrorHandling} from 'src/shared/decorators/errors'

// Actions
import {updateOrg} from 'src/organizations/actions/orgs'

// Types
import {Organization} from '@influxdata/influx'
import {ComponentStatus} from '@influxdata/clockface'
import {AppState} from 'src/types'

interface StateProps {
  startOrg: Organization
  orgNames: string[]
}

interface DispatchProps {
  updateOrg: typeof updateOrg
}

type Props = StateProps & DispatchProps & WithRouterProps

interface State {
  org: Organization
}

@ErrorHandling
class RenameOrgForm extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      org: this.props.startOrg,
    }
  }

  public render() {
    const {org} = this.state

    return (
      <>
        <Form onSubmit={this.handleRenameOrg}>
          <Form.ValidationElement
            label="Name"
            validationFunc={this.handleValidation}
            value={org.name}
          >
            {status => (
              <>
                <ComponentSpacer
                  alignItems={AlignItems.Center}
                  direction={FlexDirection.Column}
                  margin={ComponentSize.Large}
                >
                  <Input
                    placeholder="Give your organization a name"
                    name="name"
                    autoFocus={true}
                    onChange={this.handleInputChange}
                    value={org.name}
                    status={status}
                    testID="create-org-name-input"
                  />
                  <ComponentSpacer
                    alignItems={AlignItems.Center}
                    direction={FlexDirection.Row}
                    margin={ComponentSize.Small}
                  >
                    <Button
                      text="Cancel"
                      icon={IconFont.Remove}
                      onClick={this.handleGoBack}
                    />
                    <Button
                      text="Save"
                      icon={IconFont.Checkmark}
                      status={this.saveButtonStatus(status)}
                      color={ComponentColor.Success}
                      type={ButtonType.Submit}
                    />
                  </ComponentSpacer>
                </ComponentSpacer>
              </>
            )}
          </Form.ValidationElement>
        </Form>
      </>
    )
  }

  private saveButtonStatus = (
    validationStatus: ComponentStatus
  ): ComponentStatus => {
    if (
      this.state.org.name === this.props.startOrg.name ||
      validationStatus === ComponentStatus.Error
    ) {
      return ComponentStatus.Disabled
    }

    return validationStatus
  }

  private handleGoBack = () => {
    this.props.router.push(`/orgs/${this.props.startOrg.id}/profile`)
  }

  private handleValidation = (orgName: string): string | null => {
    if (!orgName) {
      return 'Name is required'
    }

    if (!this.isUniqueName(orgName)) {
      return 'This org name is taken'
    }
  }

  private isUniqueName = (orgName: string): boolean => {
    return !this.props.orgNames.find(o => o === orgName)
  }

  private handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value
    const org = {...this.state.org, name}

    this.setState({org})
  }

  private handleRenameOrg = async () => {
    const {org} = this.state

    await this.props.updateOrg(org)

    this.handleGoBack()
  }
}

const mstp = (state: AppState) => {
  const {
    orgs: {org: startOrg, items: orgs},
  } = state

  const orgNames = orgs.filter(o => o.id !== startOrg.id).map(o => o.name)

  return {startOrg, orgNames}
}

const mdtp = {
  updateOrg,
}

export default connect<StateProps, DispatchProps>(
  mstp,
  mdtp
)(withRouter(RenameOrgForm))
