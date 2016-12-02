import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import User from '../components/User'
import Page from '../components/Page'
import { getPhotos } from '../modules/page'
import { handleLogin } from '../modules/user'

class App extends Component {
  render() {
    const { user, page } = this.props
    const { getPhotos, handleLogin } = this.props

    return <div className='row'>
      <Page photos={page.photos} year={page.year} getPhotos={getPhotos} fetching={page.fetching} />
      <User name={user.name} handleLogin={handleLogin} error={user.error} />
    </div>
  }
}

function mapStateToProps({ user, page }) {
  return {
    user,
    page
  }
}

const mapDispatchToProps = {
  getPhotos,
  handleLogin
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
