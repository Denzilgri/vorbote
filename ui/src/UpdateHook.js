import React, { Component } from 'react';
import './UpdateHook.css';
import API from './services/API';
import config from './config/config';

class UpdateHook extends Component {
  constructor() {
    super();
    this.state = {
      topic: '',
      endpoint: '',
      filter: '',
      topics: []
    };
    this.updateHook = this.updateHook.bind(this);
  }

  componentDidMount() {
    const _self = this;
    API.getHook(this.props.match.params.id, (hook) => {
      _self.setState(hook);
    });
    API.getTopics((tps) => {
      _self.setState({ topics: tps });
    });
  }

  updateHook() {
    const _self = this;
    const { topic, endpoint, filter } = this.state;
    if (!topic || topic.trim().length === 0) {
      alert('Topic is not selected.');
      return;
    }
    if (!endpoint || endpoint.trim().length === 0) {
      alert('Endpoint can not be empty.');
      return;
    }
    API.updateHook(this.props.match.params.id, { topic, endpoint, filter }, () => {
      _self.props.history.push('/');
    });
  }

  /**
   * Open alerts modal
   */
  openAlertsModal(content) {
    document.querySelector('#alert-modal').style.display = 'flex';
    document.querySelector('#alert-content').textContent = content;
  }

  render() {
    const { topics } = this.state;
    return (
      // <Route exact path="/" render={(props) => <RestHooks {...props} currentUser={this.state.currentUser} />} />
      <div class="modal is-active" id="add-new-modal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Update Resthook</p>
            <button class="delete" onClick={() => this.props.history.push('/')}
              aria-label="close"></button>
          </header>
          <section class="modal-card-body">
            <form>
              <div class="field">
                <div className="Label">ID:</div> {this.props.match.params.id}
              </div>
              <div class="field">
                <label for="topics" class="label">Topic*</label>
                <div class="control">
                  <div class="select">
                    <select value={this.state.topic}
                      onChange={(e) => this.setState({ topic: e.target.value })}>
                      <option value="">Select Topic</option>
                      {topics.map((tp, index) => (
                        <option key={index}>{tp}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <label className="label">Endpoint*</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Role endpoint"
                    value={this.state.endpoint}
                    onChange={(e) => this.setState({ endpoint: e.target.value })} />
                </div>
              </div>
              <div class="field">
                <label class="label">Rule</label>
                <div class="control">
                  <textarea class="textarea" placeholder="Enter your custom filter here"
                    value={this.state.filter} rows="5" cols="120"
                    maxLength={Number(config.RESTHOOK_FILTER_MAX_LENGTH)}
                    onChange={(e) => this.setState({ filter: e.target.value })} />
                </div>
              </div>
            </form>
          </section>
          <footer class="modal-card-foot">
            <button className="button is-link" onClick={this.updateHook}>
              Update
            </button>
            <button className="button" onClick={() => this.props.history.push('/')}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export default UpdateHook;
