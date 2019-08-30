import React, { Component } from 'react';
import './RoleTopics.css';
import API from './services/API';
import config from './config/config';

const pageSize = Number(config.PAGE_SIZE);

class RoleTopics extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      page: 1,
      total: 0,
      role: '',
      topic: '',
      topics: []
    };
    this.deleteRoleTopic = this.deleteRoleTopic.bind(this);
    this.addRoleTopic = this.addRoleTopic.bind(this);
    this.browsePage = this.browsePage.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // defining element references
    this.modalElementRef = React.createRef();
  }

  componentDidMount() {
    this.browsePage(1);
    const _self = this;
    API.getTopics((tps) => {
      _self.setState({ topics: tps });
    });
  }

  browsePage(p) {
    const _self = this;
    API.getRoleTopics({ offset: (p - 1) * pageSize, limit: pageSize }, (res) => {
      _self.setState({ items: res.roleTopics, total: res.total, page: p });
    });
  }

  deleteRoleTopic(id) {
    const _self = this;
    API.deleteRoleTopic(id, () => {
      _self.browsePage(_self.state.page);
    });
  }

  addRoleTopic() {
    const _self = this;
    const { role, topic } = this.state;
    if (!role || role.trim().length === 0) {
      alert('Role can not be empty.');
      return;
    }
    if (!topic || topic.trim().length === 0) {
      alert('Topic is not selected.');
      return;
    }
    API.createRoleTopic({ role, topic }, () => {
      _self.browsePage(_self.state.page);
      // close the modal if successful
      this.closeModal();
    });
  }

  /**
   * Opens a modal to add a role
   * @param {*} hookFilter
   */
  openModal() {
    this.modalElementRef.current.style.display = 'flex';
  }

  /**
   * Closes the modal
   */
  closeModal() {
    this.modalElementRef.current.style.display = 'none';
  }

  /**
   * Open alerts modal
   */
  openAlertsModal(content) {
    document.querySelector('#alert-modal').style.display = 'flex';
    document.querySelector('#alert-content').textContent = content;
  }

  render() {
    if (!this.props.currentUser.isAdmin) return null;

    const { items, page, total, topics } = this.state;
    let pageCount = Math.ceil(total / pageSize);
    if (pageCount < 1) pageCount = 1;
    const pages = [];
    for (let i = 1; i <= pageCount; i += 1) pages.push(i);

    return (
      <div>
        <div className="columns">
          <div className="column">
            <h5 className="is-size-5 has-text-grey-light">Your Role Management</h5>
          </div>
        </div>
        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead className="thead">
            <tr>
              <th className="has-text-centered">ID</th>
              <th className="has-text-centered">ROLE</th>
              <th className="has-text-centered">TOPIC</th>
              <th className="has-text-centered">CREATED AT</th>
              <th className="has-text-centered">ACTION</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="has-text-centered">{item.id}</td>
                <td>{item.role}</td>
                <td><span className="tag is-dark">{item.topic}</span></td>
                <td className="has-text-centered">{item.createdAt}</td>
                <td className="has-text-centered">
                  <button className="button is-danger" onClick={() => this.deleteRoleTopic(item.id)}>
                    <i className="far fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="pagination-container is-small" role="navigation" aria-label="pagination">
          <span className="pagination-title">Page:</span>
          {pages.map((p) => (
            p === page ? (
              <button key={p} className="pagination-link is-current is-small">{p}</button>
            ) : (
                <button key={p} className="pagination-link is-small" onClick={() => this.browsePage(p)}>{p}</button>
              )
          ))}
        </nav>
        <div className="modal" ref={this.modalElementRef}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Add New Role</p>
              <button className="delete" onClick={this.closeModal}
                aria-label="close"></button>
            </header>
            <section className="modal-card-body">
              <form>
                <div className="field">
                  <label className="label">Role*</label>
                  <div className="control">
                    <input value={this.state.role}
                      className="input" type="text" placeholder="Role"
                      onChange={(e) => this.setState({ role: e.target.value })} />
                  </div>
                </div>
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
              </form>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-primary" onClick={() => {this.addRoleTopic}}>Add</button>
              <button className="button" onClick={this.closeModal}>Cancel</button>
            </footer>
          </div>
        </div>
        <div className="Row">
          <button className="button is-link" onClick={() => this.props.history.push('/')}>Back To Home</button>
          <button onClick={() => { this.props.history.push('/addhook') }}
            className="button pull-right is-primary" onClick={this.openModal}
            id="add-new-resthook">Add New Role Topic</button>
        </div>
      </div>
    );
  }
}

export default RoleTopics;
