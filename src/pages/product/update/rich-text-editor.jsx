import React, { Component } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string.isRequired
  }

  // 将富文本的特定格式转为html，并展示请求到的富文本内容
  constructor(props) {
    super(props);
    const blocksFromHtml = htmlToDraft(this.props.detail);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);

    this.state = {
      editorState
    };
  }

  state = {
    editorState: EditorState.createEmpty(this.props.detail),
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        // wrapperClassName="editor-wrapper"
        editorClassName="editor"
        onEditorStateChange={this.onEditorStateChange}
        
      />
    );
  }
}