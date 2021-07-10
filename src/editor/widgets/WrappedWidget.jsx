import React, { Component } from 'react';

export default class WrappedWidget extends Component {
  constructor(props) {
    super(props);

    this.element = React.createRef();
  }

  updateWidget(props) {
    const widgetEl = this.props.widget({
      annotation: props.annotation,
      readOnly: props.readOnly,
      ...this.props.config,
      onAppendBody: body => props.onAppendBody(body),
      onUpdateBody: (previous, updated) => props.onUpdateBody(previous, updated),
      onRemoveBody: body => props.onRemoveBody(body),
      onSaveAndClose: () => props.onSaveAndClose()
    });

    // Delete previous rendered state
    while (this.element.current.firstChild)
      this.element.current.removeChild(this.element.current.lastChild);

    this.element.current.appendChild(widgetEl);
  }

  componentDidMount() {
    this.updateWidget(this.props);
  }

  componentWillReceiveProps(next) {
    if (this.element.current) {
      if (this.props.annotation !== next.annotation) {
        this.updateWidget(next);
      }
    }
  }

  render() {
    return (
      <div ref={this.element} className="widget"></div>
    )
  }

}
