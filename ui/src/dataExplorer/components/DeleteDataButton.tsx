// Libraries
import React, {FunctionComponent} from 'react'
import {withRouter, WithRouterProps} from 'react-router-dom'

// Components
import {Button} from '@influxdata/clockface'
import {FeatureFlag} from 'src/shared/utils/featureFlag'

const DeleteDataButton: FunctionComponent<WithRouterProps> = ({
  location: {pathname},
  router,
}) => {
  const onClick = () => router.push(`${pathname}/delete-data`)

  return (
    <FeatureFlag name="deleteWithPredicate">
      <Button
        testID="delete-data-predicate"
        text="Delete Data"
        onClick={onClick}
        titleText="Filter and mark data for deletion"
      />
    </FeatureFlag>
  )
}

export default withRouter<{}>(DeleteDataButton)
