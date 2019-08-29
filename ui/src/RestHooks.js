import React, { Component } from 'react';
import './RestHooks.css';
import API from './services/API';
import config from './config/config';

const pageSize = Number(config.PAGE_SIZE);

class RestHooks extends Component {
  constructor() {
    super();
    this.state = {
      hooks: [],
      page: 1,
      total: 0
    };
    this.deleteHook = this.deleteHook.bind(this);
    this.browsePage = this.browsePage.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // defining element references
    this.modalElementRef = React.createRef();
    this.preElementRef = React.createRef();
  }

  componentDidMount() {
    this.browsePage(1);
  }

  browsePage(p) {
    const _self = this;
    API.getAllHooks({ offset: (p - 1) * pageSize, limit: pageSize }, (res) => {
      _self.setState({ hooks: res.hooks, total: res.total, page: p });
    });
  }

  deleteHook(id) {
    const _self = this;
    API.deleteHook(id, () => {
      _self.browsePage(_self.state.page);
    });
  }

  /**
   * Opens a modal displaying the hook filter value
   * @param {*} hookFilter
   */
  openModal(filter) {
    this.modalElementRef.current.style.display = 'flex';
    this.preElementRef.current.textContent = filter;
  }

  /**
   * Closes the modal
   */
  closeModal() {
    this.modalElementRef.current.style.display = 'none';
  }

  render() {
    const { hooks, page, total } = this.state;
    let pageCount = Math.ceil(total / pageSize);
    if (pageCount < 1) pageCount = 1;
    const pages = [];
    for (let i = 1; i <= pageCount; i += 1) pages.push(i);

    return (
      <div>
        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead className="thead">
            <tr>
              <th className="has-text-centered">ID</th>
              <th className="has-text-centered">TOPIC</th>
              <th className="has-text-centered">ENDPOINT</th>
              <th className="has-text-centered">RULE</th>
              <th className="has-text-centered">CREATED AT</th>
              <th className="has-text-centered">UPDATED AT</th>
              <th className="has-text-centered">ACTION</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {hooks.map((hook) => (
              <tr key={hook.id}>
                <td className="has-text-centered">{hook.id}</td>
                <td><span className="tag is-dark">{hook.topic}</span></td>
                <td>{hook.endpoint}</td>
                <td>
                  <div className="control has-text-centered">
                    {
                      hook.filter ? (
                        <a className="button" id="rule-btn" onClick={() => this.openModal(hook.filter)}>
                          <i className="far fa-eye"></i>
                        </a>
                      ) : ""
                    }
                  </div>
                </td>
                <td className="has-text-centered">{hook.createdAt}</td>
                <td className="has-text-centered">{hook.updatedAt}</td>
                <td className="has-text-centered">
                  <button className="button is-link"
                    onClick={() => { this.props.history.push('/updatehook/' + hook.id) }}>
                    <i className="far fa-edit"></i>
                  </button>
                  <button className="button is-danger"
                    onClick={() => this.deleteHook(hook.id)}>
                    <i className="far fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <table className="RestHooksTable">

            
          </table> */}
        {/* <br /> */}
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
        {/* <br /> */}
        <button onClick={() => { this.props.history.push('/addhook') }}
          className="button pull-right is-primary" id="add-new-resthook">Add New Resthook</button>
        {this.props.currentUser.isAdmin && (
          <button className="button pull-right is-primary" id="manage-role-topics"
            onClick={() => { this.props.history.push('/roletopics') }}>Manage Role Topics</button>
        )}
        <div className="modal" ref={this.modalElementRef} id="rule-modal">
          <div className="modal-background"></div>
          <div className="modal-content">
            <pre ref={this.preElementRef}></pre>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
        </div>
      </div>
    );
  }
}

export default RestHooks;
