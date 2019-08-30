import React, { Component } from 'react';
import './AddHook.css';
import API from './services/API';
import config from './config/config';

class AddHook extends Component {
  constructor() {
    super();
    this.state = {
      topic: '',
      endpoint: '',
      filter: '',
      topics: []
    };
    this.addHook = this.addHook.bind(this);
  }

  componentDidMount() {
    const _self = this;
    API.getTopics((tps) => {
      _self.setState({ topics: tps });
    });
  }

  addHook() {
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
    API.createHook({ topic, endpoint, filter }, () => {
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
      <div className="modal is-active" id="add-new-modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add New Resthook</p>
            <button className="delete" onClick={() => this.props.history.push('/')}
              aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <form>
              <div className="field">
                <label for="topics" className="label">Topic*</label>
                <div className="control">
                  <div className="select">
                    <select
                      onChange={(e) => this.setState({ topic: e.target.value })}>
                      <option value="">Select Topic</option>
                      {topics.map((tp, index) => (
                        <option key={index}>{tp}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Endpoint*</label>
                <div className="control">
                  <input className="input" type="text" placeholder="Resthook endpoint"
                    value={this.state.endpoint}
                    onChange={(e) => this.setState({ endpoint: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label className="label">Rule</label>
                <div className="control">
                  <textarea className="textarea" placeholder="Enter your custom filter here"
                    value={this.state.filter} rows="5"
                    cols="120" maxLength={Number(config.RESTHOOK_FILTER_MAX_LENGTH)}
                    onChange={(e) => this.setState({ filter: e.target.value })} />
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-primary" onClick={this.addHook}>Add</button>
            <button className="button" onClick={() => this.props.history.push('/')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default AddHook;
