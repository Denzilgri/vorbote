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

  render() {
    const { hooks, page, total } = this.state;
    console.log(this.state.isLoggedIn)
    let pageCount = Math.ceil(total / pageSize);
    if (pageCount < 1) pageCount = 1;
    const pages = [];
    for (let i = 1; i <= pageCount; i += 1) pages.push(i);

    return (
      <div>
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead class="thead">
            <tr>
              <th class="has-text-centered">ID</th>
              <th class="has-text-centered">TOPIC</th>
              <th class="has-text-centered">ENDPOINT</th>
              <th class="has-text-centered">RULE</th>
              <th class="has-text-centered">CREATED AT</th>
              <th class="has-text-centered">UPDATED AT</th>
              <th class="has-text-centered">ACTION</th>
            </tr>
          </thead>
          <tbody class="tbody">
            {hooks.map((hook) => (
              <tr key={hook.id}>
                <td class="has-text-centered">{hook.id}</td>
                <td><span class="tag is-dark">{hook.topic}</span></td>
                <td>{hook.endpoint}</td>
                <td>
                  <div class="control has-text-centered">
                    <a class="button" id="rule-btn">
                      <i class="far fa-eye"></i>
                    </a>
                    <div class="modal" id="rule-modal">
                      <div class="modal-background"></div>
                      <div class="modal-content">
                        <pre>{hook.filter}</pre>
                      </div>
                      <button class="modal-close is-large" aria-label="close"></button>
                    </div>
                  </div>
                </td>
                <td class="has-text-centered">{hook.createdAt}</td>
                <td class="has-text-centered">{hook.updatedAt}</td>
                <td>
                  <div class="buttons">
                    <button className="button is-link"
                      onClick={() => { this.props.history.push('/updatehook/' + hook.id) }}>
                      <i class="far fa-edit"></i>
                    </button>
                    <button className="button is-danger"
                      onClick={() => this.deleteHook(hook.id)}>
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <table className="RestHooksTable">

            
          </table> */}
        <br />
        <nav class="pagination is-small" role="navigation" aria-label="pagination">
          Page:
          {pages.map((p) => (
            p === page ? (
              <button key={p} className="pagination-link is-current is-small">{p}</button>
            ) : (
                <button key={p} className="pagination-link is-small" onClick={() => this.browsePage(p)}>{p}</button>
              )
          ))}
        </nav>
        <br />
        <button onClick={() => { this.props.history.push('/addhook') }}
          className="button pull-right is-primary" id="add-new-resthook">Add New Resthook</button>
        {this.props.currentUser.isAdmin && (
          <button className="button pull-right is-primary" id="manage-role-topics"
            onClick={() => { this.props.history.push('/roletopics') }}>Manage Role Topics</button>
        )}
      </div>
    );
  }
}

export default RestHooks;
