import React from 'react'
import moment from 'moment'
import API from '../api'

import APIStatus from '../components/api-status'
import PartitionLagStats from '../components/partition-lag-stats'
import Spinner from '../components/spinner'

const INTERVAL_TIME = 10 * 1000

export default React.createClass({
  fetch() {
    API.Consumer
      .lag()
      .then((data) => !this.props.apiError && this._isMounted ? this.setState(data) : null)
  },

  componentWillMount() {
    this._isMounted = true
    this.fetch()
  },

  render() {
    return (
      <div className='partition-lag-view'>
        <APIStatus text={this.props.apiError} />
        {
          this.state ?
            this.renderPartitionLagStats() :
            <Spinner />
        }
      </div>
    )
  },

  componentDidMount() {
    this._intervalId = setInterval(() => this.fetch(), INTERVAL_TIME)
  },

  componentWillUnmount() {
    this._isMounted = false
    clearInterval(this._intervalId)
  },

  renderPartitionLagStats() {
    return this.state
      .data
      .map((consumerData) => {
        return <PartitionLagStats key={consumerData.name} {...consumerData} />
      })
  }
})